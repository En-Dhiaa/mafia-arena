'use client';

import React from 'react';
import Link from 'next/link';
import {
  Moon,
  Sun,
  Shield,
  Skull,
  Users,
  Mic,
  Vote,
  Crown,
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowToPlayPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <HelpCircle className="w-4 h-4" />
          <span>دليل اللاعبين الكامل</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gold-300 font-display">
          طريقة لعب Mafia Arena
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          دليل مبسط ومفصل يشرح لك كل خطوة في اللعبة، من لحظة دخول الردهة وحتى تحقيق النصر لفريقك.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-noir-card border border-red-500/30 space-y-3">
          <div className="flex items-center gap-2 justify-end text-red-400">
            <h3 className="text-lg font-bold font-display">فريق المافيا</h3>
            <Skull className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            الهدف: السيطرة على المدينة والتخلص من المواطنين حتى يتساوى عدد المافيا الأحياء مع عدد المواطنين. المافيا تعرف هويات بعضها البعض وتختار ضحية كل ليلة في سرية تامة.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-noir-card border border-blue-500/30 space-y-3">
          <div className="flex items-center gap-2 justify-end text-blue-400">
            <h3 className="text-lg font-bold font-display">فريق المواطنين</h3>
            <Shield className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            الهدف: كشف جميع أفراد المافيا وإقصاؤهم بالتصويت النهاري أو بقناص المدينة. المواطنون لا يعرفون أدوار بعضهم، وسلاحهم الأقوى هو الملاحظة والتحليل المنطقي والعمل الجماعي.
          </p>
        </div>
      </div>

      {/* Step by Step Walkthrough */}
      <div className="space-y-10">
        <h2 className="text-2xl font-bold text-gold-400 border-b border-gold-500/20 pb-3 font-display">
          مراحل المباراة خطوة بخطوة
        </h2>

        {/* 1. Lobby & Role Assignment */}
        <div className="p-6 rounded-2xl bg-noir-card border border-noir-border space-y-3">
          <div className="flex items-center gap-2 justify-end text-gold-300">
            <h3 className="text-base font-bold font-display">1. الردهة وتوزيع الأدوار السري</h3>
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            عند اكتمال عدد اللاعبين، يضغط المضيف على زر &quot;بدء المباراة&quot;. يقوم الخادم بتوزيع الأدوار عشوائياً. يظهر لكل لاعب بطاقة مقلوبة؛ المس شاشتك لكشف بطاقتك الخاصة. لا يمكن لأي لاعب آخر أو متصفح خارجي رؤية بطاقتك!
          </p>
        </div>

        {/* 2. Night Phase */}
        <div className="p-6 rounded-2xl bg-noir-card border border-noir-border space-y-3">
          <div className="flex items-center gap-2 justify-end text-purple-400">
            <h3 className="text-base font-bold font-display">2. مرحلة الليل (أفعال الظلام)</h3>
            <Moon className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            تتحول الواجهة سينمائياً إلى الوضع الليلي الداكن:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
            <li><strong className="text-slate-200">المافيا:</strong> تختار ضحية لتصفيتها (كلمة زعيم المافيا هي الفيصل عند الاختلاف).</li>
            <li><strong className="text-slate-200">الدكتور:</strong> يختار مواطناً لحمايته من الاغتيال.</li>
            <li><strong className="text-slate-200">المحقق:</strong> يفحص هوية مشتبه به ليعرف هل هو مافيا أم بريء.</li>
            <li><strong className="text-slate-200">القناص:</strong> يملك رصاصة قاتلة يمكنه إطلاقها على مشتبه به.</li>
            <li><strong className="text-slate-200">مافيا التسكيت:</strong> تختار لاعباً لتكميم فمه ومنعه من الحديث نهاراً.</li>
          </ul>
        </div>

        {/* 3. Day Phase & Speaking Turns */}
        <div className="p-6 rounded-2xl bg-noir-card border border-noir-border space-y-3">
          <div className="flex items-center gap-2 justify-end text-amber-400">
            <h3 className="text-base font-bold font-display">3. مرحلة النهار ونظام تسليم الكلام</h3>
            <Sun className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            تشرق الشمس وتعلن نتيجة الليل (من نجا ومن قُتل). ثم تبدأ مرحلة النقاش المنظم:
          </p>
          <div className="p-4 rounded-xl bg-obsidian-950/70 border border-gold-500/20 flex items-start gap-3 justify-end">
            <div className="text-right space-y-1">
              <span className="text-xs font-bold text-gold-300">مؤشر المتحدث الذكي</span>
              <p className="text-xs text-slate-400">
                لا يوجد تايمر إجباري يقطع حديثك؛ يظهر للاعب صاحب الدور ميكروفون متحرك واضح. يتحدث اللاعب بحرية، ثم يضغط زر &quot;التالي&quot; لتسليم الدور للاعب التالي بكل احترام.
              </p>
            </div>
            <Mic className="w-6 h-6 text-gold-400 shrink-0 mt-0.5" />
          </div>
        </div>

        {/* 4. Voting & Elimination */}
        <div className="p-6 rounded-2xl bg-noir-card border border-noir-border space-y-3">
          <div className="flex items-center gap-2 justify-end text-emerald-400">
            <h3 className="text-base font-bold font-display">4. التصويت ومحاكمة المتهمين</h3>
            <Vote className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            بعد انتهاء جولة التحدث، يفتح صندوق الاقتراع. يصوت كل لاعب حي لاختيار من يراه يستحق الإقصاء، أو يمتنع عن التصويت. صوت العمدة يعادل 3 أصوات! يحسب الخادم النتيجة ويقصي صاحب أعلى الأصوات.
          </p>
        </div>

        {/* 5. Game Master / Leader Feature */}
        <div className="p-6 rounded-2xl bg-gradient-to-l from-gold-500/10 via-noir-card to-noir-card border border-gold-500/40 space-y-3">
          <div className="flex items-center gap-2 justify-end text-gold-400">
            <h3 className="text-base font-bold font-display">5. ميزة قائد اللعبة (أول لاعب مقصي)</h3>
            <Crown className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            في Mafia Arena، خروجك المبكر ليس نهاية المتعة! أول لاعب يتم إقصاؤه يصبح تلقائياً <strong className="text-gold-300">قائد ومدير المباراة</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-obsidian-950/80 border border-noir-border text-xs text-slate-300 flex items-center gap-2 justify-end">
              <span>يرى بطاقات جميع اللاعبين وحالاتهم</span>
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
            </div>
            <div className="p-3 rounded-lg bg-obsidian-950/80 border border-noir-border text-xs text-slate-300 flex items-center gap-2 justify-end">
              <span>يدير الانتقال السلس بين الليل والنهار</span>
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
            </div>
            <div className="p-3 rounded-lg bg-obsidian-950/80 border border-noir-border text-xs text-slate-300 flex items-center gap-2 justify-end">
              <span>يعتمد الإقصاء أو يحل حالات التعادل</span>
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
            </div>
            <div className="p-3 rounded-lg bg-obsidian-950/80 border border-noir-border text-xs text-slate-300 flex items-center gap-2 justify-end">
              <span>يتجاوز اللاعبين المنقطعين لضمان سلاسة اللعب</span>
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-8 border-t border-gold-500/20">
        <Link href="/room/create">
          <Button size="lg" variant="primary" className="gap-2 px-8">
            <span>ابدأ بتطبيق ما تعلمته وأنشئ غرفة الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
