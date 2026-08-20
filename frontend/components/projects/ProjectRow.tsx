'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/types';
import { MoreVertical, Folder, Trash2, ExternalLink } from 'lucide-react';
import { useDeleteProjectMutation } from '@/hooks/useProjects';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface ProjectRowProps {
  project: Project;
}

export function ProjectRow({ project }: ProjectRowProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteProjectMutation = useDeleteProjectMutation();

  const handleRowClick = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project.id);
      toast.success('Project deleted successfully');
      setShowDeleteConfirm(false);
    } catch (err: any) {
      toast.error('Failed to delete project');
    }
  };

  // Priority Badge Styling
  const renderPriorityBadge = (priority: string) => {
    const p = (priority || 'medium').toLowerCase();
    switch (p) {
      case 'urgent':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900/40">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Medium
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5" />
            Low
          </span>
        );
    }
  };

  // Format Due Date e.g. "12 Sep 2026"
  const formattedDueDate = project.dueDate
    ? new Date(project.dueDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'No Due Date';

  // Lead initials or avatar
  const leadName = project.lead?.fullName || 'Unassigned';
  const leadInitial = leadName.charAt(0).toUpperCase();

  const taskCount = project._count?.tasks ?? project.tasks?.length ?? 0;

  return (
    <>
      <tr
        onClick={handleRowClick}
        className="group border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50/80 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
      >
        {/* Column 1: Project Name & Task count */}
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-[var(--color-primary)] transition-colors">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-[11px] text-gray-500 dark:text-neutral-400 line-clamp-1">
                  {project.description}
                </p>
              )}
              <span className="inline-block text-[10px] text-gray-400 dark:text-neutral-500 font-medium">
                {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>
        </td>

        {/* Column 2: Priority */}
        <td className="py-3.5 px-4">
          {renderPriorityBadge(project.priority)}
        </td>

        {/* Column 3: Lead */}
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              {leadInitial}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-neutral-200">
              {leadName}
            </span>
          </div>
        </td>

        {/* Column 4: Due Date */}
        <td className="py-3.5 px-4">
          <span className="text-xs text-gray-600 dark:text-neutral-400 font-medium">
            {formattedDueDate}
          </span>
        </td>

        {/* Column 5: Actions */}
        <td className="py-3.5 px-4 text-right relative" onClick={(e) => e.stopPropagation()}>
          <div className="inline-block relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Project Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 py-1 z-20 text-left">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push(`/projects/${project.id}`);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </td>
      </tr>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.name}"? All associated tasks will also be removed. This action cannot be undone.`}
        confirmText="Delete Project"
        isLoading={deleteProjectMutation.isPending}
      />
    </>
  );
}
