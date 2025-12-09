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
    const { contactId, saved, notes } = body;

    if (!contactId) {
      return NextResponse.json({ error: 'Contact ID required' }, { status: 400 });
    }

    if (saved) {
      // Save contact
      await prisma.savedContact.upsert({
        where: {
          userId_contactId: {
            userId: session.user.id,
            contactId,
          },
        },
        update: {
          notes: notes || null,
        },
        create: {
          userId: session.user.id,
          contactId,
          notes: notes || null,
        },
      });
    } else {
      // Unsave contact
      await prisma.savedContact.deleteMany({
        where: {
          userId: session.user.id,
          contactId,
        },
      });
    }

    return NextResponse.json({ success: true, saved });
  } catch (error) {
    console.error('Save contact error:', error);
    return NextResponse.json(
      { error: 'Failed to save contact' },
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

    const savedContacts = await prisma.savedContact.findMany({
      where: { userId: session.user.id },
      include: {
        contact: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      savedContacts: savedContacts.map(sc => ({
        ...sc.contact,
        savedAt: sc.createdAt,
        notes: sc.notes,
      })),
    });
  } catch (error) {
    console.error('Get saved contacts error:', error);
    return NextResponse.json(
      { error: 'Failed to get saved contacts' },
      { status: 500 }
    );
  }
}
