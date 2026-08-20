'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sun, 
  Moon, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Palette, 
  Check,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { COLOR_CONFIGS } from '@/context/ThemeContext';
import { ColorMode } from '@/types';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserMenu({ isOpen, onClose }: UserMenuProps) {
  const { user, logout } = useAuth();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  
  // Track active sub-view: 'main' | 'theme' | 'color'
  const [activeTab, setActiveTab] = useState<'main' | 'theme' | 'color'>('main');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset tab to main when closed
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('main');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayName = user?.fullName || 'Dexter';
  const displayEmail = user?.email || 'dexter@gmail.com';
  const initial = displayName.charAt(0).toUpperCase();

  const colorModes: ColorMode[] = ['amber', 'blue', 'pink', 'rose', 'emerald', 'black'];

  return (
    <div
      ref={menuRef}
      className="absolute bottom-16 left-3 w-64 z-50 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 text-sm text-gray-800 dark:text-neutral-200 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      {/* Header with User Info */}
      <div className="flex items-center gap-3 p-2.5 mb-1 border-b border-gray-100 dark:border-neutral-800">
        <div className="h-9 w-9 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
          {initial}
        </div>
        <div className="overflow-hidden">
          <p className="font-semibold text-gray-900 dark:text-white truncate leading-tight">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
            {displayEmail}
          </p>
        </div>
      </div>

      {activeTab === 'main' && (
        <div className="space-y-0.5">
          {/* Change Theme trigger */}
          <button
            onClick={() => setActiveTab('theme')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-left text-xs font-medium cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              Change Theme
            </span>
            <div className="flex items-center gap-1 text-gray-400 dark:text-neutral-500">
              <span className="text-[11px] capitalize">{theme}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Color Mode trigger */}
          <button
            onClick={() => setActiveTab('color')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-left text-xs font-medium cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-[var(--color-primary)]" />
              Color Mode
            </span>
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-neutral-500">
              <span
                className="w-3 h-3 rounded-full inline-block border border-black/10 dark:border-white/20"
                style={{ backgroundColor: COLOR_CONFIGS[colorMode]?.hex || '#3B82F6' }}
              />
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <div className="my-1 border-t border-gray-100 dark:border-neutral-800" />

          {/* Settings link */}
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-xs font-medium text-gray-700 dark:text-neutral-300"
          >
            <Settings className="w-4 h-4 text-gray-500 dark:text-neutral-400" />
            Settings
          </Link>

          {/* Logout */}
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-xs font-medium text-red-600 dark:text-red-400 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

      {/* Theme Selection Submenu */}
      {activeTab === 'theme' && (
        <div>
          <button
            onClick={() => setActiveTab('main')}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 mb-1 text-xs font-medium text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to menu
          </button>
          <div className="space-y-1 pt-1 border-t border-gray-100 dark:border-neutral-800">
            <button
              onClick={() => {
                setTheme('light');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold'
                  : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50 text-gray-600 dark:text-neutral-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-500" />
                Light
              </span>
              {theme === 'light' && <Check className="w-4 h-4 text-[var(--color-primary)]" />}
            </button>

            <button
              onClick={() => {
                setTheme('dark');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold'
                  : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50 text-gray-600 dark:text-neutral-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-purple-400" />
                Dark
              </span>
              {theme === 'dark' && <Check className="w-4 h-4 text-[var(--color-primary)]" />}
            </button>
          </div>
        </div>
      )}

      {/* Color Mode Selection Submenu */}
      {activeTab === 'color' && (
        <div>
          <button
            onClick={() => setActiveTab('main')}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 mb-1 text-xs font-medium text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to menu
          </button>
          <div className="space-y-1 pt-1 border-t border-gray-100 dark:border-neutral-800 max-h-56 overflow-y-auto">
            {colorModes.map((mode) => {
              const cfg = COLOR_CONFIGS[mode];
              const isActive = colorMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setColorMode(mode)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold'
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50 text-gray-600 dark:text-neutral-400'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-md shadow-xs border border-black/10 dark:border-white/20 inline-block shrink-0"
                      style={{ backgroundColor: cfg.hex }}
                    />
                    {cfg.label}
                  </span>
                  {isActive && <Check className="w-4 h-4 text-gray-900 dark:text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
