import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { buyerId, saved, notes } = body;

    if (!buyerId) {
      return NextResponse.json({ error: 'Buyer ID required' }, { status: 400 });
    }

    if (saved) {
      // Save buyer
      await prisma.savedBuyer.upsert({
        where: {
          userId_buyerId: {
            userId: session.user.id,
            buyerId,
          },
        },
        update: {
          notes: notes || null,
        },
        create: {
          userId: session.user.id,
          buyerId,
          notes: notes || null,
        },
      });
    } else {
      // Unsave buyer
      await prisma.savedBuyer.deleteMany({
        where: {
          userId: session.user.id,
          buyerId,
        },
      });
    }

    return NextResponse.json({ success: true, saved });
  } catch (error) {
    console.error('Save buyer error:', error);
    return NextResponse.json(
      { error: 'Failed to save buyer' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savedBuyers = await prisma.savedBuyer.findMany({
      where: { userId: session.user.id },
      include: {
        buyer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      savedBuyers: savedBuyers.map(sb => ({
        ...sb.buyer,
        savedAt: sb.createdAt,
        notes: sb.notes,
      })),
    });
  } catch (error) {
    console.error('Get saved buyers error:', error);
    return NextResponse.json(
      { error: 'Failed to get saved buyers' },
      { status: 500 }
    );
  }
}
