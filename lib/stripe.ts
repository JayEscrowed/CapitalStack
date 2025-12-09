import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Pricing Plans Configuration
export const PLANS = {
  FREE: {
    name: 'Free',
    description: 'Get started with limited access',
    price: 0,
    priceId: null,
    features: [
      '10 buyer profiles/month',
      'Basic search filters',
      'Company information only',
      'Email support',
    ],
    limits: {
      buyerViews: 10,
      contactViews: 0,
      exports: 0,
      searches: 20,
    },
  },
  STARTER: {
    name: 'Starter',
    description: 'For individual investors',
    price: 97,
    priceId: process.env.STRIPE_PRICE_STARTER,
    features: [
      '100 buyer profiles/month',
      'Basic contact info',
      'Market filters',
      'Email support',
      '10 exports/month',
    ],
    limits: {
      buyerViews: 100,
      contactViews: 50,
      exports: 10,
      searches: 100,
    },
  },
  PROFESSIONAL: {
    name: 'Professional',
    description: 'For active dealmakers',
    price: 297,
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL,
    popular: true,
    features: [
      'Full database access (325+ buyers)',
      'Direct emails & phone numbers',
      'Advanced search & filters',
      'Unlimited exports',
      'Priority support',
      'Weekly data updates',
      '1,000+ contacts',
    ],
    limits: {
      buyerViews: -1, // Unlimited
      contactViews: -1,
      exports: -1,
      searches: -1,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    description: 'For teams and institutions',
    price: 997,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE,
    features: [
      'Everything in Professional',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      '5 team seats',
      'Custom data requests',
      'White-glove onboarding',
    ],
    limits: {
      buyerViews: -1,
      contactViews: -1,
      exports: -1,
      searches: -1,
      teamSeats: 5,
      apiAccess: true,
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS;

// Check if user has access to a feature
export function hasAccess(userPlan: string, requiredPlan: PlanKey): boolean {
  const planOrder: PlanKey[] = ['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'];
  const userIndex = planOrder.indexOf(userPlan as PlanKey);
  const requiredIndex = planOrder.indexOf(requiredPlan);
  return userIndex >= requiredIndex;
}

// Get remaining usage for a limit
export function getRemainingUsage(
  userPlan: string,
  limitType: 'buyerViews' | 'contactViews' | 'exports' | 'searches',
  currentUsage: number
): number {
  const plan = PLANS[userPlan as PlanKey];
  if (!plan) return 0;
  
  const limit = plan.limits[limitType];
  if (limit === -1) return Infinity; // Unlimited
  return Math.max(0, limit - currentUsage);
}

// Check if subscription is active
export function isSubscriptionActive(stripeCurrentPeriodEnd: Date | null): boolean {
  if (!stripeCurrentPeriodEnd) return false;
  return new Date(stripeCurrentPeriodEnd) > new Date();
}

// Create checkout session
export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
    allow_promotion_codes: true,
  });

  return session;
}

// Create customer portal session
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Get price ID for plan
export function getPriceIdForPlan(plan: PlanKey): string | null {
  return PLANS[plan]?.priceId || null;
}

// Get plan from price ID
export function getPlanFromPriceId(priceId: string): PlanKey {
  for (const [key, value] of Object.entries(PLANS)) {
    if (value.priceId === priceId) {
      return key as PlanKey;
    }
  }
  return 'FREE';
}
