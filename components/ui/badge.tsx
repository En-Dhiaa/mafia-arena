import React from 'react';
import { cn } from '@/lib/utils/cn';
import { TeamType } from '@/lib/types/game';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'mafia' | 'citizen' | 'arbiter' | 'neutral' | 'success' | 'outline';
  team?: TeamType;
  className?: string;
}

export function Badge({ children, variant, team, className }: BadgeProps) {
  let effectiveVariant = variant || 'gold';
  if (team) {
    if (team === 'mafia') effectiveVariant = 'mafia';
    else if (team === 'citizen') effectiveVariant = 'citizen';
    else effectiveVariant = 'arbiter';
  }

  const variants = {
    gold: 'bg-gold-500/15 text-gold-300 border-gold-500/30',
    mafia: 'bg-red-500/15 text-red-400 border-red-500/40',
    citizen: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
    arbiter: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
    neutral: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
    outline: 'bg-transparent text-slate-300 border-slate-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase',
        variants[effectiveVariant],
        className
      )}
    >
      {children}
    </span>
  );
}

