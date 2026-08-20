import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className = '' }: BadgeProps) {
  // If a specific hex or color string is provided, fallback to inline styling or default pill
  const isCustomHex = color?.startsWith('#');

  return (
    <span
      style={isCustomHex ? { backgroundColor: `${color}20`, color: color, borderColor: `${color}40` } : undefined}
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-md border ${
        !isCustomHex
          ? 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 border-gray-200 dark:border-neutral-700'
          : ''
      } ${className}`}
    >
      {children}
    </span>
  );
}
