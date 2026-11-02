'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { sounds } from '@/lib/audio/sound-effects';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'mafia' | 'citizen' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      sounds.playClick();
      if (onClick) onClick(e);
    };

    const baseStyles =
      'inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] shadow-sm';

    const variants = {
      primary:
        'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 dark:from-gold-500 dark:to-amber-600 text-white dark:text-obsidian-950 hover:from-amber-600 hover:to-amber-800 dark:hover:from-gold-400 dark:hover:to-amber-500 shadow-amber-500/20 dark:shadow-gold-500/20 border border-amber-400/40 dark:border-gold-400/40 focus:ring-amber-500',
      mafia:
        'bg-gradient-to-r from-red-600 to-rose-800 dark:from-red-700 dark:to-rose-900 text-white hover:from-red-700 hover:to-rose-900 shadow-red-600/30 border border-red-500/30 focus:ring-red-500',
      citizen:
        'bg-gradient-to-r from-blue-600 to-indigo-800 dark:from-blue-700 dark:to-cyan-900 text-white hover:from-blue-700 hover:to-indigo-900 shadow-blue-600/30 border border-blue-500/30 focus:ring-blue-500',
      secondary:
        'bg-white dark:bg-noir-card text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-obsidian-700 border border-slate-300 dark:border-noir-border hover:border-amber-500/40 focus:ring-slate-400',
      outline:
        'bg-transparent text-amber-700 dark:text-gold-400 border border-amber-400 dark:border-gold-500/50 hover:bg-amber-50 dark:hover:bg-gold-500/10 focus:ring-amber-500',
      ghost:
        'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-noir-card/60 hover:text-slate-900 dark:hover:text-white focus:ring-amber-500 shadow-none',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
