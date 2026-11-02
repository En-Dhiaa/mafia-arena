'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { sounds } from '@/lib/audio/sound-effects';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className={cn(
          'relative w-full max-w-lg bg-noir-card border border-gold-500/30 rounded-2xl shadow-2xl p-6 overflow-hidden text-right',
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-noir-border mb-4">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-obsidian-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          {title && (
            <h3 className="text-lg font-bold text-gold-400 tracking-wide font-display">
              {title}
            </h3>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

