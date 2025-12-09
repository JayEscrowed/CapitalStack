import Link from 'next/link';
import { Database } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold-sm">
            <Database className="w-4 h-4 text-obsidian" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            CAPITAL<span className="text-gold-gradient">STACK</span>
          </span>
        </Link>
      </header>
      
      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-500/3 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
