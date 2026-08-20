'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateProjectMutation } from '@/hooks/useProjects';
import { useAuth } from '@/context/AuthContext';
import { PriorityLevel } from '@/types';
import { toast } from 'sonner';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const createProjectMutation = useCreateProjectMutation();

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      await createProjectMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        leadId: user?.id || undefined,
      });

      toast.success('Project created successfully');
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project Name */}
        <Input
          label="Project Name *"
          placeholder="e.g. Design Homepage"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoFocus
        />

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 outline-hidden focus:border-gray-400 dark:focus:border-neutral-600 transition-colors"
            placeholder="Add brief details about the project goals..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Priority & Due Date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 outline-hidden transition-colors border-gray-200 dark:border-neutral-800"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="no-priority">No Priority</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Input
              type="date"
              label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Lead selection / display */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
            Project Lead
          </label>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 dark:bg-neutral-800/60 border border-gray-200 dark:border-neutral-800 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold flex items-center justify-center">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                {user?.fullName || 'Current User'}
              </p>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-200/70 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">
              Default Lead
            </span>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-neutral-800">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={createProjectMutation.isPending}
            className="bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs px-4"
          >
            {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
