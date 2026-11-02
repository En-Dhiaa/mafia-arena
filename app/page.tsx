'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Moon,
  Sun,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowLeft,
  Crown,
  HelpCircle,
  PlayCircle,
  Eye,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CharacterCard } from '@/components/cards/character-card';
import { DEFAULT_ROLES } from '@/lib/constants/default-roles';

export default function HomePage() {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const featuredRoles = DEFAULT_ROLES.slice(0, 6);

  const steps = [
    {
      num: '01',
      title: 'أنشئ غرفتك أو انضم إليها',
      desc: 'بضغطة زر واحدة أنشئ غرفة خاصة أو عامة، وشارك رمز الدعوة المكون من 6 رموز مع رفاقك.',
      icon: Users,
    },
    {
      num: '02',
      title: 'توزيع الأدوار السري',
      desc: 'يوزع الخادم الأدوار عشوائياً وبسرية مشفرة؛ كل لاعب يرى بطاقته وحده بلمس الشاشة دون معرفة الآخرين.',
      icon: Eye,
    },
    {
      num: '03',
      title: 'الليل الحاسم والنهار الصاخب',
      desc: 'في الليل تنفذ المافيا اغتيالاتها والدكتور حمايته، وفي النهار تبدأ جولات التحدث وتمرير الميكروفون.',
      icon: Moon,
    },
    {
      num: '04',
      title: 'التصويت والإقصاء وقائد اللعبة',
      desc: 'يصوت الجميع لإقصاء المشتبه بهم. أول لاعب يخرج يصبح تلقائياً قائد اللعبة المشرف على مجريات المباراة!',
      icon: Crown,
    },
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'تصميم Mobile-First بالوضع الرأسي',
      desc: 'العب براحة وسلاسة بوضع الهاتف العمودي دون الحاجة لتدوير الشاشة، مع توافق كامل مع الحواسيب والأجهزة اللوحية.',
    },
    {
      icon: Moon,
      title: 'انتقال سينمائي بين الليل والنهار',
      desc: 'تتحول الواجهة إلى وضع نوار داكن في مرحلة الليل بأصوات ومؤثرات خاصة، وتعود للوضع النهاري مع شروق الشمس.',
    },
    {
      icon: Radio,
      title: 'مؤشر المتحدث وتمرير الدور',
      desc: 'نظام حديث يبرز اللاعب صاحب الدور الحالي مع ميكروفون متحرك، وزر مريح لتسليم الدور للاعب التالي دون مقاطعة.',
    },
    {
      icon: Crown,
      title: 'نظام القائد (أول مقصي)',
      desc: 'حتى لو خرجت في الجولة الأولى، تتحول مباشرة إلى قائد ومدير المباراة لتشرف على الجولات وتتابع جميع الأسرار!',
    },
    {
      icon: ShieldCheck,
      title: 'أمان وسرية مطلقة في الخادم',
      desc: 'لا يتم إرسال أدوار اللاعبين إلى متصفحات الخصوم مطلقاً؛ كل لاعب محمي بسياسات أمان صارمة في الخادم.',
    },
    {
      icon: Sparkles,
      title: '11 شخصية فريدة قابلة للتخصيص',
      desc: 'من العراب والدكتور إلى القناص ومافيا التسكيت والعمدة صاحب الـ 3 أصوات، مع محرر كامل لتعديل صور وقدرات البطاقات.',
    },
  ];

  const faqs = [
    {
      q: 'هل تحتاج اللعبة إلى تثبيت أي تطبيق؟',
      a: 'لا، Mafia Arena تعمل بالكامل من خلال متصفح الويب على أجهزة Android وiPhone والحواسيب بمجرد فتح الرابط.',
    },
    {
      q: 'كم عدد اللاعبين المناسب للعب؟',
      a: 'تدعم الغرفة من 4 إلى 20 لاعباً، والعدد المثالي للمباراة المتوازنة هو بين 6 إلى 12 لاعباً.',
    },
    {
      q: 'كيف يعمل دور قائد اللعبة (Game Master)؟',
      a: 'وفق الإعداد الافتراضي، أول لاعب يتم إقصاؤه من المباراة يتم ترقيته تلقائياً ليصبح قائد اللعبة، فيرى جميع الأدوار ويدير المراحل بنزاهة.',
    },
    {
      q: 'هل يمكن تعديل صور وقدرات البطاقات؟',
      a: 'نعم! تتيح لوحة الإدارة رفع صور جديدة، استخدام روابط مباشرة، ضبط موضع الصورة وحجمها، وتعديل نصوص القدرات بالعربية والإنجليزية.',
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/night-bg.png"
            alt="Mafia Arena Atmospheric Night"
            fill
            priority
            className="object-cover object-center opacity-40 scale-105 animate-pulse-subtle"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/90 via-transparent to-obsidian-950" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>الجيل الجديد من لعبة المافيا العربية الجماعية عبر الإنترنت</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-amber-600 font-display tracking-tight leading-tight">
              المدينة نائمة... <br className="hidden sm:inline" />
              والمافيا تستيقظ!
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              تحدّ أصدقاءك في لعبة من الدهاء والتحليل النفسي والتصويت الحاسم. ادخل الغرفة فوراً من متصفح هاتفك أو حاسوبك واستمتع بمزامنة فورية وبطاقات لعب فاخرة.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/room/create" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-base px-8 py-4 gap-3 shadow-xl shadow-gold-500/25">
                <PlayCircle className="w-5 h-5" />
                <span>إنشاء غرفة جديدة</span>
              </Button>
            </Link>

            <Link href="/room/join" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8 py-4 gap-3">
                <Users className="w-5 h-5 text-gold-400" />
                <span>الانضمام لمباراة</span>
              </Button>
            </Link>
          </div>

          {/* Fast Stats / Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto border-t border-gold-500/20">
            <div className="p-3 rounded-xl bg-noir-card/60 border border-noir-border/80">
              <div className="text-2xl font-black text-gold-400 font-display">100%</div>
              <div className="text-xs text-slate-400">مجانية بالكامل</div>
            </div>
            <div className="p-3 rounded-xl bg-noir-card/60 border border-noir-border/80">
              <div className="text-2xl font-black text-gold-400 font-display">11+</div>
              <div className="text-xs text-slate-400">شخصية وبطاقة أصلية</div>
            </div>
            <div className="p-3 rounded-xl bg-noir-card/60 border border-noir-border/80">
              <div className="text-2xl font-black text-gold-400 font-display">Realtime</div>
              <div className="text-xs text-slate-400">مزامنة لحظية فورية</div>
            </div>
            <div className="p-3 rounded-xl bg-noir-card/60 border border-noir-border/80">
              <div className="text-2xl font-black text-gold-400 font-display">0 MB</div>
              <div className="text-xs text-slate-400">بدون تحميل أو تثبيت</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE CARDS PREVIEW SECTION ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border-y border-gold-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              <Eye className="w-3.5 h-3.5" />
              <span>المس البطاقة لكشف الهوية السرية</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gold-300 font-display">
              أوراق وشخصيات Mafia Arena
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              بطاقات سينمائية بنمط النوار الفاخر مع قدرات حقيقية ينفذها محرك اللعبة. المس أي بطاقة لتجربة تأثير القلب ثلاثي الأبعاد.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
            {featuredRoles.map((role) => (
              <div key={role.id} className="flex flex-col items-center">
                <CharacterCard role={role} size="sm" />
                <span className="text-xs font-bold text-gold-400 mt-3 font-display">
                  {role.name}
                </span>
                <span className="text-[10px] text-slate-500">{role.name_en}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/cards">
              <Button variant="outline" size="md" className="gap-2">
                <span>استعراض كافة الشخصيات الـ 11 ومميزاتها</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gold-300 font-display">
            كيف تسير المباراة؟
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            أربع خطوات بسيطة تبدأ من إنشاء الغرفة وحتى إعلان الفريق الفائز.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="relative p-6 rounded-2xl bg-noir-card/80 border border-noir-border hover:border-gold-500/40 transition duration-300 flex flex-col justify-between text-right space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-gold-500/40 font-display group-hover:text-gold-400 transition">
                  {st.num}
                </span>
                <div className="p-3 rounded-xl bg-obsidian-950 border border-gold-500/30 text-gold-400 group-hover:scale-110 transition-transform">
                  <st.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-100 font-display">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CORE GAME FEATURES ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-obsidian-900/50 border-t border-gold-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gold-300 font-display">
              مميزات صممت خصيصاً للاعبين
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              تجربة لعب استثنائية تنافس أشهر تطبيقات الألعاب الاجتماعية العالمية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-noir-card border border-noir-border/80 hover:border-gold-500/40 transition duration-300 space-y-3 text-right"
              >
                <div className="inline-flex p-3 rounded-xl bg-obsidian-950 border border-gold-500/30 text-gold-400">
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 font-display">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-semibold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gold-300 font-display">
            كل ما تود معرفته عن Mafia Arena
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-noir-card/70 border border-noir-border text-right space-y-2 hover:border-gold-500/30 transition"
            >
              <h4 className="text-sm font-bold text-gold-300 font-display">{faq.q}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gold-500/20 bg-gradient-to-r from-obsidian-950 via-noir-card to-obsidian-950">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gold-300 font-display">
            جاهز لبدء مغامرتك القادمة؟
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            أنشئ غرفتك الآن مجاناً، ادعُ أصدقاءك، واكتشف من يستطيع خداع الجميع والنجاة بحياته!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/room/create">
              <Button size="lg" variant="primary" className="px-8 py-3.5">
                ابدأ بإنشاء غرفة الآن
              </Button>
            </Link>
            <Link href="/how-to-play">
              <Button size="lg" variant="outline" className="px-8 py-3.5">
                تعرف على القواعد الكاملة
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
