'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, ColorMode } from '@/types';
import { api } from '@/lib/api';

export const COLOR_CONFIGS: Record<ColorMode, { label: string; hex: string; ring: string }> = {
  amber: { label: 'Amber', hex: '#F59E0B', ring: '245 158 11' },
  blue: { label: 'Blue', hex: '#3B82F6', ring: '59 130 246' },
  pink: { label: 'Pink', hex: '#EC4899', ring: '236 72 153' },
  rose: { label: 'Rose', hex: '#F43F5E', ring: '244 63 94' },
  emerald: { label: 'Emerald', hex: '#10B981', ring: '16 185 129' },
  black: { label: 'Black', hex: '#000000', ring: '0 0 0' },
};

interface ThemeContextType {
  theme: ThemeMode;
  colorMode: ColorMode;
  setTheme: (mode: ThemeMode) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');

  // Load theme from localStorage on client mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as ThemeMode) || 'light';
    const savedColor = (localStorage.getItem('colorMode') as ColorMode) || 'blue';
    setThemeState(savedTheme);
    setColorModeState(savedColor);
    applyThemeAndColor(savedTheme, savedColor);
  }, []);

  const applyThemeAndColor = (t: ThemeMode, c: ColorMode) => {
    const root = document.documentElement;
    
    // Toggle 'dark' class on HTML root element for Tailwind
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set CSS variable for primary accent color
    const config = COLOR_CONFIGS[c] || COLOR_CONFIGS.blue;
    root.style.setProperty('--color-primary', config.hex);
    root.style.setProperty('--color-primary-rgb', config.ring);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyThemeAndColor(newTheme, colorMode);

    // Sync preference to backend (non-blocking)
    api.patch('/users/me/preferences', { theme: newTheme }).catch(() => {});
  };

  const setColorMode = (newColor: ColorMode) => {
    setColorModeState(newColor);
    localStorage.setItem('colorMode', newColor);
    applyThemeAndColor(theme, newColor);

    // Sync preference to backend (non-blocking)
    api.patch('/users/me/preferences', { colorMode: newColor }).catch(() => {});
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
