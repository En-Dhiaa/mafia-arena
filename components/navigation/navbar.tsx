'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, VolumeX, Globe, Menu, X, PlusCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <header className="sticky top-0 z-40 w-full border-b border-gold-500/20 bg-obsidian-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full border border-gold-500/50 overflow-hidden shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform">
            <Image
              src="/images/logo.png"
              alt="Mafia Arena Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-wider text-gold-400 font-display group-hover:text-gold-300 transition-colors">
              MAFIA ARENA
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 tracking-widest font-sans">
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
              className="text-sm font-medium text-slate-300 hover:text-gold-400 transition-colors flex items-center gap-1.5"
            >
              {link.icon && <link.icon className="w-4 h-4 text-amber-500" />}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls: Audio, Language, Create Room CTA */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-2 rounded-lg bg-noir-card border border-noir-border text-slate-300 hover:text-gold-400 hover:border-gold-500/40 transition"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-gold-400" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={switchLanguage}
            aria-label="Switch Language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-noir-card border border-noir-border text-xs font-semibold text-slate-300 hover:text-gold-400 hover:border-gold-500/40 transition"
          >
            <Globe className="w-3.5 h-3.5 text-gold-400" />
            <span>{locale === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Create Room CTA Button */}
          <Link href="/room/create" className="hidden sm:inline-block">
            <Button size="sm" variant="primary" className="gap-1.5 shadow-md">
              <PlusCircle className="w-4 h-4" />
              <span>{t(locale, 'nav.createRoom')}</span>
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-noir-card text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-noir-border bg-obsidian-950 p-4 space-y-3 animate-fade-in text-right">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-noir-card hover:text-gold-400 transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-noir-border flex flex-col gap-2">
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
