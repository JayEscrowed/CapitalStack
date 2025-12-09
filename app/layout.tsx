import type { Metadata, Viewport } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import { SessionProvider } from '@/components/providers/session-provider';
import '@/styles/globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CAPITALSTACK | Institutional Real Estate Buyer Database',
    template: '%s | CAPITALSTACK',
  },
  description:
    'Access 325+ verified institutional real estate buyers. Connect with hedge funds, REITs, and private equity firms actively acquiring properties nationwide.',
  keywords: [
    'real estate buyers',
    'institutional investors',
    'hedge funds',
    'REITs',
    'private equity',
    'real estate database',
    'SFR investors',
    'multifamily investors',
    'BTR developers',
  ],
  authors: [{ name: 'CapitalStack' }],
  creator: 'CapitalStack',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://capitalstack.io',
    siteName: 'CAPITALSTACK',
    title: 'CAPITALSTACK | Institutional Real Estate Buyer Database',
    description:
      'Access 325+ verified institutional real estate buyers. Connect with hedge funds, REITs, and private equity firms.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CAPITALSTACK - Institutional Real Estate Buyer Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAPITALSTACK | Institutional Real Estate Buyer Database',
    description:
      'Access 325+ verified institutional real estate buyers. Connect with hedge funds, REITs, and private equity firms.',
    images: ['/og-image.png'],
    creator: '@capitalstack',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
