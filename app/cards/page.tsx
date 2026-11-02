'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Sparkles, Shield, Skull, Scale, X, Layers } from 'lucide-react';
import { DEFAULT_ROLES } from '@/lib/constants/default-roles';
import { CharacterRole, TeamType } from '@/lib/types/game';
import { CharacterCard } from '@/components/cards/character-card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { sounds } from '@/lib/audio/sound-effects';

export default function CardsEncyclopediaPage() {
  const [activeTeam, setActiveTeam] = useState<'all' | TeamType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<CharacterRole | null>(null);

  const filteredRoles = DEFAULT_ROLES.filter((role) => {
    const matchesTeam = activeTeam === 'all' || role.team === activeTeam;
    const matchesSearch =
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.abilities.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const handleRoleClick = (role: CharacterRole) => {
    sounds.playCardFlip();
    setSelectedRole(role);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <Layers className="w-4 h-4" />
          <span>موسوعة أوراق وشخصيات اللعبة</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gold-300 font-display">
          كتالوج بطاقات Mafia Arena
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          استكشف جميع الأدوار الـ 11 وتعرف على قدراتها التكتيكية، وشروط تفعيلها، وتوزيعها بين فريق المافيا والمواطنين والشخصيات المحايدة.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-noir-card border border-noir-border">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو القدرة..."
            className="w-full bg-obsidian-950 text-slate-100 placeholder-slate-500 text-sm pl-4 pr-10 py-2.5 rounded-xl border border-noir-border focus:outline-none focus:border-gold-500 transition"
          />
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
        </div>

        {/* Team Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTeam('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition select-none ${
              activeTeam === 'all'
                ? 'bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20'
                : 'bg-obsidian-950 text-slate-400 hover:text-slate-200 border border-noir-border'
            }`}
          >
            الكل ({DEFAULT_ROLES.length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTeam('mafia');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition select-none ${
              activeTeam === 'mafia'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-obsidian-950 text-slate-400 hover:text-red-400 border border-noir-border'
            }`}
          >
            <Skull className="w-3.5 h-3.5" />
            <span>المافيا</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTeam('citizen');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition select-none ${
              activeTeam === 'citizen'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-obsidian-950 text-slate-400 hover:text-blue-400 border border-noir-border'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>المواطنون</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTeam('neutral');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition select-none ${
              activeTeam === 'neutral'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-obsidian-950 text-slate-400 hover:text-purple-400 border border-noir-border'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>محايد / الحكم</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            onClick={() => handleRoleClick(role)}
            className="flex flex-col items-center cursor-pointer group"
          >
            <CharacterCard role={role} size="md" isFlipped={true} canFlip={false} />
            <div className="mt-3 text-center">
              <span className="text-xs text-gold-400 group-hover:text-gold-300 font-bold transition flex items-center gap-1 justify-center">
                <span>انقر لعرض التفاصيل الكاملة</span>
                <Sparkles className="w-3 h-3 text-gold-500" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Card Deep Details */}
      <Modal
        isOpen={!!selectedRole}
        onClose={() => setSelectedRole(null)}
        title={selectedRole?.name}
        className="max-w-2xl"
      >
        {selectedRole && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Card Thumbnail */}
              <div className="shrink-0">
                <CharacterCard role={selectedRole} size="sm" isFlipped={true} canFlip={false} />
              </div>

              {/* Full Specs */}
              <div className="space-y-4 flex-1 text-right">
                <div className="flex items-center justify-between">
                  <Badge team={selectedRole.team} className="text-xs px-3 py-1">
                    {selectedRole.team === 'mafia'
                      ? 'فريق المافيا'
                      : selectedRole.team === 'citizen'
                      ? 'فريق المواطنين'
                      : 'فريق محايد'}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400 tracking-wider">
                    {selectedRole.name_en}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">
                    الوصف والشخصية
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed bg-obsidian-950 p-3 rounded-xl border border-noir-border">
                    {selectedRole.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    القدرات في اللعبة
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed bg-obsidian-950 p-3 rounded-xl border border-noir-border">
                    {selectedRole.abilities}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-noir-border flex justify-between">
                  <span>ترتيب الأسبقية: #{selectedRole.sort_order}</span>
                  <span>
                    تعدد النسخ:{' '}
                    {selectedRole.allow_duplicates ? 'مسموح بعدة نسخ' : 'نسخة فريدة فقط'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

