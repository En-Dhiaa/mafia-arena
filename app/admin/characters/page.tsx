'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Layers,
  Edit,
  RotateCcw,
  Plus,
  Save,
  Check,
  Sparkles,
  Sliders,
  Eye,
} from 'lucide-react';
import { DEFAULT_ROLES } from '@/lib/constants/default-roles';
import { CharacterRole, FitMode, TeamType } from '@/lib/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { CharacterCard } from '@/components/cards/character-card';
import { sounds } from '@/lib/audio/sound-effects';

export default function AdminCharactersPage() {
  const [roles, setRoles] = useState<CharacterRole[]>(DEFAULT_ROLES);
  const [selectedRole, setSelectedRole] = useState<CharacterRole | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Form states for selected role
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [team, setTeam] = useState<TeamType>('citizen');
  const [imageUrl, setImageUrl] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [abilitiesAr, setAbilitiesAr] = useState('');
  const [abilitiesEn, setAbilitiesEn] = useState('');
  const [fitMode, setFitMode] = useState<FitMode>('contain');
  const [focalX, setFocalX] = useState(50);
  const [focalY, setFocalY] = useState(35);
  const [isEnabled, setIsEnabled] = useState(true);

  const openEditor = (role: CharacterRole) => {
    sounds.playClick();
    setSelectedRole(role);
    setNameAr(role.name);
    setNameEn(role.name_en);
    setTeam(role.team);
    setImageUrl(role.image_url);
    setDescAr(role.description);
    setDescEn(role.description_en);
    setAbilitiesAr(role.abilities);
    setAbilitiesEn(role.abilities_en);
    setFitMode(role.fit_mode);
    setFocalX(role.focal_point_x ?? 50);
    setFocalY(role.focal_point_y ?? 35);
    setIsEnabled(role.is_enabled);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!selectedRole) return;
    sounds.playClick();

    const updated: CharacterRole = {
      ...selectedRole,
      name: nameAr,
      name_en: nameEn,
      team,
      image_url: imageUrl,
      description: descAr,
      description_en: descEn,
      abilities: abilitiesAr,
      abilities_en: abilitiesEn,
      fit_mode: fitMode,
      focal_point_x: focalX,
      focal_point_y: focalY,
      is_enabled: isEnabled,
    };

    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedRole(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    sounds.playClick();
    setRoles(DEFAULT_ROLES);
    if (selectedRole) {
      const def = DEFAULT_ROLES.find((r) => r.id === selectedRole.id);
      if (def) openEditor(def);
    }
  };

  // Preview role object
  const previewRole: CharacterRole | null = selectedRole
    ? {
        ...selectedRole,
        name: nameAr,
        name_en: nameEn,
        team,
        image_url: imageUrl,
        description: descAr,
        description_en: descEn,
        abilities: abilitiesAr,
        abilities_en: abilitiesEn,
        fit_mode: fitMode,
        focal_point_x: focalX,
        focal_point_y: focalY,
      }
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-noir-border">
        <div>
          <h1 className="text-2xl font-bold text-gold-300 font-display">
            محرر البطاقات وإدارة الشخصيات
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            عدل مسميات وقدرات الشخصيات، غير الصور، واضبط موضع التركيز (Fit & Focal Point) مع معاينة مباشرة.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={handleResetDefaults} className="gap-2">
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>استعادة البطاقات الافتراضية الأصلية</span>
        </Button>
      </div>

      {/* Characters List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-4 rounded-2xl bg-noir-card border border-noir-border hover:border-gold-500/40 transition space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <Badge team={role.team} className="text-[10px]">
                {role.team}
              </Badge>
              <div className="text-right">
                <h4 className="text-sm font-bold text-slate-100 font-display">{role.name}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{role.name_en}</span>
              </div>
            </div>

            <div className="relative w-full h-36 rounded-xl overflow-hidden bg-obsidian-950 border border-noir-border">
              <Image
                src={role.image_url}
                alt={role.name}
                fill
                className="object-contain p-1"
                style={{
                  objectFit: role.fit_mode,
                  objectPosition: `${role.focal_point_x ?? 50}% ${role.focal_point_y ?? 35}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-noir-border">
              <Button size="sm" variant="primary" onClick={() => openEditor(role)} className="w-full gap-1.5 text-xs py-2">
                <Edit className="w-3.5 h-3.5" />
                <span>تعديل البطاقة والصورة</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Modal Card Editor with Live Preview */}
      <Modal
        isOpen={!!selectedRole}
        onClose={() => setSelectedRole(null)}
        title={`محرر بطاقة: ${selectedRole?.name}`}
        className="max-w-4xl"
      >
        {previewRole && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Live Interactive Card Preview */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-obsidian-950/80 border border-gold-500/30 space-y-3">
              <span className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-gold-400" />
                <span>المعاينة المباشرة للبطاقة أثناء اللعب:</span>
              </span>

              <CharacterCard role={previewRole} size="md" isFlipped={true} canFlip={false} />

              <span className="text-[11px] text-slate-500 text-center">
                هذه المعاينة مطابقة تماماً لما سيشاهده اللاعب في شاشته.
              </span>
            </div>

            {/* Right: Controls & Form */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {isSaved && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>تم حفظ التعديلات بنجاح!</span>
                </div>
              )}

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="الاسم العربي:"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                />
                <Input
                  label="English Name:"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                />
              </div>

              {/* Team Selector */}
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-semibold text-slate-300">الفريق:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mafia', 'citizen', 'neutral'] as TeamType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTeam(t)}
                      className={`p-2 rounded-lg text-xs font-bold transition ${
                        team === t
                          ? 'bg-gold-500 text-obsidian-950'
                          : 'bg-obsidian-950 text-slate-400 border border-noir-border'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image URL & Fit Mode */}
              <div className="space-y-3 pt-2 border-t border-noir-border">
                <Input
                  label="رابط الصورة المباشر (HTTPS أو مسار محلي):"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... أو /images/cards/..."
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-right">
                    <label className="text-xs font-semibold text-slate-300">طريقة العرض (Fit):</label>
                    <select
                      value={fitMode}
                      onChange={(e) => setFitMode(e.target.value as FitMode)}
                      className="w-full bg-obsidian-950 text-xs text-slate-200 p-2.5 rounded-lg border border-noir-border"
                    >
                      <option value="contain">Contain (يحفظ كامل الصورة دون قص)</option>
                      <option value="cover">Cover (يملأ الإطار بالكامل)</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-right">
                    <label className="text-xs font-semibold text-slate-300">حالة البطاقة:</label>
                    <button
                      type="button"
                      onClick={() => setIsEnabled(!isEnabled)}
                      className={`w-full p-2.5 rounded-lg text-xs font-bold transition ${
                        isEnabled
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-950/60 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {isEnabled ? 'مفعلة في المباريات' : 'معطلة'}
                    </button>
                  </div>
                </div>

                {/* Focal Point Sliders */}
                <div className="p-3 rounded-xl bg-obsidian-950 border border-noir-border space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                    <span>{focalY}%</span>
                    <span>نقطة التركيز الرأسية (Focal Point Y):</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focalY}
                    onChange={(e) => setFocalY(Number(e.target.value))}
                    className="w-full accent-gold-500"
                  />
                </div>
              </div>

              {/* Descriptions & Abilities */}
              <div className="space-y-3 pt-2 border-t border-noir-border">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-slate-300">الوصف بالعربية:</label>
                  <textarea
                    rows={2}
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    className="w-full bg-obsidian-950 text-xs text-slate-200 p-2.5 rounded-lg border border-noir-border focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-slate-300">القدرات بالعربية:</label>
                  <textarea
                    rows={2}
                    value={abilitiesAr}
                    onChange={(e) => setAbilitiesAr(e.target.value)}
                    className="w-full bg-obsidian-950 text-xs text-slate-200 p-2.5 rounded-lg border border-noir-border focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-noir-border">
                <Button size="md" variant="primary" onClick={handleSave} className="w-full py-3 gap-2">
                  <Save className="w-4 h-4" />
                  <span>حفظ تعديلات البطاقة فوراً</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
