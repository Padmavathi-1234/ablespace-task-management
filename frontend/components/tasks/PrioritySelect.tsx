'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PriorityLevel } from '@/types';
import { SignalHigh, SignalMedium, SignalLow, Minus, ChevronDown } from 'lucide-react';

interface PrioritySelectProps {
  value: PriorityLevel | string;
  onChange: (priority: PriorityLevel) => void;
  className?: string;
  disabled?: boolean;
}

const PRIORITIES: { id: PriorityLevel; label: string; icon: React.ComponentType<{ className?: string }>; colorClass: string; bgClass: string }[] = [
  {
    id: 'urgent',
    label: 'Urgent',
    icon: SignalHigh,
    colorClass: 'text-red-600 dark:text-red-400',
    bgClass: 'hover:bg-red-50 dark:hover:bg-red-950/30',
  },
  {
    id: 'high',
    label: 'High',
    icon: SignalHigh,
    colorClass: 'text-orange-500 dark:text-orange-400',
    bgClass: 'hover:bg-orange-50 dark:hover:bg-orange-950/30',
  },
  {
    id: 'medium',
    label: 'Medium',
    icon: SignalMedium,
    colorClass: 'text-amber-500 dark:text-amber-400',
    bgClass: 'hover:bg-amber-50 dark:hover:bg-amber-950/30',
  },
  {
    id: 'low',
    label: 'Low',
    icon: SignalLow,
    colorClass: 'text-blue-500 dark:text-blue-400',
    bgClass: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
  },
  {
    id: 'no-priority',
    label: 'No Priority',
    icon: Minus,
    colorClass: 'text-gray-400 dark:text-neutral-500',
    bgClass: 'hover:bg-gray-50 dark:hover:bg-neutral-800',
  },
];

export function PrioritySelect({
  value,
  onChange,
  className = '',
  disabled = false,
}: PrioritySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const normalized = (value || 'no-priority').toLowerCase() as PriorityLevel;
  const currentOption = PRIORITIES.find((p) => p.id === normalized) || PRIORITIES[4];
  const Icon = currentOption.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium hover:bg-gray-50 dark:hover:bg-neutral-850 transition-colors w-full cursor-pointer disabled:opacity-50"
      >
        <span className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${currentOption.colorClass}`} />
          <span className="text-gray-800 dark:text-neutral-200">{currentOption.label}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-neutral-500" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-44 z-50 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg p-1 animate-in fade-in zoom-in-95 duration-150">
          {PRIORITIES.map((p) => {
            const OptionIcon = p.icon;
            const isSelected = p.id === normalized;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange(p.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                  p.bgClass
                } ${isSelected ? 'bg-gray-100 dark:bg-neutral-800 font-semibold' : ''}`}
              >
                <OptionIcon className={`w-3.5 h-3.5 ${p.colorClass}`} />
                <span className="text-gray-800 dark:text-neutral-200">{p.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
