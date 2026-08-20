'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PanelLeft, Menu, Search, SlidersHorizontal, Plus, Check, X } from 'lucide-react';
import { useTasksContext } from '@/context/TasksContext';
import { FieldsDropdown } from '@/components/tasks/FieldsDropdown';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  title?: string;
  onToggleSidebar?: () => void;
  onOpenMobileSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function Navbar({
  title = 'Tasks',
  onToggleSidebar,
  onOpenMobileSidebar,
  isSidebarCollapsed = false,
}: NavbarProps) {
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    visibleFields,
    toggleField,
    statusFilter,
    setStatusFilter,
    openCreateModal,
  } = useTasksContext();

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-20 transition-colors gap-2">
      {/* Left side: Mobile Toggle + Desktop Toggle + Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
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

      {/* Right side: Search, Fields dropdown, Filter, + Add Task black primary button */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {/* Search Bar */}
        <div className="relative flex items-center w-36 sm:w-60 md:w-64 shrink-0">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 h-8 text-xs bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 outline-hidden focus:border-gray-400 dark:focus:border-neutral-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Fields Dropdown */}
        <FieldsDropdown
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          visibleFields={visibleFields}
          onToggleField={toggleField}
        />

        {/* Filter Button */}
        <div className="relative inline-block text-left shrink-0" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`h-8 px-2.5 flex items-center justify-center rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              statusFilter
                ? 'border-black text-black dark:border-white dark:text-white bg-gray-100 dark:bg-neutral-800'
                : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
            }`}
            title="Filter by status"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg z-30 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <p className="px-2 py-1 text-[10px] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
                Filter Status
              </p>
              {[
                { label: 'All Tasks', value: undefined },
                { label: 'To Do', value: 'todo' },
                { label: 'Doing', value: 'doing' },
                { label: 'Completed', value: 'completed' },
                { label: 'On Hold', value: 'on-hold' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setFilterOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    statusFilter === opt.value
                      ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold'
                      : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>{opt.label}</span>
                  {statusFilter === opt.value && (
                    <Check className="w-3.5 h-3.5 text-black dark:text-white" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* + Add Task Black Primary Button */}
        <Button
          onClick={() => openCreateModal('todo')}
          size="sm"
          className="h-8 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-medium px-3.5 gap-1 shadow-2xs shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>
    </header>
  );
}
