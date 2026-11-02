'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Shield, Skull, Scale, Sparkles, Eye, EyeOff } from 'lucide-react';
import { CharacterRole } from '@/lib/types/game';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { sounds } from '@/lib/audio/sound-effects';

interface CharacterCardProps {
  role: CharacterRole;
  isFlipped?: boolean;
  canFlip?: boolean;
  onFlipChange?: (flipped: boolean) => void;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  locale?: 'ar' | 'en';
}

export function CharacterCard({
  role,
  isFlipped: controlledFlipped,
  canFlip = true,
  onFlipChange,
  showDetails = true,
  size = 'md',
  className,
  locale = 'ar',
}: CharacterCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  const handleCardClick = () => {
    if (!canFlip) return;
    sounds.playCardFlip();
    const nextState = !isFlipped;
    setInternalFlipped(nextState);
    if (onFlipChange) onFlipChange(nextState);
  };

  const getTeamIcon = (team: string) => {
    switch (team) {
      case 'mafia':
        return <Skull className="w-3.5 h-3.5 text-red-400" />;
      case 'citizen':
        return <Shield className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Scale className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getTeamName = (team: string) => {
    if (locale === 'en') {
      return team.toUpperCase();
    }
    switch (team) {
      case 'mafia':
        return 'المافيا';
      case 'citizen':
        return 'المواطنون';
      default:
        return 'محايد';
    }
  };

  const sizeClasses = {
    sm: 'w-44 h-64 text-xs',
    md: 'w-64 h-96 text-sm',
    lg: 'w-80 h-[30rem] text-base',
  };

  const focalX = role.focal_point_x ?? 50;
  const focalY = role.focal_point_y ?? 35;

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'group relative perspective-1000 select-none cursor-pointer transition-transform duration-300 hover:scale-[1.02]',
        sizeClasses[size],
        className
      )}
    >
      <div
        className={cn(
          'relative w-full h-full duration-700 transform-style-preserve-3d transition-transform ease-out rounded-2xl shadow-2xl',
          isFlipped ? 'rotate-y-180' : ''
        )}
      >
        {/* ================= FRONT: CARD BACK COVER ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden border-2 border-gold-500/40 bg-gradient-to-br from-obsidian-950 via-noir-card to-obsidian-900 shadow-2xl">
          <div className="relative w-full h-full p-2.5 flex flex-col justify-between items-center">
            {/* Background Ornate Image */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <Image
                src={role.back_image_url || '/images/cards/card-back.png'}
                alt="Mafia Arena Card Back"
                fill
                priority
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* Top Emblem */}
            <div className="relative z-10 w-full flex justify-between items-center px-2 pt-1 text-gold-400">
              <Sparkles className="w-4 h-4 animate-pulse-subtle" />
              <span className="text-[10px] tracking-widest font-mono uppercase text-gold-300/80">
                MAFIA ARENA
              </span>
              <Sparkles className="w-4 h-4 animate-pulse-subtle" />
            </div>

            {/* Center Call to Action */}
            <div className="relative z-10 flex flex-col items-center justify-center p-3 text-center rounded-xl bg-obsidian-950/70 border border-gold-500/30 backdrop-blur-md">
              <Eye className="w-6 h-6 text-gold-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-gold-300">
                {locale === 'en' ? 'Tap to Reveal' : 'المس لكشف بطاقتك'}
              </span>
              <span className="text-[10px] text-slate-400">
                {locale === 'en' ? 'Top Secret' : 'سرية للغاية'}
              </span>
            </div>

            {/* Bottom Border Accent */}
            <div className="relative z-10 w-full flex justify-center pb-1">
              <span className="text-[9px] font-mono tracking-widest text-gold-500/60 uppercase">
                CONFIDENTIAL
              </span>
            </div>
          </div>
        </div>

        {/* ================= BACK: REVEALED CHARACTER CARD ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-2 border-gold-500/60 bg-gradient-to-b from-noir-card via-obsidian-900 to-black shadow-2xl flex flex-col">
          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between px-3 py-2 bg-obsidian-950/90 border-b border-gold-500/30">
            <Badge team={role.team} className="flex items-center gap-1 font-bold">
              {getTeamIcon(role.team)}
              {getTeamName(role.team)}
            </Badge>

            {canFlip && (
              <span className="text-slate-400 hover:text-gold-300 p-0.5">
                <EyeOff className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* Character Portrait with object-fit: contain/cover */}
          <div className="relative flex-1 w-full bg-gradient-to-b from-black via-obsidian-950 to-noir-card overflow-hidden">
            <Image
              src={imgError ? '/images/cards/card-back.png' : role.image_url}
              alt={locale === 'en' ? role.name_en : role.name}
              fill
              onError={() => setImgError(true)}
              sizes="(max-width: 768px) 100vw, 320px"
              style={{
                objectFit: role.fit_mode === 'cover' ? 'cover' : 'contain',
                objectPosition: `${focalX}% ${focalY}%`,
              }}
              className="p-1 transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle dark gradient overlay on bottom of portrait */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-noir-card to-transparent pointer-events-none" />
          </div>

          {/* Character Title & Description Box */}
          <div className="relative z-10 p-3 bg-noir-card/95 border-t border-gold-500/30 text-right">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-[10px] font-mono tracking-wider text-gold-400/80">
                {role.name_en}
              </span>
              <h4 className="text-base font-bold text-gold-300 font-display">
                {locale === 'en' ? role.name_en : role.name}
              </h4>
            </div>

            {showDetails && (
              <>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-1.5">
                  {locale === 'en' ? role.description_en : role.description}
                </p>

                <div className="pt-1.5 border-t border-noir-border/80 flex items-start gap-1.5 text-[10px] text-gold-200/90 bg-obsidian-950/60 p-1.5 rounded">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {locale === 'en' ? role.abilities_en : role.abilities}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

