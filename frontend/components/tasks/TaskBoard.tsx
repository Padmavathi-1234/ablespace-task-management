'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Plus, GripVertical, MoreHorizontal } from 'lucide-react';
import { TaskBoardSkeleton } from '@/components/ui/Skeleton';

export const STATUS_COLUMNS: { key: TaskStatus; label: string; dotColor: string }[] = [
  { key: 'todo', label: 'To Do', dotColor: 'bg-slate-400' },
  { key: 'doing', label: 'Doing', dotColor: 'bg-amber-500' },
  { key: 'completed', label: 'Completed', dotColor: 'bg-emerald-500' },
  { key: 'on-hold', label: 'On Hold', dotColor: 'bg-purple-500' },
];

interface TaskBoardProps {
  tasks: Task[];
  visibleFields?: Record<string, boolean>;
  onAddTask: (status?: TaskStatus) => void;
  loading?: boolean;
}

export function TaskBoard({ tasks, visibleFields, onAddTask, loading }: TaskBoardProps) {
  // Group tasks by status
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

  if (loading) {
    return <TaskBoardSkeleton />;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 snap-x scrollbar-thin">
      {STATUS_COLUMNS.map((column) => {
        const columnTasks = tasksByStatus[column.key] || [];

        return (
          <div
            key={column.key}
            className="flex flex-col bg-gray-100/70 dark:bg-neutral-900/50 border border-gray-200/60 dark:border-neutral-800/80 rounded-2xl p-3 max-h-[calc(100vh-200px)] min-h-[380px] w-[300px] shrink-0 snap-start"
          >
            {/* Column Header matching Figma spec */}
            <div className="flex items-center justify-between pb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${column.dotColor}`} />
                <h3 className="text-xs font-semibold text-gray-800 dark:text-neutral-200">
                  {column.label}
                </h3>
                <span className="text-[11px] font-semibold text-gray-400 dark:text-neutral-500 px-1.5 py-0.2 rounded-full bg-gray-200/60 dark:bg-neutral-800">
                  {columnTasks.length}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onAddTask(column.key)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title={`Add task to ${column.label}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Column options"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Task Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} visibleFields={visibleFields} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-3 text-center border border-dashed border-gray-200 dark:border-neutral-800/80 rounded-xl space-y-2 bg-white/40 dark:bg-neutral-900/20">
                  <p className="text-xs text-gray-400 dark:text-neutral-500 font-medium">
                    No tasks in {column.label}
                  </p>
                  <button
                    onClick={() => onAddTask(column.key)}
                    className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                  >
                    + Add Task
                  </button>
                </div>
              )}
            </div>

            {/* Bottom + Add Task Text Button */}
            <button
              onClick={() => onAddTask(column.key)}
              className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer px-2 py-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-neutral-800/60"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
