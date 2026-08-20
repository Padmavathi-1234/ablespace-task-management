import React from 'react';
import { PriorityLevel } from '@/types';
import { 
  SignalHigh, 
  SignalMedium, 
  SignalLow, 
  Minus 
} from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel | string;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const normalized = (priority || 'no-priority').toLowerCase();

  switch (normalized) {
    case 'urgent':
    case 'high':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-red-500 dark:text-red-400 ${className}`}
          title="High Priority"
        >
          <SignalHigh className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span>High</span>
        </span>
      );
    case 'medium':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-amber-500 dark:text-amber-400 ${className}`}
          title="Medium Priority"
        >
          <SignalMedium className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Medium</span>
        </span>
      );
    case 'low':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-400 ${className}`}
          title="Low Priority"
        >
          <SignalLow className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>Low</span>
        </span>
      );
    case 'no-priority':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-gray-300 dark:text-neutral-600 ${className}`}
          title="No Priority"
        >
          <Minus className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          <span>No Priority</span>
        </span>
      );
  }
}
