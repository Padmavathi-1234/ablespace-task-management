'use client';

import React from 'react';
import { useTasksQuery } from '@/hooks/useTasks';
import { useTasksContext } from '@/context/TasksContext';
import { TasksToolbar } from '@/components/tasks/TasksToolbar';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskListView } from '@/components/tasks/TaskListView';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';

export default function TasksPage() {
  const {
    searchQuery,
    viewMode,
    visibleFields,
    statusFilter,
    createModalOpen,
    setCreateModalOpen,
    defaultStatus,
    openCreateModal,
  } = useTasksContext();

  // Query tasks from API
  const { data: tasks = [], isLoading, error } = useTasksQuery({
    search: searchQuery ? searchQuery : undefined,
    status: statusFilter ? statusFilter : undefined,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header Toolbar containing Tasks title, avatar stack, and right action buttons */}
      <TasksToolbar />

      {/* Main View: Board vs List */}
      {error ? (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center text-xs text-red-600 dark:text-red-400">
          Failed to load tasks from server. Please check your backend connection.
        </div>
      ) : viewMode === 'board' ? (
        <TaskBoard
          tasks={tasks}
          visibleFields={visibleFields}
          onAddTask={openCreateModal}
          loading={isLoading}
        />
      ) : (
        <TaskListView
          tasks={tasks}
          visibleFields={visibleFields}
          onAddTask={openCreateModal}
          loading={isLoading}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
