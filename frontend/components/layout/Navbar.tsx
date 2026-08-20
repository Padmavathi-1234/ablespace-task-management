'use client';

import React from 'react';
import { 
  PanelLeft, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Columns3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  title?: string;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onAddTask?: () => void;
  onFilterClick?: () => void;
}

export function Navbar({
  title = 'Tasks',
  onToggleSidebar,
  isSidebarCollapsed = false,
  onAddTask,
  onFilterClick,
}: NavbarProps) {
  return (
    <header className="h-14 border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left side: Sidebar Toggle + Breadcrumb / Title */}
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
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Search, Fields, Filter, Add Task CTA */}
      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <button
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 bg-gray-50 dark:bg-neutral-950 text-xs transition-colors cursor-pointer"
          onClick={() => {
            // Trigger search shortcut or modal in future steps
          }}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xs">
            ⌘F
          </kbd>
        </button>

        {/* Fields button */}
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs font-medium transition-colors cursor-pointer"
          title="Customize visible fields"
        >
          <Columns3 className="w-3.5 h-3.5 text-gray-500 dark:text-neutral-400" />
          <span className="hidden sm:inline">Fields</span>
        </button>

        {/* Filter button */}
        <button
          onClick={onFilterClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs font-medium transition-colors cursor-pointer"
          title="Filter tasks"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 dark:text-neutral-400" />
          <span className="hidden sm:inline">Filter</span>
        </button>

        {/* + Add Task Primary CTA button */}
        <Button
          onClick={onAddTask}
          size="sm"
          className="rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-medium px-3 py-1.5 gap-1 shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </Button>
      </div>
    </header>
  );
}
