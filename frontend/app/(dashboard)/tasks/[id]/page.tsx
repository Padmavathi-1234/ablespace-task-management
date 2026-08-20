'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTaskQuery, useUpdateTaskMutation, useDeleteTaskMutation } from '@/hooks/useTasks';
import { PriorityLevel, TaskStatus } from '@/types';
import { PrioritySelect } from '@/components/tasks/PrioritySelect';
import { DatePickerPopover } from '@/components/tasks/DatePickerPopover';
import { SubtaskTable } from '@/components/tasks/SubtaskTable';
import { CommentSection } from '@/components/tasks/CommentSection';
import { TaskDetailSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  ArrowLeft,
  Eye,
  Share2,
  MoreHorizontal,
  Columns,
  Settings,
  Calendar as CalendarIcon,
  UserPlus,
  Plus,
  FileText,
  Tag,
  Clock,
  Edit2,
  X,
  Check,
  Trash2,
  FileQuestion,
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_OPTIONS: { id: TaskStatus; label: string; bg: string; text: string }[] = [
  { id: 'backlog', label: 'Backlog', bg: 'bg-gray-100 dark:bg-neutral-800', text: 'text-gray-700 dark:text-neutral-300' },
  { id: 'todo', label: 'Todo', bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300' },
  { id: 'doing', label: 'Doing', bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300' },
  { id: 'review', label: 'Review', bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300' },
  { id: 'completed', label: 'Completed', bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300' },
  { id: 'on-hold', label: 'On Hold', bg: 'bg-rose-100 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300' },
];

const AVAILABLE_LABELS = [
  { name: 'Research', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  { name: 'Design', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  { name: 'Development', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  { name: 'Testing', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  { name: 'Deployment', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
];

interface LogEntry {
  id: string;
  text: string;
  time: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { data: task, isLoading, error } = useTaskQuery(taskId);
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  // Local state for editing title & description
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState('');

  // Date picker popover state
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Status dropdown state
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Options menu state
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Activity update logs
  const [activityLogs, setActivityLogs] = useState<LogEntry[]>([]);

  // Resources state
  const [resources, setResources] = useState<string[]>(['Figma Component Specs', 'API Endpoint Specs']);
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');

  // Selected labels state
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['Research', 'Design']);

  // Sync state when task loads
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      if (task.labels && task.labels.length > 0) {
        setSelectedLabels(task.labels.map((l) => l.name));
      }
      setActivityLogs([
        {
          id: '1',
          text: `Task created on ${new Date(task.createdAt).toLocaleDateString()}`,
          time: 'Initial',
        },
      ]);
    }
  }, [task]);

  const addLog = (text: string) => {
    setActivityLogs((prev) => [
      {
        id: Date.now().toString(),
        text,
        time: 'just now',
      },
      ...prev,
    ]);
  };

  // Title Save
  const handleSaveTitle = async () => {
    if (!title.trim() || title === task?.title) {
      setIsEditingTitle(false);
      return;
    }
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { title: title.trim() },
      });
      addLog(`You changed title to "${title.trim()}"`);
      toast.success('Title updated');
      setIsEditingTitle(false);
    } catch {
      toast.error('Failed to update title');
    }
  };

  // Description Save
  const handleSaveDescription = async () => {
    if (description === (task?.description || '')) {
      setIsEditingDesc(false);
      return;
    }
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { description: description.trim() },
      });
      addLog('You updated task description');
      toast.success('Description updated');
      setIsEditingDesc(false);
    } catch {
      toast.error('Failed to update description');
    }
  };

  // Status Change
  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === task?.status) return;
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { status: newStatus },
      });
      addLog(`You changed status to ${newStatus}`);
      toast.success(`Status changed to ${newStatus}`);
      setShowStatusDropdown(false);
    } catch {
      toast.error('Failed to update status');
    }
  };

  // Priority Change
  const handlePriorityChange = async (newPriority: PriorityLevel) => {
    if (newPriority === task?.priority) return;
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { priority: newPriority },
      });
      addLog(`You changed priority from ${task?.priority || 'No priority'} to ${newPriority}`);
      toast.success(`Priority updated to ${newPriority}`);
    } catch {
      toast.error('Failed to update priority');
    }
  };

  // Date Change
  const handleDateSelect = async (date: Date) => {
    try {
      const isoDate = date.toISOString();
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { dueDate: isoDate },
      });
      addLog(`You set due date to ${date.toLocaleDateString()}`);
      toast.success('Due date updated');
      setShowDatePicker(false);
    } catch {
      toast.error('Failed to update due date');
    }
  };

  // Delete Task
  const handleDeleteTask = async () => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      toast.success('Task deleted successfully');
      router.push('/tasks');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  // Toggle Label
  const handleToggleLabel = (labelName: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelName) ? prev.filter((l) => l !== labelName) : [...prev, labelName]
    );
    addLog(`You updated labels`);
  };

  // Add Resource Link
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceName.trim()) return;
    setResources((prev) => [...prev, newResourceName.trim()]);
    setNewResourceName('');
    setShowAddResource(false);
    toast.success('Resource link added');
  };

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (error || !task) {
    return (
      <div className="max-w-xl mx-auto my-12">
        <EmptyState
          icon={FileQuestion}
          title="Task not found"
          description="The requested task could not be found or may have been deleted."
          actionLabel="Return to Tasks"
          onAction={() => router.push('/tasks')}
        />
      </div>
    );
  }

  const currentStatusObj =
    STATUS_OPTIONS.find((s) => s.id === task.status) || STATUS_OPTIONS[1];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
          <button
            onClick={() => router.push('/tasks')}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors mr-1 cursor-pointer"
            title="Back to tasks"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-neutral-300" />
          </button>
          <span className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
            Workspace
          </span>
          <span>/</span>
          <Link
            href="/tasks"
            className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Tasks
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-900 dark:text-white truncate max-w-xs">
            {task.title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Watchers */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-850 transition-colors cursor-pointer"
            title="Watchers"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>1</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Task link copied to clipboard');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-850 transition-colors cursor-pointer"
            title="Share Task"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Options Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-850 transition-colors cursor-pointer"
              title="More Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showOptionsMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowOptionsMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 py-1 z-20 text-left">
                  <button
                    onClick={() => {
                      setShowOptionsMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Task
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Split View Toggle */}
          <button
            type="button"
            className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-850 transition-colors cursor-pointer"
            title="Split View"
          >
            <Columns className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Main Column (flex-1) */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {/* Title Area */}
          <div className="space-y-3">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') {
                      setTitle(task.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="w-full text-2xl font-bold bg-white dark:bg-neutral-900 border border-[var(--color-primary)] rounded-xl px-3 py-1.5 text-gray-900 dark:text-white focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-2 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 cursor-pointer shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTitle(task.title);
                    setIsEditingTitle(false);
                  }}
                  className="p-2 rounded-xl border border-gray-200 dark:border-neutral-800 text-gray-500 hover:bg-gray-100 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="group flex items-start justify-between gap-3">
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100/70 dark:hover:bg-neutral-850 px-2 py-1 -ml-2 rounded-xl transition-colors flex-1"
                  title="Click to edit title"
                >
                  {task.title}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-opacity cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
                  title="Edit title"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Properties Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Designer
              </span>

              {task.dueDate && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {new Date(task.dueDate).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              )}
            </div>

            {/* Labels Row */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {selectedLabels.map((lbl) => {
                const matched = AVAILABLE_LABELS.find((al) => al.name === lbl);
                return (
                  <span
                    key={lbl}
                    className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full border ${
                      matched
                        ? matched.color
                        : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300 border-gray-200'
                    }`}
                  >
                    {lbl}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 bg-white dark:bg-neutral-900 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Description
              </h3>
              {!isEditingDesc && (
                <button
                  type="button"
                  onClick={() => setIsEditingDesc(true)}
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingDesc ? (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  autoFocus
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a detailed description..."
                  className="w-full text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-neutral-950 p-3 rounded-xl border border-[var(--color-primary)] focus:outline-hidden resize-y"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditingDesc(false)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-xs font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDescription}
                    className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p
                onClick={() => setIsEditingDesc(true)}
                className="text-xs text-gray-700 dark:text-neutral-300 leading-relaxed cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-850/50 p-2 -m-2 rounded-lg transition-colors"
              >
                {task.description || 'No description provided. Click to add details...'}
              </p>
            )}
          </div>

          {/* Resources Section */}
          <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 bg-white dark:bg-neutral-900 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Resources</span>
            </h3>

            <div className="space-y-2">
              {resources.map((res, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-neutral-850/50 border border-gray-100 dark:border-neutral-800 text-xs font-medium text-gray-800 dark:text-neutral-200"
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    {res}
                  </span>
                  <span className="text-[10px] text-[var(--color-primary)] hover:underline cursor-pointer">
                    Open
                  </span>
                </div>
              ))}

              {showAddResource ? (
                <form onSubmit={handleAddResource} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Document title or URL..."
                    value={newResourceName}
                    onChange={(e) => setNewResourceName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--color-primary)] bg-white dark:bg-neutral-950 text-xs text-gray-900 dark:text-white focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddResource(false)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-xs font-medium text-gray-600 dark:text-neutral-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddResource(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline transition-colors cursor-pointer pt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add document or link...</span>
                </button>
              )}
            </div>
          </div>

          {/* Subtasks Section */}
          <SubtaskTable taskId={taskId} subtasks={task.subtasks} projectId={task.projectId} />

          {/* Comments & Activity Section */}
          <CommentSection taskId={taskId} comments={task.comments} />
        </div>

        {/* Right Details Sidebar (w-80 or w-90) */}
        <div className="w-full lg:w-80 shrink-0 space-y-6 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 bg-white dark:bg-neutral-900 shadow-xs">
          {/* Heading */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Details</h2>
            <Settings className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
          </div>

          <div className="space-y-4 text-xs">
            {/* Status Property */}
            <div className="space-y-1.5 relative">
              <span className="text-gray-400 dark:text-neutral-500 font-medium">Status</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown((prev) => !prev)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-transparent ${currentStatusObj.bg} ${currentStatusObj.text}`}
                >
                  <span className="capitalize">{currentStatusObj.label}</span>
                  <MoreHorizontal className="w-3.5 h-3.5 opacity-60" />
                </button>

                {showStatusDropdown && (
                  <div className="absolute left-0 top-full mt-1.5 w-full z-40 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg p-1 space-y-0.5">
                    {STATUS_OPTIONS.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleStatusChange(st.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-left cursor-pointer transition-colors ${
                          st.id === task.status
                            ? 'bg-gray-100 dark:bg-neutral-800 font-bold'
                            : 'hover:bg-gray-50 dark:hover:bg-neutral-850'
                        }`}
                      >
                        <span className={st.text}>{st.label}</span>
                        {st.id === task.status && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Priority Property */}
            <div className="space-y-1.5">
              <span className="text-gray-400 dark:text-neutral-500 font-medium">Priority</span>
              <PrioritySelect
                value={task.priority}
                onChange={handlePriorityChange}
                className="w-full"
              />
            </div>

            {/* Assignee / Members Property */}
            <div className="space-y-1.5">
              <span className="text-gray-400 dark:text-neutral-500 font-medium">Members</span>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-neutral-850/50 border border-gray-100 dark:border-neutral-800">
                {task.user ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-[10px]">
                      {task.user.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-neutral-200 truncate">
                      {task.user.fullName}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => toast.info('Member assignment popover demo')}
                    className="flex items-center gap-1.5 text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add members</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dates Property with DatePickerPopover */}
            <div className="space-y-1.5 relative">
              <span className="text-gray-400 dark:text-neutral-500 font-medium">Due Date</span>
              <button
                type="button"
                onClick={() => setShowDatePicker((prev) => !prev)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium text-gray-800 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-850 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                  {task.dueDate
                    ? `${new Date(task.dueDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}`
                    : 'Select due date'}
                </span>
              </button>

              {showDatePicker && (
                <DatePickerPopover
                  selectedDate={task.dueDate}
                  onSelectDate={handleDateSelect}
                  onClose={() => setShowDatePicker(false)}
                  align="right"
                />
              )}
            </div>

            {/* Labels Property */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-neutral-800">
              <span className="text-gray-400 dark:text-neutral-500 font-medium flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Labels
              </span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_LABELS.map((lbl) => {
                  const isSelected = selectedLabels.includes(lbl.name);
                  return (
                    <button
                      key={lbl.name}
                      type="button"
                      onClick={() => handleToggleLabel(lbl.name)}
                      className={`px-2 py-0.5 text-[11px] font-medium rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? lbl.color + ' ring-1 ring-[var(--color-primary)]'
                          : 'bg-gray-50 text-gray-400 border-gray-200 dark:bg-neutral-850 dark:text-neutral-500 dark:border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {isSelected ? `✓ ${lbl.name}` : `+ ${lbl.name}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Updates Feed */}
            <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-neutral-800">
              <h4 className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>Updates Feed</span>
              </h4>

              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-[11px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-neutral-300 leading-snug">{log.text}</p>
                      <span className="text-[10px] text-gray-400 dark:text-neutral-500">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        description={`Are you sure you want to delete task "${task.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        isLoading={deleteTaskMutation.isPending}
      />
    </div>
  );
}
