'use client';

import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-200/80 dark:bg-neutral-800 ${className}`}
      {...props}
    />
  );
}

export function TaskBoardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full overflow-x-auto pb-4">
      {[1, 2, 3, 4].map((col) => (
        <div key={col} className="bg-gray-100/60 dark:bg-neutral-900/40 rounded-2xl p-4 border border-gray-200/60 dark:border-neutral-800 space-y-3 min-w-[260px]">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-6 rounded-full" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((card) => (
              <div key={card} className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-gray-200/80 dark:border-neutral-800 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskListSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 overflow-hidden divide-y divide-gray-100 dark:divide-neutral-800">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-4 w-4 rounded-md shrink-0" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectsTableSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="divide-y divide-gray-100 dark:divide-neutral-800">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-72" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TaskDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <div className="w-full lg:w-80 h-96">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
