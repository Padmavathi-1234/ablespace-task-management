'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task, TaskStatus } from '@/types';
import { format, parseISO } from 'date-fns';
import { PriorityBadge } from './PriorityBadge';
import { Plus, MoreHorizontal } from 'lucide-react';
import { STATUS_COLUMNS } from './TaskBoard';
import { TaskListSkeleton } from '@/components/ui/Skeleton';

interface TaskListViewProps {
  tasks: Task[];
  visibleFields?: Record<string, boolean>;
  onAddTask: (status?: TaskStatus) => void;
  loading?: boolean;
}

export function TaskListView({ tasks, visibleFields, onAddTask, loading }: TaskListViewProps) {
  const router = useRouter();

  // Collapsible status sections state (all expanded by default)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (statusKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [statusKey]: !prev[statusKey],
    }));
  };

  const tasksByStatus: Record<string, Task[]> = {
    todo: [],
    doing: [],
    completed: [],
    'on-hold': [],
  };

  tasks.forEach((task) => {
    const key = task.status || 'todo';
    if (!tasksByStatus[key]) {
      tasksByStatus[key] = [];
    }
    tasksByStatus[key].push(task);
  });

  const showPriority = visibleFields?.priority !== false;
  const showMembers = visibleFields?.members !== false;
  const showDueDate = visibleFields?.dueDate !== false;
  const showReporter = visibleFields?.reporter === true;

  if (loading) {
    return <TaskListSkeleton />;
  }

  return (
    <div className="space-y-5 pb-6 select-none">
      {STATUS_COLUMNS.map((column) => {
        const columnTasks = tasksByStatus[column.key] || [];
        const isCollapsed = collapsedGroups[column.key];

        // Skip 'on-hold' if empty
        if (column.key === 'on-hold' && columnTasks.length === 0) {
          return null;
        }

        return (
          <div key={column.key} className="space-y-2">
            {/* Section Header matching Figma: ▾ Section Title */}
            <div
              onClick={() => toggleGroup(column.key)}
              className="flex items-center gap-2 cursor-pointer select-none py-1 group"
            >
              <span className="text-[11px] text-gray-800 dark:text-neutral-200 font-bold transition-transform duration-100">
                {isCollapsed ? '▸' : '▾'}
              </span>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                {column.label}
              </h3>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-neutral-500 px-1.5 py-0.2 rounded-full bg-gray-200/60 dark:bg-neutral-800">
                {columnTasks.length}
              </span>
            </div>

            {/* Table Container */}
            {!isCollapsed && (
              <div className="bg-white dark:bg-neutral-900 border border-gray-200/90 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-100/70 dark:bg-neutral-800/60 border-b border-gray-200/80 dark:border-neutral-800 text-xs font-semibold text-gray-700 dark:text-neutral-300">
                        <th className="py-2.5 px-4 font-semibold">Task</th>
                        {showPriority && <th className="py-2.5 px-4 w-32 font-semibold">Priority</th>}
                        {showMembers && <th className="py-2.5 px-4 w-36 font-semibold">Members</th>}
                        {showDueDate && <th className="py-2.5 px-4 w-36 font-semibold">Due Date</th>}
                        {showReporter && <th className="py-2.5 px-4 w-32 font-semibold">Reporter</th>}
                        <th className="py-2.5 px-4 w-16 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-800/60 text-xs">
                      {columnTasks.length > 0 ? (
                        columnTasks.map((task) => {
                          const formattedDueDate = task.dueDate
                            ? (() => {
                                try {
                                  return format(parseISO(task.dueDate), 'd MMM yyyy');
                                } catch {
                                  return task.dueDate;
                                }
                              })()
                            : '—';

                          const assigneeName = task.user?.fullName || 'Dexter';
                          const assigneeInitials = assigneeName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase();

                          return (
                            <tr
                              key={task.id}
                              onClick={() => router.push(`/tasks/${task.id}`)}
                              className="hover:bg-gray-50/80 dark:hover:bg-neutral-850/50 transition-colors cursor-pointer group"
                            >
                              {/* Task Title */}
                              <td className="py-3 px-4 text-xs font-medium text-gray-900 dark:text-neutral-100 group-hover:text-[var(--color-primary)] transition-colors">
                                {task.title}
                              </td>

                              {/* Priority */}
                              {showPriority && (
                                <td className="py-3 px-4">
                                  <PriorityBadge priority={task.priority} />
                                </td>
                              )}

                              {/* Assignee / Members */}
                              {showMembers && (
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                      {task.user?.avatarUrl ? (
                                        <img
                                          src={task.user.avatarUrl}
                                          alt={assigneeName}
                                          className="h-6 w-6 rounded-full object-cover"
                                        />
                                      ) : (
                                        assigneeInitials
                                      )}
                                    </div>
                                  </div>
                                </td>
                              )}

                              {/* Due Date */}
                              {showDueDate && (
                                <td className="py-3 px-4 text-xs text-gray-600 dark:text-neutral-400">
                                  {formattedDueDate}
                                </td>
                              )}

                              {/* Reporter */}
                              {showReporter && (
                                <td className="py-3 px-4 text-xs text-gray-600 dark:text-neutral-400">
                                  {task.creator?.fullName || 'System'}
                                </td>
                              )}

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-4 px-4 text-xs text-gray-400 dark:text-neutral-500 italic"
                          >
                            No tasks in {column.label.toLowerCase()}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Add Task Button at bottom of table section */}
                <div className="p-3 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800/60">
                  <button
                    onClick={() => onAddTask(column.key)}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer px-1 py-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
