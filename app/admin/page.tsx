'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Gamepad2,
  Layers,
  ShieldCheck,
  Activity,
  ArrowLeft,
  Server,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEFAULT_ROLES } from '@/lib/constants/default-roles';

export default function AdminDashboardPage() {
  const [activeRooms, setActiveRooms] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        if (data.rooms) setActiveRooms(data.rooms);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const stats = [
    {
      title: 'الغرف النشطة حالياً',
      val: activeRooms.length,
      icon: Gamepad2,
      color: 'text-amber-400',
    },
    {
      title: 'أوراق وشخصيات اللعبة',
      val: DEFAULT_ROLES.length,
      icon: Layers,
      color: 'text-gold-400',
    },
    {
      title: 'حالة الخادم والمزامنة',
      val: 'متصل 100%',
      icon: Server,
      color: 'text-emerald-400',
    },
    {
      title: 'الأمان وحماية الأدوار',
      val: 'مشفر RLS',
      icon: ShieldCheck,
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-noir-border">
        <div>
          <h1 className="text-2xl font-bold text-gold-300 font-display">
            لوحة القيادة الإحصائية ومراقبة النظام
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            متابعة فورية للمباريات المفتوحة، اللاعبين، وحالة الخادم وأمان قواعد اللعبة.
          </p>
        </div>
        <Link href="/admin/characters">
          <Button size="sm" variant="primary" className="gap-2">
            <span>تخصيص البطاقات والشخصيات</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-noir-card border border-noir-border space-y-2 text-right"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-slate-100 font-display">{st.val}</span>
              <div className={`p-2 rounded-xl bg-obsidian-950 border border-noir-border ${st.color}`}>
                <st.icon className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium block">{st.title}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rooms Monitor Box */}
        <div className="p-6 rounded-2xl bg-noir-card border border-noir-border space-y-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/rooms" className="text-xs text-gold-400 hover:underline">
              عرض كافة الغرف
            </Link>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span>المباريات الجارية الآن</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </h3>
          </div>

          {activeRooms.length === 0 ? (
            <div className="p-8 rounded-xl bg-obsidian-950/60 border border-dashed border-noir-border text-center text-xs text-slate-500">
              لا توجد غرف نشطة حالياً. يمكنك تجربة إنشاء غرفة من الواجهة الرئيسية.
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeRooms.slice(0, 5).map((r: any) => (
                <div
                  key={r.code}
                  className="p-3 rounded-xl bg-obsidian-950 border border-noir-border flex items-center justify-between text-xs"
                >
                  <Link href={`/room/${r.code}`} className="text-gold-400 font-bold hover:underline">
                    دخول الغرفة &larr;
                  </Link>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{r.playerCount} لاعبين</span>
                    <span className="font-mono font-bold text-slate-200">{r.code}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security & System Info */}
        <div className="p-6 rounded-2xl bg-noir-card border border-noir-border space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 justify-end">
            <span>سياسات الأمان والحماية النشطة</span>
            <ShieldCheck className="w-4 h-4 text-gold-400" />
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="p-3 rounded-xl bg-obsidian-950 border border-noir-border flex items-center justify-between">
              <span className="text-emerald-400 font-bold">مُفعل</span>
              <span>حماية سرية الأدوار: العميل لا يستعلم إلا دوره المخصص</span>
            </li>
            <li className="p-3 rounded-xl bg-obsidian-950 border border-noir-border flex items-center justify-between">
              <span className="text-emerald-400 font-bold">مُفعل</span>
              <span>تحقق الخادم الذري: منع تكرار توزيع الأدوار وبدء المباراة</span>
            </li>
            <li className="p-3 rounded-xl bg-obsidian-950 border border-noir-border flex items-center justify-between">
              <span className="text-emerald-400 font-bold">مُفعل</span>
              <span>حساب الفوز المركزي: التحقق بعد كل إقصاء وحل ليلة</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

