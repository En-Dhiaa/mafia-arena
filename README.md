# Mafia Arena — مافيا أرينا
> **لعبة الاستنتاج الاجتماعي الجماعية والخدائع الليلية عبر الإنترنت**  
> *The Ultimate Real-Time Multiplayer Social Deduction Web Game*

---

## 📖 نظرة عامة (Overview)

**Mafia Arena (مافيا أرينا)** هو تطبيق ويب متكامل للألعاب الاجتماعية الجماعية (Social Deduction Party Game)، مستوحى من ألعاب المافيا والـ Werewolf الكلاسيكية وأجواء النوار السينمائية الفاخرة (1920s Dark Noir / Speakeasy).

تم تصميم اللعبة بنهج **Mobile-First Portrait** لتعمل مباشرة عبر متصفحات الهواتف والحواسيب دون الحاجة لتثبيت أي تطبيق، مع دعم كامل للغتين **العربية (RTL)** و**الإنجليزية (LTR)**، ونظام مزامنة لحظي، ومحرك ألعاب خادمي آمن وصارم (Server-Authoritative Game Engine).

---

## ✨ المميزات الرئيسية (Key Features)

1. **تصميم Mobile-First بالوضع الرأسي:** واجهات عمودية مريحة لشاشات الهواتف، وتجاوب سلس على الحواسيب والأجهزة اللوحية.
2. **11 شخصية وبطاقة أصلية فاخرة:**
   - **المافيا:** زعيم المافيا، المافيا، مافيا التسكيت، مافيا القنبلة.
   - **المواطنون:** الدكتور، المحقق، القناص، المواطن الشاب، العمدة، المواطن.
   - **محايد:** الحكم (The Arbiter).
3. **بطاقات ثلاثية الأبعاد تفاعلية (3D Flip Animation):** كشف البطاقة بلمس الشاشة مع حماية الخصوصية ومنع قص وجوه الشخصيات بفضل نظام `Fit Mode & Focal Point`.
4. **التحول السينمائي بين الليل والنهار:** انتقال متدرج للواجهة إلى النوار الداكن عند الليل مع إضاءة خافتة وموسيقى مطر، والعودة للنهار عند شروق الشمس.
5. **نظام المتحدث المبتكر:** ميكروفون متحرك ومؤشر واضح لصاحب الدور، وزر تسليم الدور دون مؤقت إجباري يقطع حديث اللاعبين.
6. **ميزة قائد اللعبة (Game Master):** أول لاعب يتم إقصاؤه يصبح تلقائياً قائد ومدير المباراة ليشرف على الجولات ويتابع الأحداث بنزاهة.
7. **لوحة تحكم إدارية كاملة (`/admin`):**
   - تعديل أسماء وقدرات وصور الشخصيات ومعاينتها فورياً.
   - مراقبة الغرف المفتوحة والمباريات النشطة.
   - مكتبة للأصول والخلفيات والشعارات.
   - ضبط قواعد التعادل والأمان.
8. **نظام صوتي رقمي ذكي (Web Audio API Synthesizer):** توليد مؤثرات صوتية لحظية لكشف البطاقات والمطرقة والإقصاء والفوز دون استهلاك باقة الإنترنت.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend:** [Next.js 15](https://nextjs.org) (App Router), React 19, TypeScript, [Tailwind CSS](https://tailwindcss.com), [Framer Motion](https://www.framer.com/motion), [Lucide React](https://lucide.dev).
- **Backend & Database:** PostgreSQL, [Supabase](https://supabase.com) (Realtime & RLS), Server Actions & Route Handlers.
- **Audio:** Web Audio API Native Synthesizer with local storage controls.
- **Deployment:** [Vercel](https://vercel.com) & [Netlify](https://netlify.com) Ready.

---

## 🚀 طريقة التشغيل محلياً (Local Development)

### 1. تثبيت الحزم:
```bash
npm install
```

### 2. فحص الأنواع وتشغيل الاختبارات:
```bash
npm run typecheck
npm test
```

### 3. تشغيل خادم التطوير:
```bash
npm run dev
```
افتح المتصفح على: `http://localhost:3000`

### 4. بناء نسخة الإنتاج:
```bash
npm run build
npm start
```

---

## 🔐 إعداد متغيرات البيئة (Environment Variables)

انسخ ملف المتغيرات النموذجي:
```bash
cp .env.example .env.local
```

املأ القيم المطلوبة:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ADMIN_SETUP_SECRET=your-secure-admin-secret
```

> **ملاحظة معمارية هامة:** في حال عدم توفر مفاتيح Supabase، فإن اللعبة تعمل تلقائياً وبكفاءة 100% عبر محرك الذاكرة المدمج (`RoomStore`) للتجربة السريعة والفورية.

---

## 🗄️ إعداد قاعدة بيانات Supabase (Migrations)

1. أنشئ مشروعاً جديداً على منصة Supabase.
2. ادخل إلى **SQL Editor** ونفّذ ملف الترحيل:
   `supabase/migrations/20261102000000_initial_mafia_schema.sql`
3. نفّذ ملف البيانات الأولية لتعبئة البطاقات الـ 11 الافتراضية:
   `supabase/seed.sql`

---

## 🌐 النشر السحابي (Deployment)

راجع دليل النشر التفصيلي في:
`docs/DEPLOYMENT.md`

- **Vercel:** استورد المستودع `En-Dhiaa/mafia-arena`، أضف متغيرات البيئة، واضغط Deploy.
- **Netlify:** استورد المستودع مع أمر البناء `npm run build` ومجلد النشر `.next`.

---

## 📚 وثائق المشروع (Project Documentation)

- [تقرير البحث والهوية البصرية](docs/DESIGN_RESEARCH.md)
- [سجل مصادر الأصول والتراخيص](docs/ASSET_SOURCES.md)
- [المعمارية وهيكل النظام](docs/ARCHITECTURE.md)
- [القواعد الرسمية للعبة](docs/GAME_RULES.md)
- [قاعدة البيانات وسياسات الأمان](docs/DATABASE.md)
- [دليل النشر والاستضافة](docs/DEPLOYMENT.md)
- [سجل حالة المشروع والتحقق](docs/PROJECT_STATUS.md)

---

## 📄 الترخيص (License)
جميع الحقوق محفوظة للمطور **En-Dhiaa** &copy; 2026.
الأيقونات مرخصة تحت رخصة MIT من مكتبة Lucide.
الخطوط مرخصة تحت SIL Open Font License من Google Fonts.
الأصول الفنية الأصلية مصممة خصيصاً لمشروع Mafia Arena.

