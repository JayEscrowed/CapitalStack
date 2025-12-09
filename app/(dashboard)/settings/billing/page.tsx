'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  CheckCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PLANS, hasAccess } from '@/lib/stripe';

export default function BillingPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const userPlan = (session?.user?.plan as keyof typeof PLANS) || 'FREE';
  const currentPeriodEnd = session?.user?.stripeCurrentPeriodEnd;

  const handleSubscribe = async (planKey: string) => {
    setLoading(planKey);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
    } finally {
      setPortalLoading(false);
    }
  };

  const plans = [
    {
      key: 'STARTER',
      ...PLANS.STARTER,
    },
    {
      key: 'PROFESSIONAL',
      ...PLANS.PROFESSIONAL,
    },
    {
      key: 'ENTERPRISE',
      ...PLANS.ENTERPRISE,
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold">Billing & Subscription</h1>
          <p className="text-obsidian-500 mt-1">
            Manage your subscription and billing details
          </p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gold-500" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{PLANS[userPlan]?.name || 'Free'}</h3>
                  {userPlan !== 'FREE' && (
                    <Badge variant="gold">Active</Badge>
                  )}
                </div>
                <p className="text-sm text-obsidian-500 mt-1">
                  {PLANS[userPlan]?.description}
                </p>
                {currentPeriodEnd && userPlan !== 'FREE' && (
                  <p className="text-xs text-obsidian-400 mt-2">
                    Next billing date: {new Date(currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              {session?.user?.stripeCustomerId && userPlan !== 'FREE' && (
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  Manage Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div>
          <h2 className="font-semibold mb-4">
            {userPlan === 'FREE' ? 'Choose a Plan' : 'Available Plans'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const isCurrentPlan = userPlan === plan.key;
              const isPopular = plan.key === 'PROFESSIONAL';
              
              return (
                <motion.div
                  key={plan.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`relative h-full ${
                      isPopular ? 'border-gold-500/50 shadow-gold-md' : ''
                    } ${isCurrentPlan ? 'ring-2 ring-gold-500' : ''}`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="gold">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-sm text-obsidian-500 mb-4">
                        {plan.description}
                      </p>
                      
                      <div className="mb-6">
                        <span className={`text-4xl font-bold ${isPopular ? 'text-gold-gradient' : ''}`}>
                          ${plan.price}
                        </span>
                        <span className="text-obsidian-500">/month</span>
                      </div>
                      
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {isCurrentPlan ? (
                        <Button variant="outline" className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : plan.key === 'ENTERPRISE' ? (
                        <Button
                          variant={isPopular ? 'gold' : 'outline'}
                          className="w-full"
                          onClick={() => window.location.href = 'mailto:sales@capitalstack.io'}
                        >
                          Contact Sales
                        </Button>
                      ) : (
                        <Button
                          variant={isPopular ? 'gold' : 'outline'}
                          className="w-full"
                          onClick={() => handleSubscribe(plan.key)}
                          disabled={loading === plan.key}
                        >
                          {loading === plan.key ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : hasAccess(userPlan, plan.key as any) ? (
                            'Current Access Level'
                          ) : (
                            <>
                              Upgrade
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Can I cancel anytime?</h4>
              <p className="text-sm text-obsidian-500">
                Yes, you can cancel your subscription at any time. Your access will continue
                until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">What payment methods do you accept?</h4>
              <p className="text-sm text-obsidian-500">
                We accept all major credit cards including Visa, Mastercard, American Express,
                and Discover. Enterprise customers can pay via invoice.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Do you offer refunds?</h4>
              <p className="text-sm text-obsidian-500">
                We offer a 7-day free trial on all plans. If you're not satisfied within the
                first 30 days, contact us for a full refund.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
