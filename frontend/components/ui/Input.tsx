import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-200 dark:border-neutral-800 focus:border-gray-400 dark:focus:border-neutral-600'
          } rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 outline-hidden transition-colors ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
