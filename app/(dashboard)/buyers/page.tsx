'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Building2,
  MapPin,
  DollarSign,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  X,
  Loader2,
  Lock,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { hasAccess, PLANS } from '@/lib/stripe';

interface Buyer {
  id: string;
  company: string;
  category: string | null;
  buyBox: string | null;
  markets: string | null;
  dealSize: string | null;
  submitDeal: string | null;
  email: string | null;
  phone: string | null;
  hq: string | null;
  sourceUrl: string | null;
  verified: boolean;
}

const CATEGORIES = [
  'All Categories',
  'SFR Operator / REIT',
  'BTR Developer',
  'Multifamily Owner-Operator',
  'Multifamily REIT',
  'Multifamily Investor',
  'Net Lease REIT',
  'Industrial REIT',
  'Private Equity',
  'Developer / Investor',
  'Hospitality REIT',
];

export default function BuyersPage() {
  const { data: session } = useSession();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savedBuyers, setSavedBuyers] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);

  const userPlan = session?.user?.plan || 'FREE';
  const canViewContacts = hasAccess(userPlan, 'STARTER');
  const canExport = hasAccess(userPlan, 'PROFESSIONAL');
  const hasFullAccess = hasAccess(userPlan, 'PROFESSIONAL');

  // Fetch buyers
  useEffect(() => {
    async function fetchBuyers() {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (category !== 'All Categories') params.set('category', category);

        const res = await fetch(`/api/buyers?${params.toString()}`);
        const data = await res.json();
        setBuyers(data.buyers || []);
      } catch (error) {
        console.error('Failed to fetch buyers:', error);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchBuyers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, category]);

  // Toggle save buyer
  const toggleSaveBuyer = async (buyerId: string) => {
    const newSaved = new Set(savedBuyers);
    if (newSaved.has(buyerId)) {
      newSaved.delete(buyerId);
    } else {
      newSaved.add(buyerId);
    }
    setSavedBuyers(newSaved);
    
    // API call to save/unsave
    await fetch('/api/buyers/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerId, saved: newSaved.has(buyerId) }),
    });
  };

  // Export to CSV
  const handleExport = async () => {
    if (!canExport) return;
    setExporting(true);
    
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (category !== 'All Categories') params.set('category', category);
      params.set('format', 'csv');

      const res = await fetch(`/api/buyers/export?${params.toString()}`);
      const blob = await res.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `capitalstack-buyers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  // Limit results for free users
  const displayBuyers = hasFullAccess ? buyers : buyers.slice(0, 10);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Buyer Database</h1>
            <p className="text-sm text-obsidian-500">
              {hasFullAccess 
                ? `${buyers.length} institutional buyers found`
                : `Viewing ${displayBuyers.length} of ${buyers.length} buyers (upgrade for full access)`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={!canExport || exporting}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export CSV
              {!canExport && <Lock className="w-3 h-3 ml-2" />}
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <Input
                  placeholder="Search by company, market, or buy box..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchQuery || category !== 'All Categories') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setCategory('All Categories');
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
          </div>
        ) : displayBuyers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 mx-auto text-obsidian-400 mb-4" />
              <h3 className="font-semibold mb-2">No buyers found</h3>
              <p className="text-sm text-obsidian-500">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {displayBuyers.map((buyer) => (
                <motion.div
                  key={buyer.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${
                      expandedId === buyer.id ? 'ring-1 ring-gold-500/50' : ''
                    }`}
                    hover
                    onClick={() => setExpandedId(expandedId === buyer.id ? null : buyer.id)}
                  >
                    <CardContent className="p-4">
                      {/* Collapsed View */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-gold-500" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">
                                {buyer.company}
                              </h3>
                              {buyer.verified && (
                                <Badge variant="gold" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-obsidian-500">
                              {buyer.category && (
                                <span>{buyer.category}</span>
                              )}
                              {buyer.hq && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {buyer.hq}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveBuyer(buyer.id);
                            }}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                savedBuyers.has(buyer.id)
                                  ? 'fill-gold-500 text-gold-500'
                                  : ''
                              }`}
                            />
                          </Button>
                          {expandedId === buyer.id ? (
                            <ChevronUp className="w-5 h-5 text-obsidian-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-obsidian-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded View */}
                      <AnimatePresence>
                        {expandedId === buyer.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-obsidian-200 grid md:grid-cols-2 gap-4">
                              {/* Buy Box */}
                              {buyer.buyBox && (
                                <div>
                                  <h4 className="text-xs font-medium text-obsidian-500 uppercase tracking-wider mb-1">
                                    Buy Box
                                  </h4>
                                  <p className="text-sm">{buyer.buyBox}</p>
                                </div>
                              )}

                              {/* Markets */}
                              {buyer.markets && (
                                <div>
                                  <h4 className="text-xs font-medium text-obsidian-500 uppercase tracking-wider mb-1">
                                    Target Markets
                                  </h4>
                                  <p className="text-sm">{buyer.markets}</p>
                                </div>
                              )}

                              {/* Deal Size */}
                              {buyer.dealSize && (
                                <div>
                                  <h4 className="text-xs font-medium text-obsidian-500 uppercase tracking-wider mb-1">
                                    Deal Size
                                  </h4>
                                  <p className="text-sm flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    {buyer.dealSize}
                                  </p>
                                </div>
                              )}

                              {/* Contact Info */}
                              <div>
                                <h4 className="text-xs font-medium text-obsidian-500 uppercase tracking-wider mb-2">
                                  Contact
                                </h4>
                                {canViewContacts ? (
                                  <div className="flex flex-wrap gap-2">
                                    {buyer.email && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.location.href = `mailto:${buyer.email}`;
                                        }}
                                      >
                                        <Mail className="w-3 h-3 mr-1" />
                                        Email
                                      </Button>
                                    )}
                                    {buyer.phone && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.location.href = `tel:${buyer.phone}`;
                                        }}
                                      >
                                        <Phone className="w-3 h-3 mr-1" />
                                        Call
                                      </Button>
                                    )}
                                    {buyer.sourceUrl && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(buyer.sourceUrl!, '_blank');
                                        }}
                                      >
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        Website
                                      </Button>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-obsidian-400">
                                    <Lock className="w-4 h-4" />
                                    <span className="text-sm">
                                      Upgrade to view contact info
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Upgrade CTA for limited users */}
            {!hasFullAccess && buyers.length > displayBuyers.length && (
              <Card className="border-gold-500/30 bg-gradient-to-br from-obsidian-50 to-obsidian">
                <CardContent className="py-8 text-center">
                  <Lock className="w-8 h-8 mx-auto text-gold-500 mb-3" />
                  <h3 className="font-semibold mb-2">
                    Unlock {buyers.length - displayBuyers.length} More Buyers
                  </h3>
                  <p className="text-sm text-obsidian-500 mb-4">
                    Upgrade to Professional for full database access
                  </p>
                  <Button variant="gold" onClick={() => window.location.href = '/settings/billing'}>
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
