'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Layers,
  Settings,
  Image as ImageIcon,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'لوحة القيادة الإحصائية', icon: LayoutDashboard },
    { href: '/admin/characters', label: 'إدارة أوراق اللعب والشخصيات', icon: Layers },
    { href: '/admin/rooms', label: 'مراقبة الغرف النشطة', icon: Users },
    { href: '/admin/assets', label: 'مكتبة الأصول والخلفيات', icon: ImageIcon },
    { href: '/admin/settings', label: 'إعدادات وقواعد اللعبة', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col md:flex-row text-right">
      {/* Sidebar for Desktop / Header for Mobile */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-l border-gold-500/20 bg-noir-card/90 p-4 space-y-6 shrink-0">
        <div className="flex items-center gap-2 justify-end pb-4 border-b border-noir-border">
          <div>
            <h2 className="text-base font-extrabold text-gold-400 font-display">
              إدارة MAFIA ARENA
            </h2>
            <span className="text-[10px] text-slate-400">لوحة التحكم المركزية</span>
          </div>
          <div className="p-2 rounded-xl bg-obsidian-950 border border-gold-500/30 text-gold-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition justify-end',
                  isActive
                    ? 'bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-950'
                )}
              >
                <span>{link.label}</span>
                <link.icon className="w-4 h-4 shrink-0" />
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-noir-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-gold-400 transition justify-end"
          >
            <span>العودة لموقع اللعبة</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

