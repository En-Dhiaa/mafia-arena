'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Shield, Users, Crown, Settings2, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RoleQuantitySelector } from '@/components/room/role-quantity-selector';
import { DEFAULT_ROLES } from '@/lib/constants/default-roles';
import { RoomSettings, LeaderMode } from '@/lib/types/game';

export default function CreateRoomPage() {
  const router = useRouter();
  const [hostName, setHostName] = useState('');
  const [minPlayers, setMinPlayers] = useState(4);
  const [maxPlayers, setMaxPlayers] = useState(12);
  const [leaderMode, setLeaderMode] = useState<LeaderMode>('SUPERVISOR');
  const [assignLeaderOnFirstElim, setAssignLeaderOnFirstElim] = useState(true);
  const [allowDocSelf, setAllowDocSelf] = useState(true);

  // Default initial role quantities
  const [roleQuantities, setRoleQuantities] = useState<Record<string, number>>({
    mafia_boss: 1,
    doctor: 1,
    detective: 1,
    citizen: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hostName.trim()) {
      setError('يرجى كتابة اسمك في اللعبة للمتابعة');
      return;
    }

    const enabledSlugs = Object.keys(roleQuantities).filter((slug) => (roleQuantities[slug] || 0) > 0);
    const totalRoles = Object.values(roleQuantities).reduce((acc, curr) => acc + (curr || 0), 0);

    if (totalRoles < minPlayers) {
      setError(`يرجى تحديد ما لا يقل عن ${minPlayers} بطاقات لتغطية عدد اللاعبين المطلوب (${totalRoles} محددة حالياً)`);
      return;
    }

    setIsLoading(true);

    try {
      const settings: Partial<RoomSettings> = {
        minPlayers,
        maxPlayers,
        leaderMode,
        assignLeaderOnFirstElimination: assignLeaderOnFirstElim,
        allowDoctorSelfProtect: allowDocSelf,
        enabledRoleSlugs: enabledSlugs.length > 0 ? enabledSlugs : DEFAULT_ROLES.map((r) => r.slug),
        roleQuantities,
      };

      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName: hostName.trim(), settings }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل في إنشاء الغرفة');
      }

      // Save credentials in local storage
      localStorage.setItem(`mafia_token_${data.code}`, data.guestToken);
      localStorage.setItem(`mafia_player_id_${data.code}`, data.playerId);
      localStorage.setItem('mafia_player_name', hostName.trim());

      router.push(`/room/${data.code}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في الاتصال');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 text-right">
      {/* Header */}
      <div className="space-y-3 mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-gold-300 text-xs font-bold shadow-sm">
          <PlusCircle className="w-4 h-4 text-amber-600 dark:text-gold-400" />
          <span>تأسيس غرفة جديدة</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-gold-300 font-display">
          إنشاء غرفة مباراة Mafia Arena
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
          خصص عدد وتوزيع البطاقات، وحدد إعدادات المباراة ثم شارك رمز الغرفة مع أصدقائك.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="space-y-6 sm:space-y-8 bg-white dark:bg-noir-card p-4 sm:p-8 rounded-3xl border border-slate-200 dark:border-noir-border shadow-xl transition-colors duration-300"
      >
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-500/50 text-red-700 dark:text-red-300 text-xs font-bold shadow-sm">
            {error}
          </div>
        )}

        {/* 1. Host Name */}
        <div className="space-y-2">
          <Input
            label="اسمك المستعار في المباراة (المضيف):"
            placeholder="مثال: العراب أو المحقق"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* 2. Player Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              الحد الأدنى للاعبين:
            </label>
            <select
              value={minPlayers}
              onChange={(e) => setMinPlayers(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-200 text-sm p-3 rounded-xl border border-slate-300 dark:border-noir-border focus:outline-none focus:border-amber-500 shadow-sm"
            >
              {[4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} لاعبين
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              الحد الأقصى للاعبين:
            </label>
            <select
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-200 text-sm p-3 rounded-xl border border-slate-300 dark:border-noir-border focus:outline-none focus:border-amber-500 shadow-sm"
            >
              {[6, 8, 10, 12, 16, 20].map((n) => (
                <option key={n} value={n}>
                  {n} لاعباً
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Role Quantity Selector with Tap / Long-press */}
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-noir-border">
          <label className="text-sm font-black text-slate-900 dark:text-gold-400 block flex items-center gap-1.5 justify-end">
            <span>تحديد أعداد وشخصيات البطاقات في المباراة:</span>
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-gold-400" />
          </label>

          <RoleQuantitySelector
            quantities={roleQuantities}
            onChange={setRoleQuantities}
            minPlayers={minPlayers}
            maxPlayers={maxPlayers}
          />
        </div>

        {/* 4. Special Toggles */}
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-noir-border text-xs">
          <label className="flex items-center gap-3 justify-end cursor-pointer select-none">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              ترقية أول لاعب مقصي ليكون قائداً ومديراً للمباراة (المشرف لا يعرف بطاقة أحد)
            </span>
            <input
              type="checkbox"
              checked={assignLeaderOnFirstElim}
              onChange={(e) => setAssignLeaderOnFirstElim(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
            />
          </label>

          <label className="flex items-center gap-3 justify-end cursor-pointer select-none">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              السماح للدكتور بحماية نفسه ليلاً
            </span>
            <input
              type="checkbox"
              checked={allowDocSelf}
              onChange={(e) => setAllowDocSelf(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
            />
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full text-base py-4 shadow-xl shadow-amber-500/20"
        >
          <span>تأسيس الغرفة والانتقال للردهة</span>
        </Button>
      </form>
    </div>
  );
}
