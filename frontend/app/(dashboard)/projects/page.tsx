'use client';

import React, { useState, useMemo } from 'react';
import { useProjectsQuery } from '@/hooks/useProjects';
import { ProjectRow } from '@/components/projects/ProjectRow';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { ProjectsTableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  Search, 
  Filter, 
  Plus, 
  SlidersHorizontal,
  FolderPlus,
  SearchX
} from 'lucide-react';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data: projects = [], isLoading, error } = useProjectsQuery();

  // Filter projects by search query and priority
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description &&
          project.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        priorityFilter === 'all' ||
        project.priority?.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesPriority;
    });
  }, [projects, searchQuery, priorityFilter]);

  const hasFilterOrSearch = Boolean(searchQuery || priorityFilter !== 'all');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Toolbar Header matching Figma */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-2xs">
        {/* Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Projects
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400">
            {filteredProjects.length}
          </span>
        </div>

        {/* Search, Fields, Filter, + Add Project CTA */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700/80 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 transition-all"
            />
          </div>

          {/* Fields Dropdown Button */}
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-neutral-300 bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700/80 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700/80 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 dark:text-neutral-400" />
            <span>Fields</span>
          </button>

          {/* Filter Icon & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-xl transition-colors cursor-pointer ${
                priorityFilter !== 'all'
                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                  : 'bg-gray-50 dark:bg-neutral-800/80 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-700/80 hover:bg-gray-100 dark:hover:bg-neutral-700/80'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>

            {filterMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setFilterMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-800 p-2 z-20 space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase px-2 py-1">
                    Priority Filter
                  </div>
                  {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPriorityFilter(p);
                        setFilterMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg capitalize transition-colors flex items-center justify-between cursor-pointer ${
                        priorityFilter === p
                          ? 'bg-gray-100 dark:bg-neutral-800 font-semibold text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/60'
                      }`}
                    >
                      <span>{p}</span>
                      {priorityFilter === p && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* "+ Add Project" CTA (Black background as specified in Figma specs) */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      {isLoading ? (
        <ProjectsTableSkeleton />
      ) : error ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 p-8 text-center text-xs text-red-600 dark:text-red-400">
          Failed to load projects. Please try refreshing.
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={hasFilterOrSearch ? SearchX : FolderPlus}
          title={hasFilterOrSearch ? 'No matching projects' : 'No projects yet'}
          description={
            hasFilterOrSearch
              ? 'No projects match your search query or priority filter.'
              : 'Get started by creating your first project to organize tasks.'
          }
          actionLabel="Add Project"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-gray-200/80 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/30">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Bar "+ Add Projects" Button matching Figma spec */}
          <div className="p-3 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/40 dark:bg-neutral-900/40">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <Plus className="w-4 h-4 text-gray-400" />
              <span>Add Projects</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
