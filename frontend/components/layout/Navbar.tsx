'use client';

import React from 'react';
import { PanelLeft } from 'lucide-react';

interface NavbarProps {
  title?: string;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function Navbar({
  title = 'Tasks',
  onToggleSidebar,
  isSidebarCollapsed = false,
}: NavbarProps) {
  return (
    <header className="h-12 border-b border-gray-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left side: Sidebar Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-neutral-500 font-medium">Workspace</span>
          <span className="text-xs text-gray-300 dark:text-neutral-700">/</span>
          <h1 className="text-xs font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: minimal / clean */}
      <div className="flex items-center gap-2" />
    </header>
  );
}
