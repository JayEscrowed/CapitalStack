import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Format date
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(d);
}

// Truncate string
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Slugify string
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Parse markets string to array
export function parseMarkets(markets: string | null): string[] {
  if (!markets) return [];
  return markets
    .split(/[,;]/)
    .map((m) => m.trim())
    .filter(Boolean);
}

// Get category color
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'SFR Operator/REIT': 'bg-blue-500/20 text-blue-400',
    'BTR Developer': 'bg-green-500/20 text-green-400',
    'Multifamily Investor': 'bg-purple-500/20 text-purple-400',
    'Multifamily REIT': 'bg-purple-500/20 text-purple-400',
    'Private Equity': 'bg-gold-500/20 text-gold-400',
    'Net Lease REIT': 'bg-orange-500/20 text-orange-400',
    'Land/Development': 'bg-emerald-500/20 text-emerald-400',
    'Hospitality REIT': 'bg-pink-500/20 text-pink-400',
    'Industrial REIT': 'bg-slate-500/20 text-slate-400',
  };
  
  // Find partial match
  for (const [key, value] of Object.entries(colors)) {
    if (category.toLowerCase().includes(key.toLowerCase().split(' ')[0])) {
      return value;
    }
  }
  
  return 'bg-obsidian-200/20 text-obsidian-600';
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate random ID
export function generateId(length = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Safe JSON parse
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Check if running on server
export const isServer = typeof window === 'undefined';

// Get absolute URL
export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
}
