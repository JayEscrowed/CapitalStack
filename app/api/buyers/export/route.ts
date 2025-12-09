import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasAccess } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userPlan = session.user.plan || 'FREE';
    
    // Only Pro+ can export
    if (!hasAccess(userPlan, 'PROFESSIONAL')) {
      return NextResponse.json(
        { error: 'Upgrade to Professional to export data' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { company: { contains: search, mode: 'insensitive' } },
        { buyBox: { contains: search, mode: 'insensitive' } },
        { markets: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category && category !== 'All Categories') {
      where.category = { contains: category, mode: 'insensitive' };
    }

    // Fetch all matching buyers
    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: { company: 'asc' },
      select: {
        company: true,
        category: true,
        buyBox: true,
        markets: true,
        dealSize: true,
        email: true,
        phone: true,
        hq: true,
        sourceUrl: true,
      },
    });

    // Log export
    await prisma.exportHistory.create({
      data: {
        userId: session.user.id,
        type: 'BUYERS',
        count: buyers.length,
        filters: { search, category },
      },
    }).catch(() => {});

    // Generate CSV
    const headers = ['Company', 'Category', 'Buy Box', 'Markets', 'Deal Size', 'Email', 'Phone', 'HQ', 'Website'];
    const rows = buyers.map(buyer => [
      escapeCSV(buyer.company),
      escapeCSV(buyer.category || ''),
      escapeCSV(buyer.buyBox || ''),
      escapeCSV(buyer.markets || ''),
      escapeCSV(buyer.dealSize || ''),
      escapeCSV(buyer.email || ''),
      escapeCSV(buyer.phone || ''),
      escapeCSV(buyer.hq || ''),
      escapeCSV(buyer.sourceUrl || ''),
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="capitalstack-buyers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export buyers' },
      { status: 500 }
    );
  }
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
