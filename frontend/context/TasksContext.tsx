'use client';

import React, { createContext, useContext, useState } from 'react';
import { TaskStatus } from '@/types';
import { ViewMode } from '@/components/tasks/FieldsDropdown';

interface TasksContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  visibleFields: Record<string, boolean>;
  toggleField: (fieldKey: string) => void;
  statusFilter: string | undefined;
  setStatusFilter: (status: string | undefined) => void;
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  defaultStatus: TaskStatus;
  openCreateModal: (status?: TaskStatus) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: false,
  });

  const toggleField = (fieldKey: string) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldKey]: prev[fieldKey] === false ? true : false,
    }));
  };

  const openCreateModal = (status?: TaskStatus) => {
    setDefaultStatus(status || 'todo');
    setCreateModalOpen(true);
  };

  return (
    <TasksContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        visibleFields,
        toggleField,
        statusFilter,
        setStatusFilter,
        createModalOpen,
        setCreateModalOpen,
        defaultStatus,
        openCreateModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    return {
      searchQuery: '',
      setSearchQuery: () => {},
      viewMode: 'board' as ViewMode,
      setViewMode: () => {},
      visibleFields: { priority: true, members: true, dueDate: true, labels: true, status: true, reporter: false },
      toggleField: () => {},
      statusFilter: undefined,
      setStatusFilter: () => {},
      createModalOpen: false,
      setCreateModalOpen: () => {},
      defaultStatus: 'todo' as TaskStatus,
      openCreateModal: () => {},
    };
  }
  return context;
}
