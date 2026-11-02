'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldAlert, Award, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GameRulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>القواعد الرسمية المعتمدة</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gold-300 font-display">
          دستور وقوانين Mafia Arena
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          المرجع الموحد لجميع آليات اللعبة وحسابات الخادم لحل الليل والتصويت وحسم الفوز.
        </p>
      </div>

      {/* Rules Sections */}
      <div className="space-y-8">
        {/* Section 1: Night Action Resolution Order */}
        <div className="p-6 rounded-2xl bg-noir-card border border-noir-border space-y-4">
          <h2 className="text-lg font-bold text-gold-400 font-display flex items-center gap-2 justify-end">
            <span>1. أولوية وترتيب تنفيذ أفعال الليل</span>
            <ShieldAlert className="w-5 h-5 text-gold-400" />
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            يقوم الخادم بمعالجة أفعال الليل بترتيب صارم لضمان النزاهة الرياضية:
          </p>
          <ol className="space-y-2 text-xs text-slate-400 list-decimal list-inside pr-2">
            <li><strong className="text-slate-200">حماية الدكتور:</strong> تُسجل دروع الحماية أولاً.</li>
            <li><strong className="text-slate-200">اغتيال المافيا:</strong> إذا كان المستهدف محمياً من الدكتور، تفشل محاولة القتل وينجو الهدف.</li>
            <li><strong className="text-slate-200">رصاصة القناص:</strong> تُطلق رصاصة القناص؛ وتخضع لقواعد الحماية أيضاً.</li>
            <li><strong className="text-slate-200">تحريات المحقق:</strong> يتحقق المحقق من هدف، ويحصل على تقرير سري (مافيا أم بريء).</li>
            <li><strong className="text-slate-200">تكميم مافيا التسكيت:</strong> يتم تكميم الهدف ليُمنع من الكلام في النهار التالي.</li>
          </ol>
        </div>

        {/* Section 2: Voting & Ties */}
        <div className="p-6 rounded-2xl bg-noir-card border border-noir-border space-y-4">
          <h2 className="text-lg font-bold text-gold-400 font-display flex items-center gap-2 justify-end">
            <span>2. قواعد الاقتراع وحالات التعادل</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </h2>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            <li>لكل مواطن حي صوت واحد، باستثناء <strong className="text-gold-300">العمدة</strong> الذي يُحتسب صوته بـ <strong className="text-gold-300">3 أصوات</strong>.</li>
            <li>لا يمكن للاعب التصويت لنفسه، ويحق له اختيار الامتناع.</li>
            <li>في حال تعادل الأصوات بين لاعبين اثنين، يُطبق الخيار المحدد في الغرفة: (إلغاء الإقصاء، جولة إعادة سريعة، أو قرار قاطع من قائد اللعبة).</li>
            <li>لا يحق للاعب المقصي أو المنقطع التصويت.</li>
          </ul>
        </div>

        {/* Section 3: Death Effects */}
        <div className="p-6 rounded-2xl bg-noir-card border border-noir-border space-y-4">
          <h2 className="text-lg font-bold text-gold-400 font-display flex items-center gap-2 justify-end">
            <span>3. قدرات وتأثيرات الموت (Death Triggers)</span>
            <Award className="w-5 h-5 text-purple-400" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-obsidian-950/80 border border-noir-border space-y-1.5">
              <span className="font-bold text-red-400">مافيا القنبلة:</span>
              <p className="text-slate-400">إذا تم إقصاؤه بالتصويت النهاري، تنفجر قنبلته ويسحب لاعباً محدداً معه فوراً.</p>
            </div>
            <div className="p-4 rounded-xl bg-obsidian-950/80 border border-noir-border space-y-1.5">
              <span className="font-bold text-blue-400">المواطن الشاب:</span>
              <p className="text-slate-400">عند إعدامه نهاراً، ينتقم باختيار مشتبه به ليتم إقصاؤه برفقته في نفس اللحظة.</p>
            </div>
          </div>
        </div>

        {/* Section 4: Win Conditions */}
        <div className="p-6 rounded-2xl bg-noir-card border border-gold-500/30 space-y-4">
          <h2 className="text-lg font-bold text-gold-400 font-display flex items-center gap-2 justify-end">
            <span>4. شروط الفوز الحاسمة</span>
            <Award className="w-5 h-5 text-gold-400" />
          </h2>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30">
              <strong className="text-red-400 block mb-1">فوز المافيا:</strong>
              يتحقق فوراً عندما يصبح عدد أفراد المافيا الأحياء مساوياً أو أكبر من عدد المواطنين الأحياء.
            </div>
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30">
              <strong className="text-blue-400 block mb-1">فوز المواطنين:</strong>
              يتحقق عندما يتم القضاء على جميع أفراد عصابة المافيا بالكامل.
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-6">
        <Link href="/room/create">
          <Button size="lg" variant="primary" className="px-8">
            جاهز للتحدي؟ أنشئ غرفة الآن
          </Button>
        </Link>
      </div>
    </div>
  );
}

