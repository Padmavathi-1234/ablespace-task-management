'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTaskQuery } from '@/hooks/useTasks';
import { ArrowLeft, Clock, Calendar, User as UserIcon, Tag } from 'lucide-react';
import { PriorityBadge } from '@/components/tasks/PriorityBadge';
import { Button } from '@/components/ui/Button';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { data: task, isLoading, error } = useTaskQuery(taskId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/tasks')}
          className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tasks</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-8 space-y-4 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded-md w-1/3" />
          <div className="h-4 bg-gray-100 dark:bg-neutral-850 rounded-md w-2/3" />
        </div>
      ) : error || !task ? (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
            Task not found or failed to load.
          </p>
          <Button size="sm" onClick={() => router.push('/tasks')}>
            Return to Tasks
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Header info */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300">
                  {task.status}
                </span>
                <PriorityBadge priority={task.priority} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white pt-1">
                {task.title}
              </h1>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-200 dark:border-amber-900/50">
              Full task detail page view coming in next step
            </div>
          </div>

          {/* Task Metadata details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-gray-50 dark:bg-neutral-950/40 rounded-xl space-y-1">
              <span className="text-gray-400 dark:text-neutral-500 font-medium flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5" /> Assignee
              </span>
              <p className="font-semibold text-gray-800 dark:text-neutral-200">
                {task.user?.fullName || 'Unassigned'}
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-neutral-950/40 rounded-xl space-y-1">
              <span className="text-gray-400 dark:text-neutral-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Due Date
              </span>
              <p className="font-semibold text-gray-800 dark:text-neutral-200">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-neutral-950/40 rounded-xl space-y-1">
              <span className="text-gray-400 dark:text-neutral-500 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Created At
              </span>
              <p className="font-semibold text-gray-800 dark:text-neutral-200">
                {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
              Description
            </h3>
            <p className="text-xs text-gray-700 dark:text-neutral-300 leading-relaxed bg-gray-50/50 dark:bg-neutral-950/20 p-4 rounded-xl border border-gray-100 dark:border-neutral-800">
              {task.description || 'No description provided for this task.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
