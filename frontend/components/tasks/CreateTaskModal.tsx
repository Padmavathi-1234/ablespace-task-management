'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateTaskMutation } from '@/hooks/useTasks';
import { TaskStatus, PriorityLevel } from '@/types';
import { toast } from 'sonner';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
  defaultProjectId?: string;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  defaultStatus = 'todo',
  defaultProjectId,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const createTaskMutation = useCreateTaskMutation();

  useEffect(() => {
    if (isOpen) {
      setStatus(defaultStatus);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setError('');
    }
  }, [isOpen, defaultStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        projectId: defaultProjectId,
      });

      toast.success('Task created successfully');
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title input */}
        <Input
          label="Task Title *"
          placeholder="e.g. Design user profile dashboard"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoFocus
        />

        {/* Description textarea */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 outline-hidden focus:border-[var(--color-primary)] transition-colors"
            placeholder="Add any context or instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Status & Priority selects */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-gray-900 dark:text-neutral-100 outline-hidden transition-colors"
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-gray-900 dark:text-neutral-100 outline-hidden transition-colors"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="no-priority">No Priority</option>
            </select>
          </div>
        </div>

        {/* Due date picker */}
        <Input
          type="date"
          label="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-neutral-800">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs rounded-xl"
            disabled={createTaskMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            loading={createTaskMutation.isPending}
            disabled={createTaskMutation.isPending}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-xs px-4 rounded-xl"
          >
            {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
