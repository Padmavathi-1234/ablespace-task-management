'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { TasksProvider } from '@/context/TasksContext';
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
          {/* Top Navbar */}
          <Navbar
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            isSidebarCollapsed={sidebarCollapsed}
          />

          {/* Scrollable Page Body */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-neutral-900/40">
            {children}
          </main>
        </div>
      </div>
    </TasksProvider>
  );
}
