'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Search,
  Download,
  TrendingUp,
  Star,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PLANS, hasAccess } from '@/lib/stripe';

const recentBuyers = [
  { company: 'Invitation Homes', category: 'SFR Operator', time: '2 hours ago' },
  { company: 'Pretium Partners', category: 'Private Equity', time: '5 hours ago' },
  { company: 'NexMetro Communities', category: 'BTR Developer', time: '1 day ago' },
  { company: 'Tricon Residential', category: 'SFR Operator', time: '2 days ago' },
];

const quickActions = [
  {
    title: 'Search Buyers',
    description: 'Find buyers by market, asset class, or deal size',
    icon: Search,
    href: '/buyers',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Browse Contacts',
    description: 'Access decision-makers at institutional buyers',
    icon: Users,
    href: '/contacts',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    title: 'Export Data',
    description: 'Download buyer lists and contacts to CSV',
    icon: Download,
    href: '/buyers',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Saved Buyers',
    description: 'View your saved buyers and contacts',
    icon: Star,
    href: '/saved',
    color: 'text-gold-500',
    bg: 'bg-gold-500/10',
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  
  const userPlan = (session?.user?.plan as keyof typeof PLANS) || 'FREE';
  const plan = PLANS[userPlan];
  const isPro = hasAccess(userPlan, 'PROFESSIONAL');

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl md:text-3xl font-bold"
          >
            Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}
          </motion.h1>
          <p className="text-obsidian-500 mt-1">
            Access institutional buyers and close more deals
          </p>
        </div>

        {/* Plan Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={isPro ? 'border-gold-500/30' : ''}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${isPro ? 'bg-gold-500/20' : 'bg-obsidian-100'} flex items-center justify-center`}>
                    <Sparkles className={`w-6 h-6 ${isPro ? 'text-gold-500' : 'text-obsidian-500'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{plan.name} Plan</h3>
                      {isPro && <Badge variant="gold">Active</Badge>}
                    </div>
                    <p className="text-sm text-obsidian-500">{plan.description}</p>
                  </div>
                </div>
                
                {!isPro && (
                  <Link href="/settings/billing">
                    <Button variant="gold">
                      Upgrade Plan
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-obsidian-200">
                <div>
                  <p className="text-2xl font-bold">325+</p>
                  <p className="text-xs text-obsidian-500">Total Buyers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">1,000+</p>
                  <p className="text-xs text-obsidian-500">Contacts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-xs text-obsidian-500">Markets</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">Weekly</p>
                  <p className="text-xs text-obsidian-500">Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link href={action.href}>
                  <Card hover className="h-full cursor-pointer group">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center mb-3`}>
                        <action.icon className={`w-5 h-5 ${action.color}`} />
                      </div>
                      <h3 className="font-medium mb-1 group-hover:text-gold-500 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-obsidian-500">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recently Added Buyers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gold-500" />
                  Recently Added Buyers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBuyers.map((buyer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-obsidian-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{buyer.company}</p>
                        <p className="text-xs text-obsidian-500">{buyer.category}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-obsidian-400">
                        <Clock className="w-3 h-3" />
                        {buyer.time}
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/buyers">
                  <Button variant="ghost" className="w-full mt-4">
                    View All Buyers
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Markets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gold-500" />
                  Top Active Markets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { market: 'Phoenix, AZ', buyers: 45, trend: '+12%' },
                    { market: 'Atlanta, GA', buyers: 42, trend: '+8%' },
                    { market: 'Dallas, TX', buyers: 38, trend: '+15%' },
                    { market: 'Tampa, FL', buyers: 35, trend: '+10%' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-obsidian-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{item.market}</p>
                        <p className="text-xs text-obsidian-500">{item.buyers} active buyers</p>
                      </div>
                      <Badge variant="gold" className="text-xs">
                        {item.trend}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Link href="/buyers?sort=market">
                  <Button variant="ghost" className="w-full mt-4">
                    Explore Markets
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Pro Features CTA (for free users) */}
        {!isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-gold-500/30 bg-gradient-to-br from-obsidian-50 to-obsidian overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />
                <div className="relative">
                  <Badge variant="gold" className="mb-4">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Pro Feature
                  </Badge>
                  <h3 className="font-display text-xl font-bold mb-2">
                    Unlock Full Database Access
                  </h3>
                  <p className="text-obsidian-500 mb-6 max-w-xl">
                    Get unlimited access to all 325+ buyers, 1,000+ contacts, direct emails & phone
                    numbers, CSV exports, and weekly data updates.
                  </p>
                  <Link href="/settings/billing">
                    <Button variant="gold" size="lg">
                      Upgrade to Professional
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardShell>
  );
}
