'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-950 py-10 sm:py-12 text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-right">
          {/* Col 1: About Mafia Arena */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3 justify-end">
              <div className="text-right">
                <span className="text-base font-extrabold tracking-wider text-slate-900 dark:text-gold-400 font-display">
                  MAFIA ARENA
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 font-bold">مافيا أرينا</span>
              </div>
              <div className="relative w-8 h-8 rounded-full border border-amber-500/40 dark:border-gold-500/40 overflow-hidden shadow-sm">
                <Image src="/images/logo.png" alt="Logo" fill className="object-cover" />
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md ml-auto">
              لعبة استنتاج اجتماعي جماعية وتحدي فكري باللغتين العربية والإنجليزية. صممت خصيصاً لتناسب شاشات الهواتف بوضع Portrait وتعمل مباشرة عبر المتصفح بمزامنة فورية ودون الحاجة لتثبيت أي تطبيق.
            </p>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-gold-300">
              روابط سريعة
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-600 dark:hover:text-gold-400 transition">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/how-to-play" className="hover:text-amber-600 dark:hover:text-gold-400 transition">
                  شرح طريقة اللعب
                </Link>
              </li>
              <li>
                <Link href="/cards" className="hover:text-amber-600 dark:hover:text-gold-400 transition">
                  كتالوج أوراق اللعب
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-amber-600 dark:hover:text-gold-400 transition">
                  قواعد اللعبة التفصيلية
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Game Rooms & Admin */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-gold-300">
              المباريات والإدارة
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/room/create" className="hover:text-amber-600 dark:hover:text-gold-400 transition">
                  إنشاء غرفة جديدة
                </Link>
              </li>
              <li>
                <Link href="/room/join" className="hover:text-amber-600 dark:hover:text-gold-400 transition">
                  الانضمام لغرفة
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-600 dark:hover:text-gold-400 transition text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-end font-bold">
                  <span>لوحة الإدارة</span>
                  <Shield className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 border-t border-slate-200 dark:border-noir-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-gold-500" />
            <span>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} Mafia Arena.</span>
          </div>
          <div>
            <span>Developed by En-Dhiaa &bull; Mobile & Light Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
