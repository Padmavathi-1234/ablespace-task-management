'use client';

import React from 'react';
import { LayoutGrid, Layers, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function TasksPage() {
  const { user } = useAuth();
  const { colorMode } = useTheme();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Tasks Dashboard
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 capitalize">
                {colorMode} theme active
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Welcome back, <span className="font-semibold text-gray-800 dark:text-neutral-200">{user?.fullName || 'Dexter'}</span>! Your workspace layout shell is fully configured.
            </p>
          </div>

          <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-[var(--color-primary)]">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Next Step Preview Card */}
      <div className="bg-white dark:bg-neutral-900 border border-dashed border-gray-300 dark:border-neutral-800 rounded-2xl p-12 text-center space-y-4">
        <div className="h-14 w-14 mx-auto rounded-2xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-400 dark:text-neutral-500">
          <LayoutGrid className="w-7 h-7 text-[var(--color-primary)]" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Kanban Board & List views loading in next step...
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            The sidebar navigation, top header, user menu popover, and dynamic color theme system are active.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-neutral-800 text-xs font-medium text-gray-600 dark:text-neutral-300">
          <Layers className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>Step 11 Layout Verified Successfully</span>
        </div>
      </div>
    </div>
  );
}
