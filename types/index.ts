// ===========================================
// CAPITALSTACK - Type Definitions
// ===========================================

import { Buyer, Contact, User, Plan } from '@prisma/client';

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// Buyer Types
export interface BuyerWithContacts extends Buyer {
  contacts?: Contact[];
  _count?: {
    contacts: number;
  };
}

export interface BuyerFilters {
  search?: string;
  category?: string;
  market?: string;
  dealSizeMin?: number;
  dealSizeMax?: number;
  verified?: boolean;
}

export interface BuyerSearchParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'company' | 'category' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  filters?: BuyerFilters;
}

// Contact Types
export interface ContactWithBuyer extends Contact {
  buyer?: Buyer | null;
}

export interface ContactFilters {
  search?: string;
  company?: string;
  title?: string;
  hasEmail?: boolean;
  hasPhone?: boolean;
  verified?: boolean;
}

// User Types
export interface UserProfile extends Pick<User, 'id' | 'name' | 'email' | 'image' | 'company' | 'role' | 'phone' | 'plan'> {
  subscription?: {
    status: 'active' | 'canceled' | 'past_due' | 'none';
    currentPeriodEnd?: Date;
    plan: Plan;
  };
}

export interface UserUsage {
  buyerViews: number;
  contactViews: number;
  exports: number;
  searches: number;
  period: {
    start: Date;
    end: Date;
  };
}

// Subscription Types
export interface SubscriptionPlan {
  name: string;
  description: string;
  price: number;
  priceId: string | null;
  popular?: boolean;
  features: string[];
  limits: {
    buyerViews: number;
    contactViews: number;
    exports: number;
    searches: number;
    teamSeats?: number;
    apiAccess?: boolean;
  };
}

// Search Types
export interface SearchResult {
  buyers: BuyerWithContacts[];
  contacts: ContactWithBuyer[];
  total: {
    buyers: number;
    contacts: number;
  };
}

// Export Types
export interface ExportOptions {
  type: 'buyers' | 'contacts' | 'combined';
  format: 'csv' | 'xlsx' | 'json';
  fields?: string[];
  filters?: BuyerFilters | ContactFilters;
}

// Dashboard Types
export interface DashboardStats {
  totalBuyers: number;
  totalContacts: number;
  savedBuyers: number;
  savedContacts: number;
  recentSearches: number;
  exports: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

// UI Types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

// Table Types
export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Category Options
export const BUYER_CATEGORIES = [
  'All Categories',
  'SFR Operator/REIT',
  'BTR Developer',
  'Multifamily Investor',
  'Multifamily REIT',
  'Multifamily Owner/Operator',
  'Private Equity',
  'Private Equity Real Estate',
  'Net Lease REIT',
  'Land/Development',
  'Hospitality REIT',
  'Industrial REIT',
  'Real Estate Investment',
  'Real Estate Investment & Development',
  'Institutional Real Estate Manager',
] as const;

export type BuyerCategory = (typeof BUYER_CATEGORIES)[number];

// Market Options (Top metros)
export const MAJOR_MARKETS = [
  'Phoenix, AZ',
  'Dallas, TX',
  'Houston, TX',
  'Austin, TX',
  'San Antonio, TX',
  'Atlanta, GA',
  'Tampa, FL',
  'Orlando, FL',
  'Miami, FL',
  'Jacksonville, FL',
  'Charlotte, NC',
  'Raleigh, NC',
  'Nashville, TN',
  'Denver, CO',
  'Las Vegas, NV',
  'Indianapolis, IN',
  'Columbus, OH',
  'Charleston, SC',
  'Greenville, SC',
  'Birmingham, AL',
] as const;

export type Market = (typeof MAJOR_MARKETS)[number];
