'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, VolumeX, Globe, Menu, X, PlusCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { sounds } from '@/lib/audio/sound-effects';
import { Locale, t } from '@/lib/i18n';

interface NavbarProps {
  currentLocale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
}

export function Navbar({ currentLocale = 'ar', onLocaleChange }: NavbarProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>(currentLocale);

  useEffect(() => {
    setIsMuted(sounds.getMutedState());
    const savedLocale = (localStorage.getItem('mafia_locale') as Locale) || currentLocale;
    setLocale(savedLocale);
  }, [currentLocale]);

  const toggleSound = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  const switchLanguage = () => {
    sounds.playClick();
    const next: Locale = locale === 'ar' ? 'en' : 'ar';
    setLocale(next);
    localStorage.setItem('mafia_locale', next);
    if (onLocaleChange) {
      onLocaleChange(next);
    } else {
      window.location.reload();
    }
  };

  const navLinks = [
    { href: '/', label: t(locale, 'nav.home') },
    { href: '/how-to-play', label: t(locale, 'nav.howToPlay') },
    { href: '/cards', label: t(locale, 'nav.cards') },
    { href: '/rules', label: t(locale, 'nav.rules') },
    { href: '/admin', label: t(locale, 'nav.admin'), icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-gold-500/20 bg-white/90 dark:bg-obsidian-950/85 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-amber-500/50 dark:border-gold-500/50 overflow-hidden shadow-md shadow-amber-500/10 dark:shadow-gold-500/20 group-hover:scale-105 transition-transform">
            <Image
              src="/images/logo.png"
              alt="Mafia Arena Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm sm:text-base font-black tracking-wider text-slate-900 dark:text-gold-400 font-display group-hover:text-amber-600 dark:group-hover:text-gold-300 transition-colors">
              MAFIA ARENA
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 tracking-widest font-sans font-bold">
              مافيا أرينا
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-gold-400 transition-colors flex items-center gap-1.5"
            >
              {link.icon && <link.icon className="w-4 h-4 text-amber-600 dark:text-amber-500" />}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls: Theme Toggle, Audio, Language, Create Room CTA */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle />

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            title={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
            className="p-2 rounded-xl bg-white dark:bg-noir-card border border-slate-200 dark:border-noir-border text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-gold-400 hover:border-amber-400 dark:hover:border-gold-500/40 transition shadow-sm"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600 dark:text-gold-400" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={switchLanguage}
            aria-label="Switch Language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-noir-card border border-slate-200 dark:border-noir-border text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-gold-400 hover:border-amber-400 dark:hover:border-gold-500/40 transition shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
            <span>{locale === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Create Room CTA Button */}
          <Link href="/room/create" className="hidden sm:inline-block">
            <Button size="sm" variant="primary" className="gap-1.5 shadow-md text-xs py-2 px-3.5">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t(locale, 'nav.createRoom')}</span>
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open Mobile Menu"
            className="md:hidden p-2 rounded-xl bg-white dark:bg-noir-card border border-slate-200 dark:border-noir-border text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-white shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-noir-border bg-white dark:bg-obsidian-950 p-4 space-y-3 animate-fade-in text-right shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-noir-card hover:text-amber-600 dark:hover:text-gold-400 transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-noir-border flex flex-col gap-2">
            <Link href="/room/create" onClick={() => setMobileMenuOpen(false)}>
              <Button size="md" variant="primary" className="w-full">
                {t(locale, 'nav.createRoom')}
              </Button>
            </Link>
            <Link href="/room/join" onClick={() => setMobileMenuOpen(false)}>
              <Button size="md" variant="secondary" className="w-full">
                {t(locale, 'nav.joinRoom')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
