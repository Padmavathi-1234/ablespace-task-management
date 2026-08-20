'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FieldsDropdown } from './FieldsDropdown';
import { useTasksContext } from '@/context/TasksContext';

export function TasksToolbar() {
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
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2">
      {/* Left side: Tasks Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Tasks
        </h1>
      </div>

      {/* Right side: Permanent Search Bar (matching Figma size), Fields, Filter, + Add Task */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* Permanent Search Input Bar matching Figma */}
        <div className="relative flex items-center w-60 sm:w-72">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-10 h-8 text-xs bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 outline-hidden focus:border-gray-400 dark:focus:border-neutral-600 transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xs select-none pointer-events-none">
              ⌘F
            </kbd>
          )}
        </div>

        {/* Fields Dropdown */}
        <FieldsDropdown
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          visibleFields={visibleFields}
          onToggleField={toggleField}
        />

        {/* Filter Square Icon Button */}
        <div className="relative inline-block text-left" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`h-8 px-2.5 flex items-center justify-center rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              statusFilter
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10'
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
                      ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>{opt.label}</span>
                  {statusFilter === opt.value && (
                    <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* + Add Task Primary CTA button */}
        <Button
          onClick={() => openCreateModal('todo')}
          size="sm"
          className="h-8 rounded-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-medium px-3.5 gap-1 shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </Button>
      </div>
    </div>
  );
}
