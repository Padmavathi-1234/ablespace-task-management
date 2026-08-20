'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { TasksProvider } from '@/context/TasksContext';
import { Menu } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col items-center justify-center space-y-3">
        <Spinner size="lg" />
        <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium animate-pulse">
          Loading workspace...
        </p>
      </div>
    );
  }

  return (
    <TasksProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100/50 dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 transition-colors">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleDesktop={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Shell */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Mobile Navigation Header */}
          <header className="lg:hidden h-14 border-b border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-xl text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-xs">
                  A
                </div>
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  AbleSpace
                </span>
              </div>
            </div>
          </header>

          {/* Scrollable Page Body */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-neutral-900/40">
            {children}
          </main>
        </div>
      </div>
    </TasksProvider>
  );
}
