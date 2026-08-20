'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';
import { format, parseISO } from 'date-fns';
import { Calendar, MoreHorizontal, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface TaskCardProps {
  task: Task;
  visibleFields?: Record<string, boolean>;
}

export function TaskCard({ task, visibleFields }: TaskCardProps) {
  const router = useRouter();

  const formattedDueDate = task.dueDate
    ? (() => {
        try {
          return format(parseISO(task.dueDate), 'd MMM');
        } catch {
          return task.dueDate;
        }
      })()
    : null;

  const assigneeName = task.user?.fullName || 'Admin';
  const assigneeInitials = assigneeName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const showMembers = visibleFields?.members !== false;
  const showDueDate = visibleFields?.dueDate !== false;
  const showLabels = visibleFields?.labels !== false;

  return (
    <div
      onClick={() => router.push(`/tasks/${task.id}`)}
      className="group relative bg-white dark:bg-neutral-900 border border-gray-200/90 dark:border-neutral-800 rounded-xl p-3.5 shadow-2xs hover:shadow-md hover:border-gray-300 dark:hover:border-neutral-700 transition-all cursor-pointer space-y-2.5"
    >
      {/* Top Line: Task Title + ... Menu */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-semibold text-gray-900 dark:text-neutral-100 leading-snug line-clamp-2">
          {task.title}
        </h4>

        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all cursor-pointer shrink-0"
          title="More options"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Middle Line: Assignee (Avatar + Name) on left, Due Date red pill on right */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {showMembers ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className="flex items-center justify-center h-5 w-5 rounded-full bg-[var(--color-primary)] text-white text-[9px] font-bold shrink-0 overflow-hidden shadow-2xs"
              title={assigneeName}
            >
              {task.user?.avatarUrl ? (
                <img
                  src={task.user.avatarUrl}
                  alt={assigneeName}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                assigneeInitials
              )}
            </div>
            <span className="text-[11px] font-medium text-gray-700 dark:text-neutral-300 truncate">
              {assigneeName}
            </span>
          </div>
        ) : (
          <div />
        )}

        {showDueDate && formattedDueDate && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200/60 dark:border-red-900/40 shrink-0">
            <Calendar className="w-3 h-3 text-red-500 shrink-0" />
            <span>{formattedDueDate}</span>
          </span>
        )}
      </div>

      {/* Bottom Line: Label Pills with Tag Icon */}
      {showLabels && task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 border border-gray-200/60 dark:border-neutral-700/60"
            >
              <Tag className="w-2.5 h-2.5 text-gray-400 shrink-0" />
              <span>{label.name}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
