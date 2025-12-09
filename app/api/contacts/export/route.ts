export const dynamic = 'force-dynamic';
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
    const title = searchParams.get('title') || '';

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (title && title !== 'All Titles') {
      where.title = { contains: title, mode: 'insensitive' };
    }

    // Fetch all matching contacts
    const contacts = await prisma.contact.findMany({
      where,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        title: true,
        company: true,
        linkedin: true,
      },
    });

    // Log export
    await prisma.exportHistory.create({
      data: {
        userId: session.user.id,
        type: 'CONTACTS',
        count: contacts.length,
        filters: { search, title },
      },
    }).catch(() => {});

    // Generate CSV
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Title', 'Company', 'LinkedIn'];
    const rows = contacts.map(contact => [
      escapeCSV(contact.firstName || ''),
      escapeCSV(contact.lastName || ''),
      escapeCSV(contact.email || ''),
      escapeCSV(contact.phone || ''),
      escapeCSV(contact.title || ''),
      escapeCSV(contact.company || ''),
      escapeCSV(contact.linkedin || ''),
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="capitalstack-contacts-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export contacts' },
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
