'use client';

import React, { useState } from 'react';
import { Settings, Save, Check, Volume2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminSettingsPage() {
  const [defaultMin, setDefaultMin] = useState(4);
  const [defaultMax, setDefaultMax] = useState(12);
  const [defaultTie, setDefaultTie] = useState('no_elimination');
  const [adminSetupKey, setAdminSetupKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-right">
      <div className="pb-6 border-b border-noir-border">
        <h1 className="text-2xl font-bold text-gold-300 font-display">
          إعدادات وقواعد اللعبة الافتراضية
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          تعديل الإعدادات العامة لإنشاء الغرف الجديدة، مفاتيح الإدارة، وسياسات التعادل.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-noir-card p-6 rounded-2xl border border-noir-border">
        {isSaved && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>تم حفظ الإعدادات الافتراضية بنجاح!</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="الحد الأدنى الافتراضي للاعبين:"
            type="number"
            min={4}
            max={10}
            value={defaultMin}
            onChange={(e) => setDefaultMin(Number(e.target.value))}
          />
          <Input
            label="الحد الأقصى الافتراضي للاعبين:"
            type="number"
            min={6}
            max={24}
            value={defaultMax}
            onChange={(e) => setDefaultMax(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            سياسة التعادل الافتراضية في التصويت النهاري:
          </label>
          <select
            value={defaultTie}
            onChange={(e) => setDefaultTie(e.target.value)}
            className="w-full bg-obsidian-950 text-xs text-slate-200 p-3 rounded-lg border border-noir-border"
          >
            <option value="no_elimination">إلغاء الإقصاء (النجاة للجميع)</option>
            <option value="revote">جولة إعادة تصويت سريعة</option>
            <option value="leader_decides">قرار حاسم من قائد ومدير اللعبة</option>
          </select>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-noir-border">
          <Input
            label="مفتاح الإدارة السري (Admin Secret Key):"
            type="password"
            placeholder="أدخل مفتاح الإدارة للتحقق"
            value={adminSetupKey}
            onChange={(e) => setAdminSetupKey(e.target.value)}
          />
          <span className="text-[10px] text-slate-500 block">
            يُستخدم لتأمين مسارات الخادم الإدارية ومنع الوصول غير المصرح به.
          </span>
        </div>

        <Button type="submit" variant="primary" size="md" className="w-full py-3 gap-2">
          <Save className="w-4 h-4" />
          <span>حفظ وتطبيق الإعدادات</span>
        </Button>
      </form>
    </div>
  );
}

