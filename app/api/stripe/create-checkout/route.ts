import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { createCheckoutSession, PLANS, PlanKey } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { absoluteUrl } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planKey } = body as { planKey: PlanKey };

    if (!planKey || !PLANS[planKey]?.priceId) {
      return NextResponse.json(
        { message: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const checkoutSession = await createCheckoutSession({
      priceId: PLANS[planKey].priceId!,
      userId: user.id,
      userEmail: user.email!,
      successUrl: absoluteUrl('/dashboard?success=true'),
      cancelUrl: absoluteUrl('/pricing?canceled=true'),
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
