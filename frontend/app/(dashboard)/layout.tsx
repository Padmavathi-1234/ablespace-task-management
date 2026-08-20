'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { TasksProvider } from '@/context/TasksContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
        <p className="mt-3 text-xs text-gray-500 dark:text-neutral-400 font-medium animate-pulse">
          Loading workspace...
        </p>
      </div>
    );
  }

  return (
    <TasksProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100/50 dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 transition-colors">
        {/* Collapsible Left Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Shell */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Navbar */}
          <Navbar
            isSidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Scrollable Page Body */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-neutral-900/40">
            {children}
          </main>
        </div>
      </div>
    </TasksProvider>
  );
}
