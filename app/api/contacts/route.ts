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
    
    // Free users can't access contacts
    if (!hasAccess(userPlan, 'STARTER')) {
      return NextResponse.json(
        { error: 'Upgrade required to access contacts' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const title = searchParams.get('title') || '';
    const company = searchParams.get('company') || '';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const hasFullAccess = hasAccess(userPlan, 'PROFESSIONAL');

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (title && title !== 'All Titles') {
      where.title = { contains: title, mode: 'insensitive' };
    }
    
    if (company) {
      where.company = { contains: company, mode: 'insensitive' };
    }

    // Fetch contacts
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' },
        ],
        take: hasFullAccess ? limit : 50,
        skip: offset,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          fullName: true,
          email: true,
          phone: true,
          title: true,
          linkedin: true,
          company: true,
          verified: true,
        },
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      contacts,
      total,
      hasMore: offset + contacts.length < total,
    });
  } catch (error) {
    console.error('Contacts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
