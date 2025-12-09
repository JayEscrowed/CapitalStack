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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const market = searchParams.get('market') || '';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const userPlan = session.user.plan || 'FREE';
    const hasFullAccess = hasAccess(userPlan, 'PROFESSIONAL');

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
    
    if (market) {
      where.markets = { contains: market, mode: 'insensitive' };
    }

    // Fetch buyers
    const [buyers, total] = await Promise.all([
      prisma.buyer.findMany({
        where,
        orderBy: { company: 'asc' },
        take: hasFullAccess ? limit : 10,
        skip: offset,
        select: {
          id: true,
          company: true,
          category: true,
          buyBox: true,
          markets: true,
          dealSize: true,
          submitDeal: true,
          email: hasAccess(userPlan, 'STARTER') ? true : false,
          phone: hasAccess(userPlan, 'STARTER') ? true : false,
          hq: true,
          sourceUrl: true,
          verified: true,
        },
      }),
      prisma.buyer.count({ where }),
    ]);

    // Log search for analytics
    if (search || category || market) {
      await prisma.searchHistory.create({
        data: {
          userId: session.user.id,
          query: search || '',
          filters: { category, market },
          results: total,
        },
      }).catch(() => {}); // Don't fail if logging fails
    }

    return NextResponse.json({
      buyers,
      total,
      hasMore: offset + buyers.length < total,
    });
  } catch (error) {
    console.error('Buyers API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyers' },
      { status: 500 }
    );
  }
}
