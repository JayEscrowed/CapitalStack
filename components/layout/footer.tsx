import React from 'react';
import Link from 'next/link';
import { Database, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'Database', href: '/#database' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'API', href: '/api-docs' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Security', href: '/security' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-obsidian border-t border-obsidian-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold-sm">
                <Database className="w-4 h-4 text-obsidian" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                CAPITAL<span className="text-gold-gradient">STACK</span>
              </span>
            </Link>
            <p className="text-sm text-obsidian-500 mb-4 max-w-xs">
              The premier database for institutional real estate buyers. Connect with hedge funds, REITs, and private equity firms.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-obsidian-500 hover:text-gold-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-obsidian-500 hover:text-gold-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:hello@capitalstack.io" className="text-obsidian-500 hover:text-gold-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-obsidian-500 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-obsidian-500 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-obsidian-500 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-obsidian-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-obsidian-500">
            © {new Date().getFullYear()} CapitalStack. All rights reserved.
          </p>
          <p className="text-sm text-obsidian-500">
            Built for institutional dealmakers.
          </p>
        </div>
      </div>
    </footer>
  );
}
