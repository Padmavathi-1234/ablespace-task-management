'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProjectQuery } from '@/hooks/useProjects';
import { useTasksQuery } from '@/hooks/useTasks';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskListView } from '@/components/tasks/TaskListView';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { TaskStatus } from '@/types';
import { 
  ChevronRight, 
  Folder, 
  Calendar, 
  User as UserIcon, 
  Plus, 
  LayoutGrid, 
  List, 
  Loader2,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('todo');

  // Fetch project details
  const { data: project, isLoading: projectLoading, error: projectError } = useProjectQuery(projectId);

  // Fetch project-scoped tasks
  const { data: tasks = [], isLoading: tasksLoading } = useTasksQuery({
    projectId: projectId,
  });

  const handleAddTask = (status?: TaskStatus) => {
    if (status) setSelectedStatus(status);
    setCreateTaskModalOpen(true);
  };

  if (projectLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mb-2" />
        <p className="text-xs">Loading project details...</p>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl text-center space-y-3">
        <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">
          Project Not Found
        </h2>
        <p className="text-xs text-red-500 dark:text-red-400/80">
          The requested project could not be found or was deleted.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'doing').length;

  const renderPriorityBadge = (priority: string) => {
    const p = (priority || 'medium').toLowerCase();
    switch (p) {
      case 'urgent':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300 border border-red-200/80 dark:border-red-900/40">
            Urgent Priority
          </span>
        );
      case 'high':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300 border border-orange-200/80 dark:border-orange-900/40">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/40">
            Medium Priority
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700">
            Low Priority
          </span>
        );
    }
  };

  const formattedDueDate = project.dueDate
    ? new Date(project.dueDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 select-none">
      {/* Top Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-neutral-400">
        <Link
          href="/projects"
          className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Projects
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 dark:text-white font-semibold truncate">
          {project.name}
        </span>
      </nav>

      {/* Project Header Banner (Matching Image 1 Figma Spec) */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 flex items-center justify-center shrink-0">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {project.name}
                </h1>
                {renderPriorityBadge(project.priority)}
              </div>
              {project.description && (
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400 max-w-2xl font-normal">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Button "+ Add Task" */}
          <button
            onClick={() => handleAddTask('todo')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Details Meta Row: Lead, Due Date, Progress Counters */}
        <div className="pt-4 border-t border-gray-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-neutral-400">
            {/* Lead */}
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-gray-400" />
              <span className="font-normal text-gray-500">Lead:</span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {project.lead?.fullName || 'Dexter'}
              </span>
            </div>

            {/* Due Date */}
            {formattedDueDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-normal text-gray-500">Due Date:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {formattedDueDate}
                </span>
              </div>
            )}
          </div>

          {/* Task Stats Pills */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 rounded-full text-xs font-medium text-amber-700 dark:text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{inProgressTasks} In Progress</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/40 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{completedTasks} / {totalTasks} Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Tasks Section Toolbar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          PROJECT TASKS ({tasks.length})
        </h2>

        {/* View Mode Toggle Switch matching Image 1 */}
        <div className="flex items-center bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl border border-gray-200/60 dark:border-neutral-700/60">
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'board'
                ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Tasks View Component */}
      {viewMode === 'board' ? (
        <TaskBoard
          tasks={tasks}
          onAddTask={handleAddTask}
          loading={tasksLoading}
        />
      ) : (
        <TaskListView
          tasks={tasks}
          onAddTask={handleAddTask}
          loading={tasksLoading}
        />
      )}

      {/* Create Task Modal pre-configured for this project */}
      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        defaultStatus={selectedStatus}
        defaultProjectId={projectId}
      />
    </div>
  );
}
