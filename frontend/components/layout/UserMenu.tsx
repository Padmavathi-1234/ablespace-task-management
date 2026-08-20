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
  Square
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
  
  // Track open flyout: null | 'theme' | 'color'
  const [activeFlyout, setActiveFlyout] = useState<'theme' | 'color' | null>(null);
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

  // Reset flyout state when closed
  useEffect(() => {
    if (!isOpen) {
      setActiveFlyout(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayName = user?.fullName || 'Dexter';
  const displayEmail = user?.email || 'Dexter@gmail.com';
  const initial = displayName.charAt(0).toUpperCase();

  const colorModes: ColorMode[] = ['amber', 'blue', 'pink', 'rose', 'emerald', 'black'];

  return (
    <div
      ref={menuRef}
      className="absolute top-16 left-3 w-60 z-50 bg-white dark:bg-neutral-900 border border-gray-200/90 dark:border-neutral-800 rounded-2xl shadow-xl p-4 text-xs text-gray-800 dark:text-neutral-200 animate-in fade-in zoom-in-95 duration-150 select-none"
    >
      {/* Top Profile Header (Centered Avatar, Name, Email matching Figma Image 1) */}
      <div className="flex flex-col items-center justify-center pb-3 text-center">
        <div className="h-14 w-14 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center text-xl shadow-md border-2 border-white dark:border-neutral-800 mb-2.5 overflow-hidden">
          {initial}
        </div>
        <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
          {displayName}
        </p>
        <p className="text-xs text-gray-500 dark:text-neutral-400 font-normal truncate max-w-full mt-0.5">
          {displayEmail}
        </p>
      </div>

      {/* Horizontal Divider Line */}
      <div className="border-t border-gray-100 dark:border-neutral-800 my-3" />

      {/* Main Menu Action Items */}
      <div className="space-y-1 relative">
        {/* 1. Change Theme */}
        <div className="relative" onMouseEnter={() => setActiveFlyout('theme')}>
          <button
            onClick={() => setActiveFlyout(activeFlyout === 'theme' ? null : 'theme')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left text-xs font-medium cursor-pointer ${
              activeFlyout === 'theme'
                ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white'
                : 'hover:bg-gray-100/80 dark:hover:bg-neutral-800/60 text-gray-700 dark:text-neutral-300'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-gray-600 dark:text-neutral-400" />
              <span>Change Theme</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Theme Submenu Flyout (Popping out to the right matching Image 1) */}
          {activeFlyout === 'theme' && (
            <div 
              className="absolute left-[calc(100%+8px)] -top-1 w-36 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-left-2 duration-150"
              onMouseLeave={() => setActiveFlyout(null)}
            >
              <div className="text-[10px] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider px-2.5 py-1 mb-1">
                Theme
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setTheme('light');
                    setActiveFlyout(null);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    theme === 'light'
                      ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold'
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50 text-gray-600 dark:text-neutral-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    Light
                  </span>
                  {theme === 'light' && <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white" />}
                </button>

                <button
                  onClick={() => {
                    setTheme('dark');
                    setActiveFlyout(null);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold'
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50 text-gray-600 dark:text-neutral-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Moon className="w-3.5 h-3.5 text-purple-400" />
                    Dark
                  </span>
                  {theme === 'dark' && <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Color Mode */}
        <div className="relative" onMouseEnter={() => setActiveFlyout('color')}>
          <button
            onClick={() => setActiveFlyout(activeFlyout === 'color' ? null : 'color')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left text-xs font-medium cursor-pointer ${
              activeFlyout === 'color'
                ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white'
                : 'hover:bg-gray-100/80 dark:hover:bg-neutral-800/60 text-gray-700 dark:text-neutral-300'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Square className="w-4 h-4 text-gray-900 dark:text-white fill-gray-900 dark:fill-white" />
              <span>Color Mode</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Color Submenu Flyout (Popping out to the right matching Image 1) */}
          {activeFlyout === 'color' && (
            <div 
              className="absolute left-[calc(100%+8px)] -top-9 w-44 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-left-2 duration-150"
              onMouseLeave={() => setActiveFlyout(null)}
            >
              <div className="text-[10px] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider px-2.5 py-1 mb-1">
                Color Mode
              </div>
              <div className="space-y-0.5 max-h-52 overflow-y-auto">
                {colorModes.map((mode) => {
                  const cfg = COLOR_CONFIGS[mode];
                  const isActive = colorMode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        setColorMode(mode);
                        setActiveFlyout(null);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold'
                          : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50 text-gray-600 dark:text-neutral-400'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-2xs border border-black/10 dark:border-white/20 inline-block shrink-0"
                          style={{ backgroundColor: cfg.hex }}
                        />
                        {cfg.label}
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. Settings */}
        <Link
          href="/settings"
          onClick={onClose}
          onMouseEnter={() => setActiveFlyout(null)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-neutral-800/60 transition-colors text-xs font-medium text-gray-700 dark:text-neutral-300"
        >
          <Settings className="w-4 h-4 text-gray-600 dark:text-neutral-400" />
          <span>Settings</span>
        </Link>

        {/* 4. Logout */}
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          onMouseEnter={() => setActiveFlyout(null)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-xs font-medium text-red-600 dark:text-red-400 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
