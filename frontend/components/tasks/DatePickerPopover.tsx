'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  isValid,
} from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerPopoverProps {
  selectedDate?: Date | string | null;
  onSelectDate: (date: Date) => void;
  onClose?: () => void;
  align?: 'left' | 'right';
}

export function DatePickerPopover({
  selectedDate,
  onSelectDate,
  onClose,
  align = 'right',
}: DatePickerPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  const initialDate = React.useMemo(() => {
    if (!selectedDate) return new Date();
    if (selectedDate instanceof Date) return selectedDate;
    const parsed = parseISO(selectedDate);
    return isValid(parsed) ? parsed : new Date();
  }, [selectedDate]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div
      ref={popoverRef}
      className={`absolute top-full mt-2 ${
        align === 'right' ? 'right-0' : 'left-0'
      } z-50 w-72 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150`}
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-neutral-400 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-neutral-400 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-gray-400 dark:text-neutral-500 pt-3 pb-1">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day) => {
          const isSelected = selectedDate ? isSameDay(day, initialDate) : false;
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => {
                onSelectDate(day);
                onClose?.();
              }}
              className={`h-8 w-8 mx-auto flex items-center justify-center text-xs rounded-full transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold shadow-xs scale-105'
                  : isCurrentMonth
                  ? 'text-gray-800 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800'
                  : 'text-gray-300 dark:text-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-850'
              }`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Today Quick Select */}
      <div className="pt-3 mt-2 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            onSelectDate(new Date());
            onClose?.();
          }}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Today
        </button>
      </div>
    </div>
  );
}
