'use client';

import React from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Sparkles, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminAssetsPage() {
  const assets = [
    { name: 'شعار Mafia Arena الرسمي', path: '/images/logo.png', type: 'شعار الهوية' },
    { name: 'ظهر البطاقة الفاخر (Card Back)', path: '/images/cards/card-back.png', type: 'بطاقة' },
    { name: 'خلفية الليل (Night Noir)', path: '/images/backgrounds/night-bg.png', type: 'خلفية سينمائية' },
    { name: 'خلفية النهار (Day Atmosphere)', path: '/images/backgrounds/day-bg.png', type: 'خلفية سينمائية' },
    { name: 'خلفية الردهة (Lobby Lounge)', path: '/images/backgrounds/lobby-bg.png', type: 'خلفية سينمائية' },
    { name: 'زعيم المافيا (Godfather)', path: '/images/cards/mafia_boss.png', type: 'بطاقة أصلية' },
    { name: 'عضو المافيا (Mobster)', path: '/images/cards/mafia.png', type: 'بطاقة أصلية' },
    { name: 'مافيا التسكيت (The Silencer)', path: '/images/cards/silencer_mafia.png', type: 'بطاقة أصلية' },
    { name: 'الدكتور (The Medic)', path: '/images/cards/doctor.png', type: 'بطاقة أصلية' },
    { name: 'المحقق (The Detective)', path: '/images/cards/detective.png', type: 'بطاقة أصلية' },
    { name: 'القناص (The Sniper)', path: '/images/cards/sniper.png', type: 'بطاقة أصلية' },
    { name: 'المواطن الشاب (The Young Rebel)', path: '/images/cards/young_citizen.png', type: 'بطاقة أصلية' },
    { name: 'العمدة (The Mayor)', path: '/images/cards/mayor.png', type: 'بطاقة أصلية' },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="pb-6 border-b border-noir-border">
        <h1 className="text-2xl font-bold text-gold-300 font-display">
          مكتبة الأصول الفنية والخلفيات
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          استعراض جميع الأصول البصرية والخلفيات والشعارات المرخصة والمولدة بالذكاء الاصطناعي بنمط النوار الفاخر.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {assets.map((asset, i) => (
          <div
            key={i}
            className="p-3.5 rounded-2xl bg-noir-card border border-noir-border space-y-3 flex flex-col justify-between"
          >
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-obsidian-950 border border-noir-border">
              <Image src={asset.path} alt={asset.name} fill className="object-cover" />
            </div>

            <div className="space-y-1">
              <Badge variant="gold" className="text-[10px]">
                {asset.type}
              </Badge>
              <h4 className="text-xs font-bold text-slate-200 block truncate">{asset.name}</h4>
              <span className="text-[10px] text-slate-500 font-mono block truncate">
                {asset.path}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

