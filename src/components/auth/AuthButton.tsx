'use client';

import { useAuth } from '@/context/AuthContext';
import { LogIn, LogOut } from 'lucide-react';

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg animate-pulse">
        Loading...
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium hidden md:inline-block">
          {user.email}
        </span>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
    >
      <LogIn size={18} />
      Sign in with Google
    </button>
  );
}
