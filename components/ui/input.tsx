import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

    return (
      <div className="w-full space-y-1.5 text-right">
        {label && (
          <label
            htmlFor={generatedId}
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          id={generatedId}
          ref={ref}
          className={cn(
            'w-full bg-white dark:bg-noir-card/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-noir-border shadow-sm',
            'focus:outline-none focus:border-amber-500 dark:focus:border-gold-500 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-gold-500/30 transition-all duration-200',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
