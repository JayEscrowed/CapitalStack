'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Users,
  Building2,
  TrendingUp,
  Shield,
  Download,
  ArrowRight,
  CheckCircle,
  Database,
  Mail,
  Phone,
  ExternalLink,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { value: '325+', label: 'Verified Buyers' },
  { value: '$2.1T', label: 'Combined AUM' },
  { value: '50+', label: 'Markets Covered' },
  { value: 'Weekly', label: 'Data Updates' },
];

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Filter by asset class, market, deal size, and investment criteria to find your perfect buyer match.',
  },
  {
    icon: Shield,
    title: 'Verified Contacts',
    description: 'Direct emails and phone numbers for acquisition professionals, VPs, and decision-makers.',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Updates',
    description: 'Our team updates the database weekly to ensure you have the latest buy box and contact information.',
  },
  {
    icon: Building2,
    title: 'National Coverage',
    description: 'Buyers active in 50+ major US metros with focus on Sun Belt and growth markets.',
  },
  {
    icon: Users,
    title: 'Decision Makers',
    description: '1,000+ contacts including acquisition directors, VPs, and C-suite executives.',
  },
  {
    icon: Download,
    title: 'Export to CSV',
    description: 'Download buyer lists and contacts instantly. Integrate with your CRM or outreach tools.',
  },
];

const buyers = [
  { company: 'Invitation Homes', category: 'SFR Operator/REIT', markets: 'Phoenix, Atlanta, Tampa, Dallas, Charlotte', dealSize: '$10M - $500M' },
  { company: 'American Homes 4 Rent', category: 'SFR Operator/REIT', markets: 'Phoenix, Las Vegas, Nashville, Austin', dealSize: '$25M - $250M' },
  { company: 'Pretium Partners', category: 'Private Equity', markets: 'Southeast, Southwest, Midwest', dealSize: '$50M - $500M' },
  { company: 'Tricon Residential', category: 'SFR Operator', markets: 'Phoenix, Atlanta, Charlotte, Dallas', dealSize: '$20M - $200M' },
  { company: 'NexMetro Communities', category: 'BTR Developer', markets: 'Phoenix, Denver, Dallas, Austin', dealSize: '$15M - $100M' },
];

const trustLogos = [
  'Blackstone', 'Invitation Homes', 'AMH', 'Pretium', 'Starwood',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl float-slow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl float-medium" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="gold" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              The #1 Institutional Buyer Database
            </Badge>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Connect with{' '}
              <span className="text-gold-gradient">Elite</span>{' '}
              Real Estate Buyers
            </h1>
            
            <p className="text-xl text-obsidian-500 mb-8 max-w-2xl mx-auto">
              Access 325+ verified institutional buyers including hedge funds, REITs, and private equity firms actively acquiring properties nationwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="gold" size="xl" className="group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#database">
                <Button variant="outline" size="xl">
                  View Database
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-obsidian-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="py-12 border-y border-obsidian-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-obsidian-500 mb-6">
            Trusted by dealmakers working with
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
            {trustLogos.map((logo) => (
              <span key={logo} className="text-lg font-semibold text-obsidian-600">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="text-gold-gradient">Close Deals</span>
            </h2>
            <p className="text-obsidian-500 max-w-2xl mx-auto">
              Our platform gives you direct access to institutional buyers and the tools to connect with decision-makers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-gold-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-obsidian-500">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Database Preview */}
      <section id="database" className="py-20 bg-obsidian-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Preview the{' '}
              <span className="text-gold-gradient">Database</span>
            </h2>
            <p className="text-obsidian-500 max-w-2xl mx-auto">
              Get a glimpse of the institutional buyers in our database. Full access available with subscription.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card>
              <div className="overflow-x-auto">
                <table className="table-premium">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Category</th>
                      <th>Target Markets</th>
                      <th>Deal Size</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyers.map((buyer, index) => (
                      <tr key={index}>
                        <td className="font-medium">{buyer.company}</td>
                        <td>
                          <Badge variant="gold">{buyer.category}</Badge>
                        </td>
                        <td className="text-obsidian-500">{buyer.markets}</td>
                        <td className="text-obsidian-500">{buyer.dealSize}</td>
                        <td>
                          <div className="flex items-center gap-2 text-obsidian-400">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs">Subscribe to unlock</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-obsidian-200 text-center">
                <p className="text-sm text-obsidian-500 mb-4">
                  Viewing 5 of 325+ buyers in database
                </p>
                <Link href="/register">
                  <Button variant="gold">
                    Unlock Full Database
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent{' '}
              <span className="text-gold-gradient">Pricing</span>
            </h2>
            <p className="text-obsidian-500 max-w-2xl mx-auto">
              Choose the plan that fits your deal flow. All plans include access to verified buyer data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="relative">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Starter</h3>
                <p className="text-sm text-obsidian-500 mb-4">For individual investors</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$97</span>
                  <span className="text-obsidian-500">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {['100 buyer profiles/month', 'Basic contact info', 'Market filters', 'Email support'].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-gold-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional */}
            <Card className="relative border-gold-500/50 shadow-gold-md">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="gold">Most Popular</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Professional</h3>
                <p className="text-sm text-obsidian-500 mb-4">For active dealmakers</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gold-gradient">$297</span>
                  <span className="text-obsidian-500">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {['Full database access', 'Direct emails & phones', 'Advanced filters', 'Unlimited exports', 'Priority support', 'Weekly updates'].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-gold-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button variant="gold" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="relative">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
                <p className="text-sm text-obsidian-500 mb-4">For teams and institutions</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$997</span>
                  <span className="text-obsidian-500">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {['Everything in Pro', 'API access', 'Custom integrations', 'Dedicated manager', '5 team seats', 'Custom requests'].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-gold-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-gold-500/30 bg-gradient-to-br from-obsidian-50 to-obsidian">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Close More{' '}
                <span className="text-gold-gradient">Deals</span>?
              </h2>
              <p className="text-obsidian-500 mb-8 max-w-xl mx-auto">
                Join hundreds of dealmakers using CapitalStack to connect with institutional buyers and close more transactions.
              </p>
              <Link href="/register">
                <Button variant="gold" size="xl" className="group">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-xs text-obsidian-500 mt-4">
                No credit card required • 7-day free trial
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
