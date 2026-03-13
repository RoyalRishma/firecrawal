'use client';

import Link from 'next/link';
import { AuthButton } from '../auth/AuthButton';
import { Briefcase, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Briefcase className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              FireCrawl AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            {user && (
              <>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
                <Link href="/profile" className="hover:text-blue-600 transition-colors">Profile</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
