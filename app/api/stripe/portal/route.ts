export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { createPortalSession } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';

export async function POST() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const stripeCustomerId = session.user.stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { message: 'No active subscription' },
        { status: 400 }
      );
    }

    const portalSession = await createPortalSession({
      customerId: stripeCustomerId,
      returnUrl: absoluteUrl('/settings/billing'),
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
