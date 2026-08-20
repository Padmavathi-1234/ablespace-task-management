'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function TasksPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-8 flex flex-col items-center justify-center transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tasks Page Coming Soon
        </h1>
        <p className="text-gray-600 dark:text-neutral-400 mb-6">
          Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{user.fullName}</span> ({user.email})!
        </p>
        <Button variant="secondary" onClick={logout} className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
}
