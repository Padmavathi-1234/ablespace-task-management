'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Folder, 
  ChevronDown, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeftOpen,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from './UserMenu';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

  const displayName = user?.fullName || 'Dexter';
  const initial = displayName.charAt(0).toUpperCase();

  const navItems = [
    { label: 'Tasks', href: '/tasks', icon: LayoutGrid },
    { label: 'Projects', href: '/projects', icon: Folder },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen border-r border-gray-200 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-950/80 backdrop-blur-md select-none transition-all duration-300 ease-in-out z-30 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Workspace / User Profile Header */}
      <div className="p-3 border-b border-gray-200/60 dark:border-neutral-800/80">
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/60 dark:hover:bg-neutral-800/60 transition-colors text-left cursor-pointer ${
            collapsed ? 'justify-center p-1.5' : ''
          }`}
          title={collapsed ? `${displayName}'s Workspace` : undefined}
        >
          <div className="relative">
            <div className="h-8 w-8 rounded-lg bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
              {initial}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900" />
          </div>

          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                  {displayName}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-neutral-400 truncate">
                Workspace
              </p>
            </div>
          )}

          {!collapsed && (
            <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-neutral-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {/* User Menu Popover */}
        <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {/* Workspace Group */}
        <div>
          {!collapsed ? (
            <button
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider hover:text-gray-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
            >
              <span>Workspace</span>
              {isWorkspaceOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <div className="h-4 border-b border-gray-200 dark:border-neutral-800 my-1" />
          )}

          {(isWorkspaceOpen || collapsed) && (
            <nav className="mt-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gray-200/80 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold shadow-2xs'
                        : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-neutral-200'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[var(--color-primary)]' : 'text-gray-500 dark:text-neutral-400'
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>

      {/* Footer Collapse Toggle */}
      <div className="p-3 border-t border-gray-200/60 dark:border-neutral-800/80 flex items-center justify-between">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 p-2 rounded-lg text-gray-500 dark:text-neutral-400 hover:bg-gray-200/60 dark:hover:bg-neutral-800/60 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer text-xs font-medium ${
            collapsed ? 'w-full justify-center' : 'w-full'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
