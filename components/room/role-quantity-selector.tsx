'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Plus, Minus, RotateCcw, Sparkles, Check, Info } from 'lucide-react';
import { DEFAULT_ROLES } from '@/lib/constants/default-roles';
import { CharacterRole } from '@/lib/types/game';
import { Badge } from '@/components/ui/badge';
import { sounds } from '@/lib/audio/sound-effects';

interface RoleQuantitySelectorProps {
  quantities: Record<string, number>;
  onChange: (quantities: Record<string, number>) => void;
  minPlayers: number;
  maxPlayers: number;
}

export function RoleQuantitySelector({
  quantities,
  onChange,
  minPlayers,
  maxPlayers,
}: RoleQuantitySelectorProps) {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const totalSelected = Object.values(quantities).reduce((acc, curr) => acc + (curr || 0), 0);

  const incrementRole = (slug: string, maxAllowed: number) => {
    sounds.playClick();
    const current = quantities[slug] || 0;
    if (current < maxAllowed && totalSelected < maxPlayers) {
      onChange({
        ...quantities,
        [slug]: current + 1,
      });
    }
  };

  const decrementRole = (slug: string) => {
    sounds.playClick();
    const current = quantities[slug] || 0;
    if (current > 0) {
      const next = current - 1;
      const copy = { ...quantities };
      if (next === 0) {
        delete copy[slug];
      } else {
        copy[slug] = next;
      }
      onChange(copy);
    }
  };

  const resetRoleToZero = (slug: string) => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(40);
      }
    } catch {}
    sounds.playCardFlip();
    const copy = { ...quantities };
    delete copy[slug];
    onChange(copy);
  };

  // Touch & Mouse handlers for Long Press
  const handleTouchStart = (slug: string) => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      resetRoleToZero(slug);
    }, 500);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent, slug: string, maxAllowed: number) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    // If it was not a long-press, treat as single click increment
    if (!isLongPressRef.current) {
      incrementRole(slug, maxAllowed);
    }
  };

  const handleTouchCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Preset: Recommended Default Balance
  const applyRecommendedPreset = () => {
    sounds.playClick();
    const recommended: Record<string, number> = {
      mafia_boss: 1,
      mafia: 1,
      doctor: 1,
      detective: 1,
      citizen: Math.max(0, minPlayers - 4),
    };
    onChange(recommended);
  };

  return (
    <div className="space-y-4 text-right">
      {/* Top Counter Bar */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-obsidian-950/80 border border-amber-200/80 dark:border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={applyRecommendedPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-noir-card border border-amber-300 dark:border-noir-border text-xs font-bold text-amber-800 dark:text-gold-300 hover:bg-amber-100 dark:hover:bg-obsidian-900 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
            <span>توزيع تلقائي متوازن</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 dark:text-slate-300">
            إجمالي البطاقات المختارة:{' '}
            <strong className="text-sm font-black text-amber-700 dark:text-gold-400 font-mono">
              {totalSelected}
            </strong>{' '}
            / {minPlayers} لاعبين كحد أدنى
          </span>
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              totalSelected >= minPlayers ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            }`}
          />
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-gold-300/80 bg-amber-100/60 dark:bg-gold-500/10 px-3 py-1.5 rounded-xl border border-amber-300/40 dark:border-gold-500/20">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          <strong>طريقة التحديد السريعة:</strong> انقر نقرة عادية لزيادة العدد (+1) &bull; اضغط ضغطة مطولة لإلغاء التحديد نهائياً (0).
        </span>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {DEFAULT_ROLES.map((role) => {
          const count = quantities[role.slug] || 0;
          const isSelected = count > 0;
          const maxAllowed = role.allow_duplicates ? 10 : 1;

          return (
            <div
              key={role.slug}
              onContextMenu={(e) => {
                e.preventDefault();
                resetRoleToZero(role.slug);
              }}
              onTouchStart={() => handleTouchStart(role.slug)}
              onTouchEnd={(e) => handleTouchEnd(e, role.slug, maxAllowed)}
              onTouchCancel={handleTouchCancel}
              onMouseDown={() => handleTouchStart(role.slug)}
              onMouseUp={(e) => handleTouchEnd(e, role.slug, maxAllowed)}
              className={`relative group rounded-2xl p-3 border transition-all duration-200 select-none cursor-pointer flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-white dark:bg-noir-card border-amber-500 dark:border-gold-500 shadow-md ring-2 ring-amber-500/20 dark:ring-gold-500/20 scale-[1.01]'
                  : 'bg-slate-50 dark:bg-obsidian-950/40 border-slate-200 dark:border-noir-border text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Role Image & Top Badges */}
              <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-200 dark:bg-obsidian-950 mb-2">
                <Image
                  src={role.image_url}
                  alt={role.name}
                  fill
                  sizes="160px"
                  className={`object-contain p-1 transition-transform duration-300 ${
                    isSelected ? 'scale-105' : 'grayscale opacity-75'
                  }`}
                />
                <div className="absolute top-1.5 right-1.5 z-10">
                  <Badge team={role.team} className="text-[9px] px-1.5 py-0.5">
                    {role.team}
                  </Badge>
                </div>

                {/* Counter Badge in corner */}
                <div className="absolute bottom-1.5 left-1.5 z-10">
                  {count > 0 ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black text-xs shadow-md border-2 border-white dark:border-obsidian-900 font-mono">
                      ×{count}
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-black/60 text-slate-300 text-[10px] font-mono">
                      0
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Lore */}
              <div className="space-y-0.5 text-right">
                <h4
                  className={`text-xs font-bold font-display truncate ${
                    isSelected ? 'text-slate-900 dark:text-gold-300' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {role.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {role.abilities}
                </p>
              </div>

              {/* Direct Plus / Minus Buttons (Stop Propagation so click goes directly to button) */}
              <div
                className="mt-2.5 pt-2 border-t border-slate-100 dark:border-noir-border/70 flex items-center justify-between gap-1"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Decrease"
                  disabled={count === 0}
                  onClick={() => decrementRole(role.slug)}
                  className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-obsidian-800 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="text-xs font-black font-mono text-slate-900 dark:text-gold-300">
                  {count}
                </span>

                <button
                  type="button"
                  aria-label="Increase"
                  disabled={count >= maxAllowed || totalSelected >= maxPlayers}
                  onClick={() => incrementRole(role.slug, maxAllowed)}
                  className="w-7 h-7 rounded-lg bg-amber-500 dark:bg-gold-500 text-white dark:text-obsidian-950 hover:bg-amber-600 dark:hover:bg-gold-400 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
