# دليل النشر والاستضافة السحابية — Mafia Arena
## Deployment Guide & Cloud Hosting Setup

---

## 1. النشر على منصة Vercel (الخيار الموصى به)

منصة Vercel هي البيئة الأمثل لتطبيقات **Next.js App Router**، وتوفر دعماً كاملاً لوظائف الخادم (Server Actions & Route Handlers).

### خطوات النشر في Vercel:

1. ادخل إلى حسابك في [Vercel Dashboard](https://vercel.com/new).
2. اضغط على زر **Import Git Repository**.
3. اختر المستودع الخاص: `En-Dhiaa/mafia-arena`.
4. تأكد من تحديد:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
5. أضف متغيرات البيئة (Environment Variables) كما هو موضح أدناه:
   - `NEXT_PUBLIC_APP_URL` = `https://your-domain.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL` = رابط مشروع Supabase الخاص بك
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = المفتاح العام anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = المفتاح السري service_role
   - `ADMIN_SETUP_SECRET` = مفتاح تأمين لوحة الإدارة
6. اضغط على **Deploy**.
7. بعد اكتمال البناء (Build)، سيصبح الموقع متاحاً على رابط عالمي سريع.

---

## 2. النشر على منصة Netlify

يدعم المشروع النشر السريع أيضاً على منصة Netlify عبر المكون الإضافي الرسمي `@netlify/plugin-nextjs`.

1. ادخل إلى [Netlify App](https://app.netlify.com/start).
2. اربط حساب GitHub واختر مستودع `En-Dhiaa/mafia-arena`.
3. اضبط إعدادات البناء:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
4. أضف نفس متغيرات البيئة في قسم **Environment Variables**.
5. اضغط **Deploy Site**.

---

## 3. إعداد قاعدة بيانات Supabase المجانية

1. أنشئ حساباً مجانياً على [Supabase](https://supabase.com).
2. أنشئ مشروعاً جديداً باسم `mafia-arena`.
3. ادخل إلى قسم **SQL Editor**.
4. انسخ محتوى الملف `supabase/migrations/20261102000000_initial_mafia_schema.sql` واضغط **Run**.
5. انسخ محتوى الملف `supabase/seed.sql` لتعبئة البطاقات الـ 11 الافتراضية واضغط **Run**.
6. في قسم **Settings -> API**، انسخ:
   - `Project URL` وضعه في `NEXT_PUBLIC_SUPABASE_URL`.
   - `anon public key` وضعه في `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - `service_role secret` وضعه في `SUPABASE_SERVICE_ROLE_KEY`.

---

## 4. العمل الفوري بدون إعداد قاعدة بيانات (Local / Fallback Mode)

تم تصميم اللعبة بنظام **Dual Engine Architecture**:
- إذا لم يتم إدخال مفاتيح Supabase، فإن اللعبة تعمل تلقائياً وبكفاءة 100% باستخدام محرك الذاكرة المدمج فائق السرعة والموثوقية (`RoomStore`).
- هذا يتيح لك تجربة اللعب الجماعي الفعلي بين عدة متصفحات أو أجهزة فوراً وبدون أي اشتراكات أو بطاقات ائتمانية.

