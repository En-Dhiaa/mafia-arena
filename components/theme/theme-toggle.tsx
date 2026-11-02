'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { sounds } from '@/lib/audio/sound-effects';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Default to light theme as requested: "اجعل الالوان فاتحة الافتراضي ويمكن تغيير الوضع"
    const savedTheme = localStorage.getItem('mafia_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    sounds.playClick();
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('mafia_theme', nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === 'light' ? 'تفعيل الوضع الداكن (Dark Mode)' : 'تفعيل الوضع الفاتح (Light Mode)'}
      aria-label="Toggle Theme"
      className="p-2 rounded-xl border transition-all duration-200 select-none flex items-center justify-center active:scale-95 bg-white dark:bg-noir-card border-slate-200 dark:border-noir-border text-slate-700 dark:text-gold-400 hover:border-amber-400 dark:hover:border-gold-500/50 shadow-sm"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-slate-700 hover:text-amber-600 transition-colors" />
      ) : (
        <Sun className="w-4 h-4 text-gold-400 hover:text-gold-300 transition-colors" />
      )}
    </button>
  );
}
