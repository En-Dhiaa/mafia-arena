'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function JoinRoomPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanCode = code.trim().toUpperCase();
    const cleanName = playerName.trim();

    if (!cleanCode || cleanCode.length < 4) {
      setError('يرجى إدخال رمز الغرفة المكون من 6 رموز');
      return;
    }
    if (!cleanName) {
      setError('يرجى إدخال اسمك في اللعبة');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/rooms/${cleanCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: cleanName }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر الانضمام إلى الغرفة');
      }

      // Save credentials in local storage
      localStorage.setItem(`mafia_token_${cleanCode}`, data.guestToken);
      localStorage.setItem(`mafia_player_id_${cleanCode}`, data.playerId);
      localStorage.setItem('mafia_player_name', cleanName);

      router.push(`/room/${cleanCode}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في الاتصال');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-right">
      <div className="space-y-4 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Users className="w-4 h-4" />
          <span>الدخول إلى مباراة سريعة</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gold-300 font-display">
          الانضمام إلى غرفة Mafia Arena
        </h1>
        <p className="text-slate-400 text-xs max-w-xs mx-auto">
          أدخل رمز الغرفة واسمك المستعار للدخول مباشرة إلى الردهة.
        </p>
      </div>

      <form
        onSubmit={handleJoin}
        className="space-y-6 bg-noir-card p-6 sm:p-8 rounded-2xl border border-noir-border shadow-2xl"
      >
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Input
            label="رمز الغرفة (Room Code):"
            placeholder="مثال: X7K9Q2"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={8}
            className="text-center font-mono text-xl tracking-widest font-black uppercase"
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Input
            label="اسمك في اللعبة:"
            placeholder="مثال: المحقق الذكي"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full text-base py-3.5 gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>دخول الغرفة والردهة</span>
        </Button>
      </form>
    </div>
  );
}
