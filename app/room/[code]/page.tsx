'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Users,
  Copy,
  Check,
  Play,
  Moon,
  Sun,
  Crown,
  Mic,
  Vote,
  Shield,
  Skull,
  ArrowRight,
  LogOut,
  RefreshCw,
  Sparkles,
  Award,
  AlertCircle,
  Eye,
  Radio,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CharacterCard } from '@/components/cards/character-card';
import { PublicGameSnapshot, CharacterRole, RoomPlayer } from '@/lib/types/game';
import { sounds } from '@/lib/audio/sound-effects';

export default function RoomLivePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const code = resolvedParams.code.toUpperCase();

  const [snapshot, setSnapshot] = useState<PublicGameSnapshot | null>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<CharacterRole | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const [mafiaTeamMembers, setMafiaTeamMembers] = useState<
    Array<{ playerId: string; playerName: string }>
  >([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [votedTargetId, setVotedTargetId] = useState<string | null>(null);
  const [investigationResult, setInvestigationResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Initialize Credentials from LocalStorage
  useEffect(() => {
    const token = localStorage.getItem(`mafia_token_${code}`);
    const pId = localStorage.getItem(`mafia_player_id_${code}`);
    if (!token) {
      router.push('/room/join');
      return;
    }
    setGuestToken(token);
    setMyPlayerId(pId);
  }, [code, router]);

  // 2. Fetch Public Game Snapshot
  const fetchSnapshot = async () => {
    try {
      const res = await fetch(`/api/rooms/${code}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSnapshot(data.snapshot);
      }
    } catch {}
  };

  // 3. Fetch Secret Player Role (Only the player's own card!)
  const fetchMyRole = async (token: string) => {
    try {
      const res = await fetch('/api/game/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, guestToken: token }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMyRole(data.role);
        setIsLeader(data.isLeader);
        if (data.teamMembersIfMafia) setMafiaTeamMembers(data.teamMembersIfMafia);
      }
    } catch {}
  };

  useEffect(() => {
    if (!guestToken) return;
    fetchSnapshot();
    fetchMyRole(guestToken);

    const interval = setInterval(() => {
      fetchSnapshot();
      if (snapshot?.game.phase !== 'LOBBY' && !myRole) {
        fetchMyRole(guestToken);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [code, guestToken, snapshot?.game.phase]);

  // Trigger celebration on game over
  useEffect(() => {
    if (snapshot?.game.phase === 'GAME_OVER') {
      sounds.playVictory();
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [snapshot?.game.phase]);

  // Dynamic night mode class on body
  useEffect(() => {
    const isNight = snapshot?.game.phase.startsWith('NIGHT');
    if (isNight) {
      document.body.classList.add('in-game-night');
    } else {
      document.body.classList.remove('in-game-night');
    }
    return () => {
      document.body.classList.remove('in-game-night');
    };
  }, [snapshot?.game.phase]);

  // Copy Invite Link
  const copyInviteLink = () => {
    sounds.playClick();
    const url = `${window.location.origin}/room/join?code=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Start Game Action (Host only)
  const handleStartGame = async () => {
    if (!guestToken) return;
    try {
      sounds.playClick();
      const res = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, guestToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchSnapshot();
        fetchMyRole(guestToken);
      } else {
        setErrorMessage(data.error || 'تعذر بدء اللعبة');
      }
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : 'خطأ في الاتصال');
    }
  };

  // Advance Phase Action (Host or Game Leader)
  const handleAdvancePhase = async () => {
    if (!guestToken) return;
    try {
      sounds.playClick();
      const res = await fetch('/api/game/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, guestToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.nextPhase.startsWith('NIGHT')) sounds.playNightBell();
        else if (data.nextPhase.startsWith('DAY')) sounds.playDaySunrise();
        fetchSnapshot();
        fetchMyRole(guestToken);
        setActionSuccessMessage('');
        setVotedTargetId(null);
      }
    } catch {}
  };

  // Pass Speaker Turn Action
  const handlePassSpeaker = async () => {
    if (!guestToken) return;
    try {
      sounds.playClick();
      const res = await fetch('/api/game/speaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, guestToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchSnapshot();
      }
    } catch {}
  };

  // Submit Night Action
  const handleNightAction = async (targetPlayerId: string, actionType: 'kill' | 'protect' | 'investigate' | 'snipe' | 'silence') => {
    if (!guestToken) return;
    setIsActionSubmitting(true);
    try {
      sounds.playClick();
      const res = await fetch('/api/game/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          guestToken,
          action_type: actionType,
          target_player_id: targetPlayerId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMessage('تم اعتماد اختيارك السري في الخادم بنجاح!');
        if (actionType === 'investigate' && data.result) {
          setInvestigationResult(
            data.result.targetIsMafia
              ? 'نتيجة التحري: الهدف ينتمي لعصابة المافيا!'
              : 'نتيجة التحري: الهدف مواطن بريء ومخلص.'
          );
        }
      }
    } catch {} finally {
      setIsActionSubmitting(false);
    }
  };

  // Cast Vote
  const handleCastVote = async (targetPlayerId: string) => {
    if (!guestToken) return;
    try {
      sounds.playGavel();
      const res = await fetch('/api/game/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, guestToken, target_player_id: targetPlayerId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVotedTargetId(targetPlayerId);
      }
    } catch {}
  };

  if (!snapshot) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-amber-600 dark:text-gold-400 animate-spin" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">جاري الاتصال بالغرفة {code}...</p>
      </div>
    );
  }

  const myPlayer = snapshot.players.find((p) => p.id === myPlayerId);
  const isHost = myPlayer?.is_host ?? false;
  const isNightPhase = snapshot.game.phase.startsWith('NIGHT');
  const isVotingPhase = snapshot.game.phase === 'VOTING';
  const isDiscussionPhase = snapshot.game.phase === 'DISCUSSION';
  const isGameOver = snapshot.game.phase === 'GAME_OVER';
  const isLobby = snapshot.game.phase === 'LOBBY';

  const currentSpeaker = snapshot.players.find((p) => p.id === snapshot.currentSpeakerId);
  const isMySpeakerTurn = currentSpeaker?.id === myPlayerId;
  const otherLivingPlayers = snapshot.players.filter((p) => p.is_alive && p.id !== myPlayerId);

  return (
    <div
      className={`min-h-[92vh] flex flex-col transition-colors duration-500 ${
        isNightPhase ? 'bg-[#050508] text-slate-100' : 'bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-100'
      }`}
    >
      {/* ========================================================
          1. TOP APP BAR / ROOM STATUS
      ======================================================== */}
      <div className="sticky top-16 z-30 w-full border-b border-slate-200 dark:border-gold-500/20 bg-white/90 dark:bg-obsidian-950/90 backdrop-blur-md px-3 sm:px-4 py-2.5 flex items-center justify-between text-right shadow-sm">
        {/* Left: Leave / Share Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-red-500 p-1.5"
          >
            <LogOut className="w-4 h-4 ml-1" />
            <span className="hidden sm:inline">مغادرة</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={copyInviteLink}
            className="text-xs gap-1.5 px-2.5 py-1 font-mono font-bold"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'تم النسخ!' : code}</span>
          </Button>
        </div>

        {/* Right: Round & Phase Pill */}
        <div className="flex items-center gap-2">
          {isLeader && (
            <Badge variant="gold" className="gap-1 animate-pulse-subtle">
              <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
              <span>القائد</span>
            </Badge>
          )}

          {!isLobby && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                الجولة {snapshot.game.round_number}
              </span>
              <Badge
                variant={isNightPhase ? 'mafia' : isVotingPhase ? 'arbiter' : 'citizen'}
                className="gap-1 font-bold text-[11px]"
              >
                {isNightPhase ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                <span>
                  {snapshot.game.phase === 'ROLE_REVEAL'
                    ? 'كشف الأدوار'
                    : isNightPhase
                    ? 'الليل'
                    : isVotingPhase
                    ? 'التصويت'
                    : 'النقاش'}
                </span>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Error notification banner if any */}
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-950/80 border-b border-red-300 dark:border-red-500/50 p-2.5 text-center text-xs text-red-700 dark:text-red-300 font-bold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="font-bold mr-2">
            &times;
          </button>
        </div>
      )}

      {/* ========================================================
          2. VIEW A: LOBBY WAITING ROOM
      ======================================================== */}
      {isLobby ? (
        <div className="max-w-3xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-10 flex-1 flex flex-col justify-between text-right space-y-6 sm:space-y-8">
          {/* Lobby Hero & Room Code Box */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-gold-300 text-xs font-bold shadow-sm">
              <Users className="w-4 h-4 text-amber-600 dark:text-gold-400" />
              <span>ردهة الانتظار الجماعية</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-gold-300 font-display">
              غرفة المباراة: <span className="font-mono text-amber-600 dark:text-gold-400">{code}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs max-w-sm mx-auto">
              شارك رمز الغرفة أو الرابط مع أصدقائك للانضمام فوراً من هواتفهم.
            </p>

            <div className="flex items-center justify-center gap-3 pt-1">
              <Button size="md" variant="primary" onClick={copyInviteLink} className="gap-2 shadow-md">
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>نسخ رابط الدعوة المباشر</span>
              </Button>
            </div>
          </div>

          {/* Players Grid (Display names only! No secret roles shown!) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                الحد الأدنى: {snapshot.settings.minPlayers} لاعبين
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-gold-400 flex items-center gap-1.5 font-display">
                <span>اللاعبون المنضمون ({snapshot.players.length}/{snapshot.settings.maxPlayers}):</span>
                <Users className="w-4 h-4 text-amber-600 dark:text-gold-400" />
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {snapshot.players.map((player) => (
                <div
                  key={player.id}
                  className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-noir-card border border-slate-200 dark:border-noir-border shadow-sm flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {player.is_host && (
                      <Badge variant="gold" className="text-[10px] px-2 py-0.5">
                        <Crown className="w-3 h-3 ml-0.5" />
                        المشرف
                      </Badge>
                    )}
                    {player.id === myPlayerId && (
                      <Badge variant="outline" className="text-[10px]">
                        أنت
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{player.display_name}</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secrecy Assurance Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-obsidian-950 border border-amber-200 dark:border-noir-border text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 justify-end w-full">
              <span className="text-[11px] leading-relaxed">
                <strong>سرية تامة:</strong> التوزيع تلقائي عشوائي في الخادم. المشرف الرئيسي واللاعبون لا يعرفون بطاقات بعضهم نهائياً، بل يعرفون الأسماء المدخلة فقط.
              </span>
              <Lock className="w-5 h-5 text-amber-600 dark:text-gold-400 shrink-0" />
            </div>
          </div>

          {/* Host Start Game Button */}
          <div className="pt-2 sm:pt-4 border-t border-slate-200 dark:border-gold-500/20 text-center">
            {isHost ? (
              <Button
                size="lg"
                variant="primary"
                onClick={handleStartGame}
                disabled={snapshot.players.length < snapshot.settings.minPlayers}
                className="w-full sm:w-auto text-base px-10 py-4 gap-2 shadow-xl shadow-amber-500/20"
              >
                <Play className="w-5 h-5 ml-1" />
                <span>بدء المباراة وتوزيع البطاقات تلقائياً</span>
              </Button>
            ) : (
              <div className="p-4 rounded-2xl bg-white dark:bg-noir-card/60 border border-slate-200 dark:border-noir-border text-slate-600 dark:text-slate-400 text-xs font-semibold shadow-sm">
                في انتظار قيام المشرف ({snapshot.players.find((p) => p.is_host)?.display_name}) ببدء المباراة...
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================
            3. VIEW B: LIVE IN-GAME ARENA (Mobile-First Portrait)
        ======================================================== */
        <div className="max-w-lg mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 flex-1 flex flex-col justify-between space-y-4 sm:space-y-6 text-right">
          {/* Top Banner: Stage / Phase Management */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-noir-card/90 border border-slate-200 dark:border-gold-500/30 shadow-md flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {(isHost || isLeader) && (
                <Button size="sm" variant="primary" onClick={handleAdvancePhase} className="text-xs px-3 py-1.5 font-bold shadow-sm">
                  <span>المرحلة التالية</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <span className="font-bold text-slate-900 dark:text-gold-300 block">
                  {isNightPhase
                    ? 'الليل يسدل ستاره على المدينة'
                    : isVotingPhase
                    ? 'محكمة الشعب: حان وقت التصويت'
                    : 'شروق الشمس ونقاش المواطنين'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isNightPhase
                    ? 'نفذ دورك السري بحذر'
                    : isVotingPhase
                    ? 'صوتك يحدد مصير المتهم'
                    : 'استمع للمتحدث بدون مقاطعة'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-obsidian-950 border border-amber-200 dark:border-gold-500/30">
                {isNightPhase ? (
                  <Moon className="w-5 h-5 text-red-500 animate-pulse" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
          </div>

          {/* ================= CENTER: SECRET ROLE CARD ================= */}
          <div className="flex flex-col items-center justify-center py-1 sm:py-2 space-y-3">
            {myRole ? (
              <CharacterCard role={myRole} size="md" canFlip={true} className="max-w-[270px] sm:max-w-[300px] h-[360px] sm:h-[400px]" />
            ) : (
              <div className="w-64 h-80 rounded-2xl border-2 border-dashed border-slate-300 dark:border-noir-border flex flex-col items-center justify-center p-4 text-center text-slate-500 space-y-2">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
                <span className="text-xs font-bold">جاري سحب بطاقتك السرية من الخادم...</span>
              </div>
            )}

            {/* Secret Mafia Team Notification (Only fellow mafia members see each other's names!) */}
            {myRole?.team === 'mafia' && mafiaTeamMembers.length > 0 && (
              <div className="w-full p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-500/30 text-xs text-red-700 dark:text-red-300 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {mafiaTeamMembers.map((m) => (
                    <Badge key={m.playerId} variant="mafia" className="text-[10px]">
                      {m.playerName}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 font-bold">
                  <span>أعضاء عصابتك:</span>
                  <Skull className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>

          {/* ================= ACTION DRAWER / PANELS ================= */}

          {/* 1. NIGHT ACTIONS PANEL */}
          {isNightPhase && myPlayer?.is_alive && (
            <div className="p-4 rounded-3xl bg-white dark:bg-noir-card border border-slate-200 dark:border-gold-500/30 space-y-3 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-noir-border">
                <Badge team={myRole?.team} className="text-xs">
                  دورك الليلي: {myRole?.name}
                </Badge>
                <h4 className="text-xs font-bold text-slate-900 dark:text-gold-300 font-display">
                  الأفعال الليلية المتاحة لك
                </h4>
              </div>

              {actionSuccessMessage ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 text-xs text-center font-bold">
                  {actionSuccessMessage}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {myRole?.slug === 'doctor'
                      ? 'اختر لاعباً لحمايته من الاغتيال هذه الليلة:'
                      : myRole?.team === 'mafia'
                      ? 'اختر مواطناً تود المافيا تصفيته الليلة:'
                      : myRole?.slug === 'detective'
                      ? 'اختر مشتبهاً به لفحص هويته سراً:'
                      : myRole?.slug === 'sniper'
                      ? 'وجه بندقية القنص نحو مشتبه به:'
                      : myRole?.slug === 'silencer_mafia'
                      ? 'اختر لاعباً لإسكاته وتكميم فمه غداً:'
                      : 'أنت مواطن بريء... خلد إلى النوم بسلام وانتظر شروق الشمس!'}
                  </p>

                  {(myRole?.team === 'mafia' ||
                    myRole?.slug === 'doctor' ||
                    myRole?.slug === 'detective' ||
                    myRole?.slug === 'sniper') && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {otherLivingPlayers.map((target) => (
                        <button
                          key={target.id}
                          disabled={isActionSubmitting}
                          onClick={() => {
                            if (myRole?.slug === 'doctor') handleNightAction(target.id, 'protect');
                            else if (myRole?.slug === 'detective') handleNightAction(target.id, 'investigate');
                            else if (myRole?.slug === 'sniper') handleNightAction(target.id, 'snipe');
                            else handleNightAction(target.id, 'kill');
                          }}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-950 hover:bg-amber-50 dark:hover:bg-gold-500/10 border border-slate-200 dark:border-noir-border hover:border-amber-400 text-xs text-slate-900 dark:text-slate-200 font-bold transition text-right flex items-center justify-between shadow-sm active:scale-95"
                        >
                          <span className="text-[10px] text-slate-500">اختيار</span>
                          <span className="truncate">{target.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Detective Secret Verdict Display */}
              {investigationResult && (
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-500/50 text-purple-900 dark:text-purple-200 text-xs font-bold text-center">
                  {investigationResult}
                </div>
              )}
            </div>
          )}

          {/* 2. DISCUSSION & SPEAKER TURN PANEL */}
          {isDiscussionPhase && (
            <div className="p-4 rounded-3xl bg-white dark:bg-noir-card border border-slate-200 dark:border-gold-500/30 space-y-4 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between">
                {isMySpeakerTurn ? (
                  <Badge variant="gold" className="text-xs animate-pulse">
                    <Radio className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400 ml-1" />
                    الميكروفون معك الآن!
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    مستمع
                  </Badge>
                )}
                <span className="text-xs font-bold text-slate-900 dark:text-gold-300 font-display">
                  نظام تسليم الكلام
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-noir-border text-center space-y-2">
                <Mic
                  className={`w-10 h-10 mx-auto transition-transform ${
                    isMySpeakerTurn ? 'text-amber-500 dark:text-gold-400 animate-bounce' : 'text-slate-400'
                  }`}
                />
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">المتحدث الحالي:</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-gold-300 font-display">
                    {currentSpeaker ? currentSpeaker.display_name : 'الجميع صامت'}
                  </span>
                </div>
                {isMySpeakerTurn && (
                  <p className="text-xs text-amber-800 dark:text-gold-300/90 font-bold">
                    تحدث بوضوح وشارك شكوكك مع رفاقك، وعند انتهائك اضغط الزر أدناه لتسليم الدور.
                  </p>
                )}
              </div>

              {(isMySpeakerTurn || isHost || isLeader) && (
                <Button size="md" variant="primary" onClick={handlePassSpeaker} className="w-full py-3.5 text-sm gap-2 shadow-md">
                  <span>تسليم الدور للمتحدث التالي</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {/* 3. VOTING BALLOT PANEL */}
          {isVotingPhase && myPlayer?.is_alive && (
            <div className="p-4 rounded-3xl bg-white dark:bg-noir-card border border-slate-200 dark:border-gold-500/30 space-y-3 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-noir-border">
                <Badge variant="arbiter" className="text-xs">
                  {myRole?.slug === 'mayor' ? 'أنت العمدة (صوتك يزن 3 أصوات!)' : 'صوت واحد'}
                </Badge>
                <h4 className="text-xs font-bold text-slate-900 dark:text-gold-300 font-display">
                  صندوق اقتراع الإقصاء النهاري
                </h4>
              </div>

              {votedTargetId ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center">
                  تم تسجيل صوتك وقفل بطاقتك بنجاح! في انتظار اكتمال بقية الأصوات...
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    اختر المشتبه به الذي ترى ضرورة إقصائه اليوم لحماية المدينة:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {otherLivingPlayers.map((target) => (
                      <button
                        key={target.id}
                        onClick={() => handleCastVote(target.id)}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-950 hover:bg-red-50 dark:hover:bg-red-500/20 border border-slate-200 dark:border-noir-border hover:border-red-400 text-xs text-slate-900 dark:text-slate-200 font-bold transition text-right flex items-center justify-between shadow-sm active:scale-95"
                      >
                        <Vote className="w-3.5 h-3.5 text-red-500" />
                        <span className="truncate">{target.display_name}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => handleCastVote('abstain')}
                      className="col-span-2 p-3 rounded-2xl bg-slate-100 dark:bg-obsidian-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-noir-border text-xs text-slate-600 dark:text-slate-400 font-bold transition text-center active:scale-95"
                    >
                      الامتناع عن التصويت
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= BOTTOM: LIVING PLAYERS TRAY ================= */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-gold-500/20">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block text-right">
              حالة اللاعبين في المباراة:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {snapshot.players.map((p) => {
                const isCurrent = p.id === snapshot.currentSpeakerId;
                const isDead = !p.is_alive;
                return (
                  <div
                    key={p.id}
                    className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition ${
                      isCurrent
                        ? 'bg-amber-100 dark:bg-gold-500/20 border-amber-500 dark:border-gold-400 text-amber-900 dark:text-gold-300 font-bold shadow-md scale-105'
                        : isDead
                        ? 'bg-slate-100 dark:bg-obsidian-950/40 border-slate-200 dark:border-noir-border text-slate-400 line-through opacity-60'
                        : 'bg-white dark:bg-noir-card border-slate-200 dark:border-noir-border text-slate-800 dark:text-slate-300 shadow-sm'
                    }`}
                  >
                    {isCurrent && <Mic className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400 animate-pulse" />}
                    <span className="font-semibold">{p.display_name}</span>
                    {isDead && <span className="text-[10px] text-red-500 font-bold">(مقصي)</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. MODAL: GAME OVER & VICTORY SCREEN
      ======================================================== */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-right">
          <div className="w-full max-w-lg bg-white dark:bg-noir-card border-2 border-amber-500 dark:border-gold-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <Award className="w-16 h-16 text-amber-500 dark:text-gold-400 mx-auto animate-bounce" />

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-gold-500 font-mono font-bold">
                VICTORY DECLARED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-gold-300 dark:via-gold-400 dark:to-amber-500 font-display">
                {snapshot.game.winner_team === 'mafia'
                  ? 'انتصرت عصابة المافيا!'
                  : 'انتصر المواطنون الشرفاء!'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {snapshot.game.winner_team === 'mafia'
                  ? 'فرضت المافيا قبضتها الحديدية على المدينة وسقطت دفاعات المواطنين.'
                  : 'تمت إبادة عناصر المافيا وتطهير شوارع المدينة ليعود الأمان لأهلها.'}
              </p>
            </div>

            {/* Play Again CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push('/room/create')}
                className="w-full sm:w-auto px-6 py-3 font-bold"
              >
                إنشاء مباراة جديدة
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push('/')}
                className="w-full sm:w-auto px-6 py-3"
              >
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
