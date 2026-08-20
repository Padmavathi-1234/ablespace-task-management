'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '@/hooks/useTasks';
import { PriorityBadge } from '@/components/tasks/PriorityBadge';
import { Check, Plus, Trash2, ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';

interface SubtaskTableProps {
  taskId: string;
  subtasks?: Task[];
  projectId?: string | null;
}

export function SubtaskTable({ taskId, subtasks = [], projectId }: SubtaskTableProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const completedCount = subtasks.filter((s) => s.status === 'completed').length;
  const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await createTaskMutation.mutateAsync({
        title: newTitle.trim(),
        parentId: taskId,
        projectId: projectId || undefined,
        status: 'todo',
        priority: 'medium',
      });
      toast.success('Subtask added');
      setNewTitle('');
      setIsCreating(false);
    } catch {
      toast.error('Failed to add subtask');
    }
  };

  const handleToggleStatus = async (subtask: Task) => {
    const nextStatus = subtask.status === 'completed' ? 'todo' : 'completed';
    try {
      await updateTaskMutation.mutateAsync({
        id: subtask.id,
        data: { status: nextStatus },
      });
    } catch {
      toast.error('Failed to update subtask');
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await deleteTaskMutation.mutateAsync(subtaskId);
      toast.success('Subtask deleted');
    } catch {
      toast.error('Failed to delete subtask');
    }
  };

  return (
    <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
      {/* Collapsible Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/70 dark:bg-neutral-850/50 border-b border-gray-100 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-neutral-200 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
          <span>Subtasks</span>
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-full">
            {completedCount}/{subtasks.length}
          </span>
        </button>

        {subtasks.length > 0 && (
          <div className="flex items-center gap-2 w-32">
            <div className="w-full bg-gray-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-neutral-400">
              {progressPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Subtasks Content */}
      {!isCollapsed && (
        <div className="divide-y divide-gray-100 dark:divide-neutral-800">
          {subtasks.length === 0 && !isCreating ? (
            <div className="p-4 text-center text-xs text-gray-400 dark:text-neutral-500">
              No subtasks yet. Click below to add one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-neutral-800 text-[11px] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider bg-gray-50/30 dark:bg-neutral-900">
                    <th className="py-2.5 px-4 w-12 text-center">Status</th>
                    <th className="py-2.5 px-4">Task Title</th>
                    <th className="py-2.5 px-4 w-28">Priority</th>
                    <th className="py-2.5 px-4 w-28">Members</th>
                    <th className="py-2.5 px-4 w-28">Due Date</th>
                    <th className="py-2.5 px-4 w-16 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {subtasks.map((subtask) => {
                    const isCompleted = subtask.status === 'completed';

                    return (
                      <tr
                        key={subtask.id}
                        className="hover:bg-gray-50/60 dark:hover:bg-neutral-850/40 transition-colors"
                      >
                        {/* Status Checkbox */}
                        <td className="py-2.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(subtask)}
                            className="text-gray-400 hover:text-emerald-500 dark:text-neutral-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            {isCompleted ? (
                              <CheckSquare className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Title */}
                        <td className="py-2.5 px-4 font-medium">
                          <span
                            className={
                              isCompleted
                                ? 'line-through text-gray-400 dark:text-neutral-500'
                                : 'text-gray-800 dark:text-neutral-200'
                            }
                          >
                            {subtask.title}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="py-2.5 px-4">
                          <PriorityBadge priority={subtask.priority} />
                        </td>

                        {/* Members */}
                        <td className="py-2.5 px-4">
                          {subtask.user ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                                {subtask.user.fullName?.charAt(0) || 'U'}
                              </div>
                              <span className="text-gray-600 dark:text-neutral-400 truncate max-w-[80px]">
                                {subtask.user.fullName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-neutral-600 text-[11px]">
                              Unassigned
                            </span>
                          )}
                        </td>

                        {/* Due Date */}
                        <td className="py-2.5 px-4 text-gray-500 dark:text-neutral-400 text-[11px]">
                          {subtask.dueDate
                            ? new Date(subtask.dueDate).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })
                            : '-'}
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteSubtask(subtask.id)}
                            className="p-1 text-gray-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition-colors cursor-pointer rounded-md"
                            title="Delete Subtask"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Subtask Input Form or Button */}
          <div className="p-3 bg-gray-50/40 dark:bg-neutral-900/60">
            {isCreating ? (
              <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter subtask title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-blue-500 bg-white dark:bg-neutral-950 text-xs text-gray-900 dark:text-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={createTaskMutation.isPending || !newTitle.trim()}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewTitle('');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-xs font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer px-2 py-1 rounded-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subtasks</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
