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
  Sparkles,
  ChevronsUpDown,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from './UserMenu';

interface SidebarProps {
  collapsed: boolean;
  onToggleDesktop: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  collapsed,
  onToggleDesktop,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

  const displayName = user?.fullName || 'Dexter';
  const initial = displayName.charAt(0).toUpperCase();

  const navItems = [
    { label: 'Tasks', href: '/tasks', icon: LayoutGrid },
    { label: 'Projects', href: '/projects', icon: Folder },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Element */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:z-30 lg:static flex flex-col h-screen border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 backdrop-blur-md select-none transition-all duration-300 ease-in-out shrink-0 ${
          // Desktop width
          collapsed ? 'lg:w-16' : 'lg:w-64'
        } ${
          // Mobile transform & width
          mobileOpen
            ? 'translate-x-0 w-64 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Workspace / User Profile Header */}
        <div className="p-3 border-b border-gray-200/60 dark:border-neutral-800/80 relative flex items-center justify-between">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex-1 flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800/60 transition-colors text-left cursor-pointer ${
              collapsed ? 'lg:justify-center lg:p-1.5' : ''
            }`}
            title={collapsed ? `${displayName}'s Workspace` : undefined}
          >
            <div className="relative shrink-0">
              <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-sm shadow-xs overflow-hidden">
                {initial}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900" />
            </div>

            <div className={`flex-1 overflow-hidden ${collapsed ? 'lg:hidden' : 'block'}`}>
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

            <ChevronsUpDown className={`w-4 h-4 text-gray-400 dark:text-neutral-500 shrink-0 ${collapsed ? 'lg:hidden' : 'block'}`} />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 lg:hidden cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
            title="Close menu"
          >
            <X className="w-5 h-5" />
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
              <div className="h-4 border-b border-gray-200 dark:border-neutral-800 my-1 hidden lg:block" />
            )}

            {(isWorkspaceOpen || collapsed) && (
              <nav className="mt-1 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}`));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        if (mobileOpen) onCloseMobile();
                      }}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gray-200/80 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold shadow-2xs'
                          : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-neutral-200'
                      } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[var(--color-primary)]' : 'text-gray-500 dark:text-neutral-400'
                        }`}
                      />
                      <span className={collapsed ? 'lg:hidden' : 'block'}>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        {/* Desktop Footer Collapse Toggle */}
        <div className="p-3 border-t border-gray-200/60 dark:border-neutral-800/80 hidden lg:flex items-center justify-between">
          <button
            onClick={onToggleDesktop}
            className={`flex items-center gap-2 p-2 rounded-xl text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800/60 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer text-xs font-medium ${
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
    </>
  );
}
