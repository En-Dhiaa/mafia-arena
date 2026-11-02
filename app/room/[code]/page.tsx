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
  const [allRolesIfLeader, setAllRolesIfLeader] = useState<
    Array<{ playerId: string; playerName: string; role: CharacterRole }>
  >([]);
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

  // 2. Fetch Public Game Snapshot on mount and periodically (Live Realtime sync)
  const fetchSnapshot = async () => {
    try {
      const res = await fetch(`/api/rooms/${code}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSnapshot(data.snapshot);
      }
    } catch {}
  };

  // 3. Fetch Secret Player Role (Protected Server Route)
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
        if (data.allRolesIfLeader) setAllRolesIfLeader(data.allRolesIfLeader);
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
        setActionSuccessMessage('تم اعتماد فعلك الليلي السري بنجاح!');
        if (actionType === 'investigate' && data.result) {
          setInvestigationResult(
            data.result.targetIsMafia
              ? 'تحذير قاطع: الهدف ينتمي لعصابة المافيا!'
              : 'تقرير المحقق: الهدف مواطن بريء ومخلص.'
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
        <RefreshCw className="w-8 h-8 text-gold-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-300">جاري الاتصال بالغرفة {code}...</p>
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
      className={`min-h-screen flex flex-col transition-colors duration-700 ${
        isNightPhase ? 'bg-[#050508]' : 'bg-obsidian-950'
      }`}
    >
      {/* ========================================================
          1. TOP APP BAR / ROOM STATUS
      ======================================================== */}
      <div className="sticky top-16 z-30 w-full border-b border-gold-500/20 bg-obsidian-950/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between text-right">
        {/* Left: Leave / Share Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-xs text-slate-400 hover:text-red-400 p-1.5"
          >
            <LogOut className="w-4 h-4 ml-1" />
            <span>مغادرة</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={copyInviteLink}
            className="text-xs gap-1.5 px-3 py-1"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'تم النسخ!' : code}</span>
          </Button>
        </div>

        {/* Right: Round & Phase Pill */}
        <div className="flex items-center gap-2">
          {isLeader && (
            <Badge variant="gold" className="gap-1 animate-pulse-subtle">
              <Crown className="w-3.5 h-3.5 text-gold-400" />
              <span>القائد</span>
            </Badge>
          )}

          {!isLobby && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-300">
                الجولة {snapshot.game.round_number}
              </span>
              <Badge
                variant={isNightPhase ? 'mafia' : isVotingPhase ? 'arbiter' : 'citizen'}
                className="gap-1.5 font-bold"
              >
                {isNightPhase ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                <span>
                  {snapshot.game.phase === 'ROLE_REVEAL'
                    ? 'كشف الأدوار'
                    : isNightPhase
                    ? 'مرحلة الليل'
                    : isVotingPhase
                    ? 'التصويت النهاري'
                    : 'النقاش النهاري'}
                </span>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Error notification banner if any */}
      {errorMessage && (
        <div className="bg-red-950/80 border-b border-red-500/50 p-2.5 text-center text-xs text-red-300 font-semibold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="text-white font-bold mr-2">
            &times;
          </button>
        </div>
      )}

      {/* ========================================================
          2. VIEW A: LOBBY WAITING ROOM
      ======================================================== */}
      {isLobby ? (
        <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-between text-right space-y-8">
          {/* Lobby Hero & Room Code Box */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
              <Users className="w-4 h-4" />
              <span>ردهة الانتظار الجماعية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gold-300 font-display">
              غرفة المباراة: <span className="font-mono text-gold-400">{code}</span>
            </h1>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              شارك رمز الغرفة أو الرابط مع أصدقائك للانضمام فوراً من أي متصفح.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button size="md" variant="primary" onClick={copyInviteLink} className="gap-2">
                {copiedLink ? <Check className="w-4 h-4 text-obsidian-950" /> : <Copy className="w-4 h-4" />}
                <span>نسخ رابط الدعوة المباشر</span>
              </Button>
            </div>
          </div>

          {/* Players Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                الحد الأدنى للبدء: {snapshot.settings.minPlayers} لاعبين
              </span>
              <h3 className="text-sm font-bold text-gold-400 flex items-center gap-1.5 font-display">
                <span>اللاعبون المنضمون ({snapshot.players.length}/{snapshot.settings.maxPlayers}):</span>
                <Users className="w-4 h-4 text-gold-400" />
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {snapshot.players.map((player) => (
                <div
                  key={player.id}
                  className="p-3.5 rounded-xl bg-noir-card border border-noir-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    {player.is_host && (
                      <Badge variant="gold" className="text-[10px] px-2 py-0.5">
                        <Crown className="w-3 h-3 ml-0.5" />
                        المضيف
                      </Badge>
                    )}
                    {player.id === myPlayerId && (
                      <Badge variant="outline" className="text-[10px]">
                        أنت
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-200">{player.display_name}</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Match Settings Info Box */}
          <div className="p-4 rounded-xl bg-obsidian-950 border border-noir-border text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span>نمط القائد: </span>
              <strong className="text-slate-200">
                {snapshot.settings.leaderMode === 'SUPERVISOR' ? 'مشرف منظم' : 'متحكم كامل'}
              </strong>
            </div>
            <div>
              <span>أول مقصي يصبح قائداً: </span>
              <strong className="text-slate-200">
                {snapshot.settings.assignLeaderOnFirstElimination ? 'نعم' : 'لا'}
              </strong>
            </div>
            <div>
              <span>البطاقات المفعلة: </span>
              <strong className="text-gold-400">{snapshot.settings.enabledRoleSlugs.length} بطاقة</strong>
            </div>
          </div>

          {/* Host Start Game Button */}
          <div className="pt-4 border-t border-gold-500/20 text-center">
            {isHost ? (
              <Button
                size="lg"
                variant="primary"
                onClick={handleStartGame}
                disabled={snapshot.players.length < snapshot.settings.minPlayers}
                className="w-full sm:w-auto text-base px-10 py-4 gap-2 shadow-xl shadow-gold-500/25"
              >
                <Play className="w-5 h-5 ml-1" />
                <span>بدء المباراة وتوزيع البطاقات السرية</span>
              </Button>
            ) : (
              <div className="p-4 rounded-xl bg-noir-card/60 border border-noir-border text-slate-400 text-xs">
                في انتظار قيام المضيف ({snapshot.players.find((p) => p.is_host)?.display_name}) ببدء المباراة...
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================
            3. VIEW B: LIVE IN-GAME ARENA (Mobile-First Portrait)
        ======================================================== */
        <div className="max-w-2xl mx-auto w-full px-4 py-6 flex-1 flex flex-col justify-between space-y-6 text-right">
          {/* Top Banner: Atmosphere & Phase Details */}
          <div className="p-3.5 rounded-2xl bg-noir-card/90 border border-gold-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {(isHost || isLeader) && (
                <Button size="sm" variant="outline" onClick={handleAdvancePhase} className="text-xs px-2.5 py-1">
                  <span>الانتقال للمرحلة التالية</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <span className="font-bold text-gold-300 block">
                  {isNightPhase
                    ? 'الليل يسدل ستاره على المدينة'
                    : isVotingPhase
                    ? 'محكمة الشعب: حان وقت التصويت'
                    : 'شروق الشمس ونقاش المواطنين'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isNightPhase
                    ? 'نفذ دورك السري بحذر'
                    : isVotingPhase
                    ? 'صوتك يحدد مصير المتهم'
                    : 'استمع للمتحدث بدون مقاطعة'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-obsidian-950 border border-gold-500/30">
                {isNightPhase ? (
                  <Moon className="w-5 h-5 text-red-400 animate-pulse" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
              </div>
            </div>
          </div>

          {/* ================= CENTER: SECRET ROLE CARD ================= */}
          <div className="flex flex-col items-center justify-center py-2 space-y-3">
            {myRole ? (
              <CharacterCard role={myRole} size="md" canFlip={true} />
            ) : (
              <div className="w-64 h-96 rounded-2xl border-2 border-dashed border-noir-border flex flex-col items-center justify-center p-4 text-center text-slate-500 space-y-2">
                <RefreshCw className="w-8 h-8 animate-spin text-gold-400" />
                <span className="text-xs">جاري سحب بطاقتك السرية من الخادم...</span>
              </div>
            )}

            {/* Secret Mafia Team Notification */}
            {myRole?.team === 'mafia' && mafiaTeamMembers.length > 0 && (
              <div className="w-full p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
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
            <div className="p-4 rounded-2xl bg-noir-card border border-gold-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-noir-border">
                <Badge team={myRole?.team} className="text-xs">
                  دورك الليلي: {myRole?.name}
                </Badge>
                <h4 className="text-xs font-bold text-gold-300 font-display">
                  الأفعال الليلية المتاحة لك
                </h4>
              </div>

              {actionSuccessMessage ? (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs text-center font-bold">
                  {actionSuccessMessage}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-300">
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
                      : 'أنت مواطن بريء... خلد إلى النوم بسلام وانتظر الصباح!'}
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
                          className="p-2.5 rounded-xl bg-obsidian-950 hover:bg-gold-500/10 border border-noir-border hover:border-gold-500/50 text-xs text-slate-200 font-bold transition text-right flex items-center justify-between"
                        >
                          <span className="text-[10px] text-slate-400">تنفيذ</span>
                          <span>{target.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Detective Secret Verdict Display */}
              {investigationResult && (
                <div className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/50 text-purple-200 text-xs font-bold text-center">
                  {investigationResult}
                </div>
              )}
            </div>
          )}

          {/* 2. DISCUSSION & SPEAKER TURN PANEL */}
          {isDiscussionPhase && (
            <div className="p-4 rounded-2xl bg-noir-card border border-gold-500/30 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                {isMySpeakerTurn ? (
                  <Badge variant="gold" className="text-xs animate-pulse">
                    <Radio className="w-3.5 h-3.5 text-gold-400 ml-1" />
                    الميكروفون معك الآن!
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    مستمع
                  </Badge>
                )}
                <span className="text-xs font-bold text-gold-300 font-display">
                  نظام تسليم الكلام
                </span>
              </div>

              <div className="p-4 rounded-xl bg-obsidian-950 border border-noir-border text-center space-y-2">
                <Mic
                  className={`w-10 h-10 mx-auto transition-transform ${
                    isMySpeakerTurn ? 'text-gold-400 animate-bounce' : 'text-slate-600'
                  }`}
                />
                <div>
                  <span className="text-xs text-slate-400 block">المتحدث الحالي:</span>
                  <span className="text-base font-extrabold text-gold-300 font-display">
                    {currentSpeaker ? currentSpeaker.display_name : 'الجميع صامت'}
                  </span>
                </div>
                {isMySpeakerTurn && (
                  <p className="text-xs text-gold-300/90 font-medium">
                    تحدث بوضوح وشارك شكوكك مع رفاقك، وعند انتهائك اضغط الزر أدناه لتسليم الدور.
                  </p>
                )}
              </div>

              {(isMySpeakerTurn || isHost || isLeader) && (
                <Button size="md" variant="primary" onClick={handlePassSpeaker} className="w-full py-3 text-sm gap-2">
                  <span>تسليم الدور للمتحدث التالي</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {/* 3. VOTING BALLOT PANEL */}
          {isVotingPhase && myPlayer?.is_alive && (
            <div className="p-4 rounded-2xl bg-noir-card border border-gold-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-noir-border">
                <Badge variant="arbiter" className="text-xs">
                  {myRole?.slug === 'mayor' ? 'أنت العمدة (صوتك يزن 3 أصوات!)' : 'صوت واحد'}
                </Badge>
                <h4 className="text-xs font-bold text-gold-300 font-display">
                  صندوق اقتراع الإقصاء النهاري
                </h4>
              </div>

              {votedTargetId ? (
                <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center">
                  تم تسجيل صوتك وقفل بطاقتك بنجاح! في انتظار بقية الأصوات...
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-300">
                    اختر المشتبه به الذي ترى ضرورة إقصائه اليوم لحماية المدينة:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {otherLivingPlayers.map((target) => (
                      <button
                        key={target.id}
                        onClick={() => handleCastVote(target.id)}
                        className="p-2.5 rounded-xl bg-obsidian-950 hover:bg-red-500/20 border border-noir-border hover:border-red-500/60 text-xs text-slate-200 font-bold transition text-right flex items-center justify-between"
                      >
                        <Vote className="w-3.5 h-3.5 text-red-400" />
                        <span>{target.display_name}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => handleCastVote('abstain')}
                      className="col-span-2 p-2.5 rounded-xl bg-obsidian-950 hover:bg-slate-800 border border-noir-border text-xs text-slate-400 font-medium transition text-center"
                    >
                      الامتناع عن التصويت
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. GAME LEADER / AUDIT DRAWER (If User is Leader) */}
          {isLeader && allRolesIfLeader.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-noir-card via-obsidian-950 to-noir-card border-2 border-gold-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="gold" className="text-[10px]">
                  سري للغاية
                </Badge>
                <div className="flex items-center gap-1.5 text-gold-300 font-bold text-xs font-display">
                  <span>لوحة القائد والمدير العام</span>
                  <Crown className="w-4 h-4 text-gold-400" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                بصفتك قائد المباراة، يمكنك الاطلاع على هويات اللاعبين لتوجيه دفة اللعب بنزاهة:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allRolesIfLeader.map((item) => (
                  <div
                    key={item.playerId}
                    className="p-2 rounded-lg bg-obsidian-900 border border-noir-border text-[11px] text-right"
                  >
                    <span className="font-bold text-slate-200 block truncate">
                      {item.playerName}
                    </span>
                    <span
                      className={`text-[10px] ${
                        item.role.team === 'mafia' ? 'text-red-400 font-semibold' : 'text-blue-400'
                      }`}
                    >
                      {item.role.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= BOTTOM: LIVING PLAYERS TRAY ================= */}
          <div className="space-y-2 pt-2 border-t border-gold-500/20">
            <span className="text-[11px] font-bold text-slate-400 block text-right">
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
                        ? 'bg-gold-500/20 border-gold-400 text-gold-300 font-bold shadow-lg shadow-gold-500/20 scale-105'
                        : isDead
                        ? 'bg-obsidian-950/40 border-noir-border/40 text-slate-600 line-through opacity-50'
                        : 'bg-noir-card border-noir-border text-slate-300'
                    }`}
                  >
                    {isCurrent && <Mic className="w-3.5 h-3.5 text-gold-400 animate-pulse" />}
                    <span>{p.display_name}</span>
                    {isDead && <span className="text-[10px] text-red-500">(مقصي)</span>}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in text-right">
          <div className="w-full max-w-lg bg-noir-card border-2 border-gold-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <Award className="w-16 h-16 text-gold-400 mx-auto animate-bounce" />

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold-500 font-mono">
                VICTORY DECLARED
              </span>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 font-display">
                {snapshot.game.winner_team === 'mafia'
                  ? 'انتصرت عصابة المافيا!'
                  : 'انتصر المواطنون الشرفاء!'}
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {snapshot.game.winner_team === 'mafia'
                  ? 'فرضت المافيا قبضتها الحديدية على المدينة وسقطت آخر دفاعات المواطنين.'
                  : 'تمت إبادة عناصر المافيا وتطهير شوارع المدينة ليعود الأمان لأهلها.'}
              </p>
            </div>

            {/* Play Again CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push('/room/create')}
                className="w-full sm:w-auto px-6 py-3"
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
