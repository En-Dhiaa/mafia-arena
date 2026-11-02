'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Shield, Users, Crown, Settings2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    DEFAULT_ROLES.map((r) => r.slug)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSlug = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      if (selectedSlugs.length > 4) {
        setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
      }
    } else {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hostName.trim()) {
      setError('يرجى كتابة اسمك في اللعبة للمتابعة');
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
        enabledRoleSlugs: selectedSlugs,
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right">
      <div className="space-y-4 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <PlusCircle className="w-4 h-4" />
          <span>تأسيس غرفة جديدة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gold-300 font-display">
          إنشاء غرفة مباراة Mafia Arena
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          خصص قواعد المباراة واختر البطاقات المسموحة ثم شارك رمز الغرفة مع أصدقائك.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-8 bg-noir-card p-6 sm:p-8 rounded-2xl border border-noir-border shadow-2xl">
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* 1. Host Name */}
        <div className="space-y-2">
          <Input
            label="اسمك في اللعبة (المضيف):"
            placeholder="مثال: العراب أو القائد"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* 2. Player Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-300">
              الحد الأدنى للاعبين:
            </label>
            <select
              value={minPlayers}
              onChange={(e) => setMinPlayers(Number(e.target.value))}
              className="w-full bg-obsidian-950 text-slate-200 text-sm p-3 rounded-lg border border-noir-border focus:outline-none focus:border-gold-500"
            >
              {[4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} لاعبين
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-300">
              الحد الأقصى للاعبين:
            </label>
            <select
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="w-full bg-obsidian-950 text-slate-200 text-sm p-3 rounded-lg border border-noir-border focus:outline-none focus:border-gold-500"
            >
              {[6, 8, 10, 12, 16, 20].map((n) => (
                <option key={n} value={n}>
                  {n} لاعباً
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Leader Mode */}
        <div className="space-y-3 pt-2 border-t border-noir-border">
          <label className="text-xs font-bold text-gold-400 block flex items-center gap-1.5 justify-end">
            <span>نمط قائد ومدير اللعبة (Game Master):</span>
            <Crown className="w-4 h-4 text-gold-400" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setLeaderMode('SUPERVISOR')}
              className={`p-4 rounded-xl border cursor-pointer transition select-none ${
                leaderMode === 'SUPERVISOR'
                  ? 'bg-gold-500/10 border-gold-500 text-gold-300'
                  : 'bg-obsidian-950 border-noir-border text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="font-bold text-xs mb-1">مشرف منظم (موصى به)</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                اللاعبون ينفذون أفعالهم سراً، والقائد يشرف ويعتمد النتائج وينظم المراحل.
              </p>
            </div>

            <div
              onClick={() => setLeaderMode('CONTROLLER')}
              className={`p-4 rounded-xl border cursor-pointer transition select-none ${
                leaderMode === 'CONTROLLER'
                  ? 'bg-gold-500/10 border-gold-500 text-gold-300'
                  : 'bg-obsidian-950 border-noir-border text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="font-bold text-xs mb-1">متحكم كامل</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                القائد يدير جميع أفعال الليل مباشرة ويحدد النتائج بقراراته.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Special Toggles */}
        <div className="space-y-3 pt-2 border-t border-noir-border text-xs">
          <label className="flex items-center gap-3 justify-end cursor-pointer select-none">
            <span className="text-slate-300">
              ترقية أول لاعب يتم إقصاؤه ليصبح قائد المباراة تلقائياً
            </span>
            <input
              type="checkbox"
              checked={assignLeaderOnFirstElim}
              onChange={(e) => setAssignLeaderOnFirstElim(e.target.checked)}
              className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400 bg-obsidian-950 border-noir-border"
            />
          </label>

          <label className="flex items-center gap-3 justify-end cursor-pointer select-none">
            <span className="text-slate-300">
              السماح للدكتور بحماية نفسه ليلاً
            </span>
            <input
              type="checkbox"
              checked={allowDocSelf}
              onChange={(e) => setAllowDocSelf(e.target.checked)}
              className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400 bg-obsidian-950 border-noir-border"
            />
          </label>
        </div>

        {/* 5. Role Selection */}
        <div className="space-y-3 pt-2 border-t border-noir-border">
          <label className="text-xs font-bold text-gold-400 block flex items-center gap-1.5 justify-end">
            <span>البطاقات المفعلة في هذه المباراة:</span>
            <Sparkles className="w-4 h-4 text-gold-400" />
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {DEFAULT_ROLES.map((role) => {
              const isSelected = selectedSlugs.includes(role.slug);
              return (
                <div
                  key={role.slug}
                  onClick={() => toggleSlug(role.slug)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer select-none transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-obsidian-950 border-gold-500/60 text-gold-300 shadow-sm'
                      : 'bg-obsidian-950/40 border-noir-border text-slate-500 hover:border-slate-600'
                  }`}
                >
                  <span className="text-[10px] text-slate-400">{role.team}</span>
                  <span className="font-bold">{role.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full text-base py-4 shadow-xl shadow-gold-500/25"
        >
          <span>تأسيس الغرفة والدخول للردهة</span>
        </Button>
      </form>
    </div>
  );
}
