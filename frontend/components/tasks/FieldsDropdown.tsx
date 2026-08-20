'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Columns3, LayoutGrid, List, Check } from 'lucide-react';

export type ViewMode = 'board' | 'list';

interface FieldsDropdownProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  visibleFields: Record<string, boolean>;
  onToggleField: (fieldKey: string) => void;
}

const AVAILABLE_FIELDS = [
  { key: 'priority', label: 'Priority' },
  { key: 'members', label: 'Members' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'labels', label: 'Labels' },
  { key: 'status', label: 'Status' },
  { key: 'reporter', label: 'Reporter' },
];

export function FieldsDropdown({
  viewMode,
  onViewModeChange,
  visibleFields,
  onToggleField,
}: FieldsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 text-xs font-medium transition-colors cursor-pointer"
        title="Customize view and fields"
      >
        <Columns3 className="w-3.5 h-3.5 text-gray-500 dark:text-neutral-400" />
        <span>Fields</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg z-30 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-100">
          {/* View Mode Toggle: List first, then Board */}
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
              Layout View
            </p>
            <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg">
              <button
                onClick={() => onViewModeChange('list')}
                className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>

              <button
                onClick={() => onViewModeChange('board')}
                className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'board'
                    ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Board</span>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-neutral-800 my-1" />

          {/* Visible Fields Checkboxes */}
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
              Visible Columns / Fields
            </p>
            {AVAILABLE_FIELDS.map((field) => {
              const isChecked = visibleFields[field.key] !== false;

              return (
                <label
                  key={field.key}
                  onClick={() => onToggleField(field.key)}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer select-none"
                >
                  <span>{field.label}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                        : 'border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
