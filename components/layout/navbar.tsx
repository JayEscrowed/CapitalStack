'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LogOut, User, Settings, CreditCard, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#database', label: 'Database' },
  { href: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthenticated = status === 'authenticated';
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/buyers') || pathname?.startsWith('/contacts');

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isDashboard
          ? 'bg-obsidian/90 backdrop-blur-xl border-b border-obsidian-200'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold-sm group-hover:shadow-gold-md transition-shadow">
            <Database className="w-4 h-4 text-obsidian" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            CAPITAL<span className="text-gold-gradient">STACK</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!isDashboard && navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-obsidian-600 hover:text-gold-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
          {isDashboard && (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  'text-sm transition-colors',
                  pathname === '/dashboard' ? 'text-gold-500' : 'text-obsidian-600 hover:text-gold-500'
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/buyers"
                className={cn(
                  'text-sm transition-colors',
                  pathname === '/buyers' ? 'text-gold-500' : 'text-obsidian-600 hover:text-gold-500'
                )}
              >
                Buyers
              </Link>
              <Link
                href="/contacts"
                className={cn(
                  'text-sm transition-colors',
                  pathname === '/contacts' ? 'text-gold-500' : 'text-obsidian-600 hover:text-gold-500'
                )}
              >
                Contacts
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-sm text-obsidian-600 hover:text-foreground transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian font-semibold text-xs">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown className={cn('w-4 h-4 transition-transform', isDropdownOpen && 'rotate-180')} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg bg-obsidian-50 border border-obsidian-200 shadow-lg overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-obsidian-200">
                      <p className="text-sm font-medium truncate">{session.user?.name}</p>
                      <p className="text-xs text-obsidian-500 truncate">{session.user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-obsidian-600 hover:bg-obsidian-100 hover:text-foreground"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-obsidian-600 hover:bg-obsidian-100 hover:text-foreground"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <Link
                        href="/dashboard/billing"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-obsidian-600 hover:bg-obsidian-100 hover:text-foreground"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <CreditCard className="w-4 h-4" />
                        Billing
                      </Link>
                    </div>
                    <div className="border-t border-obsidian-200 py-1">
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-obsidian-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="gold" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-obsidian-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-obsidian border-b border-obsidian-200"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-obsidian-600 hover:text-gold-500 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-obsidian-200">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="gold" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
