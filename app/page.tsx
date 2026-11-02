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
  const featuredRoles = DEFAULT_ROLES.slice(0, 6);

  const steps = [
    {
      num: '01',
      title: 'أنشئ غرفتك أو انضم إليها',
      desc: 'بضغطة زر واحدة أنشئ غرفة خاصة أو عامة، وشارك رمز الدعوة المكون من 6 خانات مع رفاقك.',
      icon: Users,
    },
    {
      num: '02',
      title: 'توزيع الأدوار السري والتلقائي',
      desc: 'يوزع الخادم الأدوار عشوائياً وتلقائياً. لا يعرف المشرف أو أي لاعب بطاقة الآخر، بل يعرفون الأسماء فقط.',
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
      desc: 'الواجهة نهارية فاتحة ومريحة افتراضياً، وتتحول بسلاسة إلى وضع نوار داكن في مرحلة الليل بأصوات ومؤثرات حماسية.',
    },
    {
      icon: Radio,
      title: 'مؤشر المتحدث وتسليم الدور',
      desc: 'نظام حديث يبرز اللاعب صاحب الدور الحالي مع ميكروفون متحرك، وزر مريح لتسليم الدور للاعب التالي دون مقاطعة.',
    },
    {
      icon: Crown,
      title: 'نظام القائد (أول مقصي)',
      desc: 'خروجك المبكر ليس نهاية المتعة! تتحول مباشرة إلى قائد ومدير المباراة لتشرف على الجولات وتتابع الأحداث.',
    },
    {
      icon: ShieldCheck,
      title: 'أمان وسرية مطلقة في الخادم',
      desc: 'المشرف الرئيسي واللاعبون لا يعرفون بطاقات بعضهم؛ كل لاعب محمي بسياسات تشفير صارمة في الخادم.',
    },
    {
      icon: Sparkles,
      title: '11 شخصية فريدة قابلة للتخصيص',
      desc: 'حدد عدد نسخ كل بطاقة بنقرة أو ضغطة مطولة، مع محرر كامل لتعديل صور وقدرات البطاقات باللغتين.',
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
      q: 'هل يستطيع المشرف أو أي لاعب معرفة بطاقتي؟',
      a: 'مستحيل! التوزيع تلقائي وسري بنسبة 100% في الخادم. لا أحد يعرف بطاقة أي لاعب آخر، بل يعرفون الاسم المدخل فقط.',
    },
    {
      q: 'كيف أغير الوضع من الفاتح إلى الداكن؟',
      a: 'يمكنك التبديل في أي وقت بضغطة واحدة على أيقونة الشمس/القمر في أعلى شريط التنقل.',
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden transition-colors duration-300">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-amber-50/50 via-slate-50 to-white dark:from-obsidian-950 dark:via-obsidian-900 dark:to-obsidian-950">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/day-bg.png"
            alt="Mafia Arena Atmospheric Daylight"
            fill
            priority
            className="object-cover object-center opacity-20 dark:opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent dark:from-obsidian-950 dark:via-obsidian-950/80 dark:to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-gold-300 text-xs font-bold shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-gold-400" />
            <span>الجيل الجديد من لعبة المافيا العربية الجماعية عبر الهواتف والمتصفح</span>
          </div>

          {/* Main Title */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-gold-200 dark:via-gold-400 dark:to-amber-600 font-display tracking-tight leading-tight">
              المدينة نائمة... <br className="hidden sm:inline" />
              والمافيا تستيقظ!
            </h1>
            <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-2 font-medium">
              تحدّ أصدقاءك في لعبة من الدهاء والتحليل النفسي والتصويت الحاسم. صممت خصيصاً للهواتف لتلعب فوراً من المتصفح بمزامنة لحظية وسرية مطلقة للأدوار.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 sm:pt-4 px-4 sm:px-0">
            <Link href="/room/create" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-base px-8 py-4 gap-3 shadow-xl shadow-amber-500/25">
                <PlayCircle className="w-5 h-5" />
                <span>إنشاء غرفة جديدة</span>
              </Button>
            </Link>

            <Link href="/room/join" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8 py-4 gap-3 shadow-md">
                <Users className="w-5 h-5 text-amber-600 dark:text-gold-400" />
                <span>الانضمام لمباراة</span>
              </Button>
            </Link>
          </div>

          {/* Fast Stats / Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-8 sm:pt-12 max-w-3xl mx-auto border-t border-slate-200 dark:border-gold-500/20 px-2 sm:px-0">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-noir-card/60 border border-slate-200 dark:border-noir-border shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-gold-400 font-display">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold">مجانية وسرية تماماً</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-noir-card/60 border border-slate-200 dark:border-noir-border shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-gold-400 font-display">11+</div>
              <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold">شخصية وبطاقة أصلية</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-noir-card/60 border border-slate-200 dark:border-noir-border shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-gold-400 font-display">Realtime</div>
              <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold">مزامنة لحظية فورية</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-noir-card/60 border border-slate-200 dark:border-noir-border shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-gold-400 font-display">0 MB</div>
              <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold">بدون تحميل أو تثبيت</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE CARDS PREVIEW SECTION ================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 dark:bg-obsidian-900/50 border-y border-slate-200 dark:border-gold-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
              <Eye className="w-3.5 h-3.5" />
              <span>المس البطاقة لكشف الهوية السرية</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-gold-300 font-display">
              أوراق وشخصيات Mafia Arena
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              بطاقات سينمائية فاخرة لا تُقص وجوهها مع قدرات حقيقية ينفذها محرك اللعبة. المس أي بطاقة لتجربة تأثير القلب ثلاثي الأبعاد.
            </p>
          </div>

          {/* Cards Grid (Optimized for Mobile Screens) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {featuredRoles.map((role) => (
              <div key={role.id} className="flex flex-col items-center w-full max-w-[170px] sm:max-w-none">
                <CharacterCard role={role} size="sm" className="w-full h-56 sm:h-64" />
                <span className="text-xs font-bold text-slate-900 dark:text-gold-400 mt-2 font-display">
                  {role.name}
                </span>
                <span className="text-[10px] text-slate-500">{role.name_en}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
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
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-gold-300 font-display">
            كيف تسير المباراة؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            أربع خطوات واضحة تبدأ من إنشاء الغرفة وحتى إعلان الفريق الفائز.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-noir-card/80 border border-slate-200 dark:border-noir-border shadow-md hover:border-amber-400 dark:hover:border-gold-500/40 transition duration-300 flex flex-col justify-between text-right space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-black text-amber-500/40 dark:text-gold-500/40 font-display group-hover:text-amber-600 dark:group-hover:text-gold-400 transition">
                  {st.num}
                </span>
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-obsidian-950 border border-amber-200 dark:border-gold-500/30 text-amber-600 dark:text-gold-400 group-hover:scale-110 transition-transform">
                  <st.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CORE GAME FEATURES ================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/60 dark:bg-obsidian-900/50 border-t border-slate-200 dark:border-gold-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-gold-300 font-display">
              مميزات صممت خصيصاً للاعبين عبر الهواتف
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              تجربة لعب استثنائية وسلسة تضمن الخصوصية الكاملة وسهولة الاستخدام.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-noir-card border border-slate-200 dark:border-noir-border shadow-sm hover:border-amber-400 dark:hover:border-gold-500/40 transition duration-300 space-y-3 text-right"
              >
                <div className="inline-flex p-3 rounded-2xl bg-amber-50 dark:bg-obsidian-950 border border-amber-200 dark:border-gold-500/30 text-amber-600 dark:text-gold-400">
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-gold-400 font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-gold-300 font-display">
            كل ما تود معرفته عن Mafia Arena
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-noir-card/70 border border-slate-200 dark:border-noir-border text-right space-y-1.5 shadow-sm hover:border-amber-400 dark:hover:border-gold-500/30 transition"
            >
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-gold-300 font-display">{faq.q}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-gold-500/20 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white dark:from-obsidian-950 dark:via-noir-card dark:to-obsidian-950">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
            جاهز لبدء مغامرتك القادمة؟
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            أنشئ غرفتك الآن مجاناً، ادعُ أصدقاءك برابط مباشر، واستمتعوا بتحدي الذكاء الاجتماعي!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/room/create" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-3.5 font-bold shadow-lg">
                ابدأ بإنشاء غرفة الآن
              </Button>
            </Link>
            <Link href="/how-to-play" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3.5 text-white border-white/60 hover:bg-white/10">
                تعرف على القواعد الكاملة
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
