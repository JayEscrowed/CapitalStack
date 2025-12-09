'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  User,
  Building2,
  Mail,
  Phone,
  Linkedin,
  ExternalLink,
  Star,
  X,
  Loader2,
  Lock,
  Briefcase,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { hasAccess } from '@/lib/stripe';

interface Contact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  linkedin: string | null;
  company: string | null;
  verified: boolean;
}

const TITLES = [
  'All Titles',
  'VP',
  'Director',
  'Managing Director',
  'Partner',
  'Principal',
  'President',
  'CEO',
  'COO',
  'CFO',
  'Acquisitions',
];

export default function ContactsPage() {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [titleFilter, setTitleFilter] = useState('All Titles');
  const [savedContacts, setSavedContacts] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);

  const userPlan = session?.user?.plan || 'FREE';
  const canViewContacts = hasAccess(userPlan, 'STARTER');
  const canExport = hasAccess(userPlan, 'PROFESSIONAL');
  const hasFullAccess = hasAccess(userPlan, 'PROFESSIONAL');

  // Fetch contacts
  useEffect(() => {
    async function fetchContacts() {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (titleFilter !== 'All Titles') params.set('title', titleFilter);

        const res = await fetch(`/api/contacts?${params.toString()}`);
        const data = await res.json();
        setContacts(data.contacts || []);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchContacts, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, titleFilter]);

  // Toggle save contact
  const toggleSaveContact = async (contactId: string) => {
    const newSaved = new Set(savedContacts);
    if (newSaved.has(contactId)) {
      newSaved.delete(contactId);
    } else {
      newSaved.add(contactId);
    }
    setSavedContacts(newSaved);
  };

  // Export to CSV
  const handleExport = async () => {
    if (!canExport) return;
    setExporting(true);
    
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (titleFilter !== 'All Titles') params.set('title', titleFilter);
      params.set('format', 'csv');

      const res = await fetch(`/api/contacts/export?${params.toString()}`);
      const blob = await res.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `capitalstack-contacts-${new Date().toISOString().split('T')[0]}.csv`;
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

  // Access gate for free users
  if (!canViewContacts) {
    return (
      <DashboardShell>
        <Card className="border-gold-500/30 bg-gradient-to-br from-obsidian-50 to-obsidian">
          <CardContent className="py-16 text-center">
            <Lock className="w-12 h-12 mx-auto text-gold-500 mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">
              Unlock 1,000+ Decision Makers
            </h2>
            <p className="text-obsidian-500 mb-6 max-w-md mx-auto">
              Get direct access to acquisition professionals, VPs, directors, and C-suite
              executives at institutional buyers.
            </p>
            <Button variant="gold" size="lg" onClick={() => window.location.href = '/settings/billing'}>
              Upgrade to Starter ($97/mo)
            </Button>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  const displayContacts = hasFullAccess ? contacts : contacts.slice(0, 50);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Contact Database</h1>
            <p className="text-sm text-obsidian-500">
              {hasFullAccess
                ? `${contacts.length} acquisition professionals found`
                : `Viewing ${displayContacts.length} of ${contacts.length} contacts (upgrade for full access)`
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
                  placeholder="Search by name, company, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={titleFilter} onValueChange={setTitleFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Title" />
                </SelectTrigger>
                <SelectContent>
                  {TITLES.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchQuery || titleFilter !== 'All Titles') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setTitleFilter('All Titles');
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
        ) : displayContacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="w-12 h-12 mx-auto text-obsidian-400 mb-4" />
              <h3 className="font-semibold mb-2">No contacts found</h3>
              <p className="text-sm text-obsidian-500">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {displayContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card hover className="h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-gold-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {contact.fullName || `${contact.firstName} ${contact.lastName}`}
                            </h3>
                            {contact.title && (
                              <p className="text-sm text-obsidian-500">{contact.title}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSaveContact(contact.id)}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              savedContacts.has(contact.id)
                                ? 'fill-gold-500 text-gold-500'
                                : ''
                            }`}
                          />
                        </Button>
                      </div>

                      {contact.company && (
                        <div className="flex items-center gap-2 text-sm text-obsidian-500 mb-3">
                          <Building2 className="w-4 h-4" />
                          {contact.company}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {contact.email && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `mailto:${contact.email}`}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        )}
                        {contact.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `tel:${contact.phone}`}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                        )}
                        {contact.linkedin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(contact.linkedin!, '_blank')}
                          >
                            <Linkedin className="w-3 h-3 mr-1" />
                            LinkedIn
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Upgrade CTA */}
        {!hasFullAccess && contacts.length > displayContacts.length && (
          <Card className="border-gold-500/30 bg-gradient-to-br from-obsidian-50 to-obsidian">
            <CardContent className="py-8 text-center">
              <Lock className="w-8 h-8 mx-auto text-gold-500 mb-3" />
              <h3 className="font-semibold mb-2">
                Unlock {contacts.length - displayContacts.length} More Contacts
              </h3>
              <p className="text-sm text-obsidian-500 mb-4">
                Upgrade to Professional for full contact database access
              </p>
              <Button variant="gold" onClick={() => window.location.href = '/settings/billing'}>
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
