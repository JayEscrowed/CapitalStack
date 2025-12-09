'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Building2,
  User,
  Trash2,
  Mail,
  Phone,
  ExternalLink,
  MapPin,
  Loader2,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SavedBuyer {
  id: string;
  company: string;
  category: string | null;
  hq: string | null;
  email: string | null;
  phone: string | null;
  sourceUrl: string | null;
  savedAt: string;
  notes: string | null;
}

interface SavedContact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  company: string | null;
  linkedin: string | null;
  savedAt: string;
  notes: string | null;
}

export default function SavedPage() {
  const { data: session } = useSession();
  const [savedBuyers, setSavedBuyers] = useState<SavedBuyer[]>([]);
  const [savedContacts, setSavedContacts] = useState<SavedContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('buyers');

  useEffect(() => {
    async function fetchSaved() {
      try {
        const [buyersRes, contactsRes] = await Promise.all([
          fetch('/api/buyers/save'),
          fetch('/api/contacts/save'),
        ]);
        
        const buyersData = await buyersRes.json();
        const contactsData = await contactsRes.json();
        
        setSavedBuyers(buyersData.savedBuyers || []);
        setSavedContacts(contactsData.savedContacts || []);
      } catch (error) {
        console.error('Failed to fetch saved items:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSaved();
  }, []);

  const removeBuyer = async (buyerId: string) => {
    await fetch('/api/buyers/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerId, saved: false }),
    });
    setSavedBuyers(prev => prev.filter(b => b.id !== buyerId));
  };

  const removeContact = async (contactId: string) => {
    await fetch('/api/contacts/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, saved: false }),
    });
    setSavedContacts(prev => prev.filter(c => c.id !== contactId));
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-gold-500" />
            Saved Items
          </h1>
          <p className="text-sm text-obsidian-500">
            Your saved buyers and contacts for quick access
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="buyers">
                <Building2 className="w-4 h-4 mr-2" />
                Buyers ({savedBuyers.length})
              </TabsTrigger>
              <TabsTrigger value="contacts">
                <User className="w-4 h-4 mr-2" />
                Contacts ({savedContacts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buyers" className="mt-6">
              {savedBuyers.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Star className="w-12 h-12 mx-auto text-obsidian-400 mb-4" />
                    <h3 className="font-semibold mb-2">No saved buyers</h3>
                    <p className="text-sm text-obsidian-500">
                      Star buyers in the database to save them here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {savedBuyers.map((buyer) => (
                      <motion.div
                        key={buyer.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                      >
                        <Card hover>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-gold-500" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{buyer.company}</h3>
                                  <div className="flex items-center gap-3 text-sm text-obsidian-500">
                                    {buyer.category && (
                                      <Badge variant="gold" className="text-xs">
                                        {buyer.category}
                                      </Badge>
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
                                {buyer.email && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.location.href = `mailto:${buyer.email}`}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </Button>
                                )}
                                {buyer.phone && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.location.href = `tel:${buyer.phone}`}
                                  >
                                    <Phone className="w-4 h-4" />
                                  </Button>
                                )}
                                {buyer.sourceUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(buyer.sourceUrl!, '_blank')}
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeBuyer(buyer.id)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contacts" className="mt-6">
              {savedContacts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Star className="w-12 h-12 mx-auto text-obsidian-400 mb-4" />
                    <h3 className="font-semibold mb-2">No saved contacts</h3>
                    <p className="text-sm text-obsidian-500">
                      Star contacts in the database to save them here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {savedContacts.map((contact) => (
                      <motion.div
                        key={contact.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
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
                                    {contact.firstName} {contact.lastName}
                                  </h3>
                                  {contact.title && (
                                    <p className="text-xs text-obsidian-500">{contact.title}</p>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeContact(contact.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {contact.company && (
                              <p className="text-sm text-obsidian-500 mb-3">
                                {contact.company}
                              </p>
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
                              {contact.linkedin && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(contact.linkedin!, '_blank')}
                                >
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
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardShell>
  );
}
