# بنية ومعمارية نظام Mafia Arena
## System Architecture & Technical Specifications

---

## 1. المعمارية العامة (Architecture Overview)

يعتمد مشروع **Mafia Arena** على نمط **Server-Authoritative State Machine** مع واجهات عميل تفاعلية بالكامل مبنية بتقنيات الويب الحديثة.

```mermaid
graph TD
    UserClient[متصفح العميل / هواتف وحواسيب]
    NextApp[Next.js 15 App Router]
    GameEngine[محرك اللعبة Server Authoritative Engine]
    StoreLayer[(طبقة الحالة المزدوجة RoomStore / Supabase)]
    AudioSynth[Web Audio API Synthesizer]

    UserClient --> NextApp
    UserClient --> AudioSynth
    NextApp --> GameEngine
    GameEngine --> StoreLayer
```

---

## 2. آلة حالات المباراة (State Machine Phases)

```mermaid
stateDiagram-v2
    [*] --> LOBBY
    LOBBY --> ROLE_DISTRIBUTION : اكتمال اللاعبين وضغط البدء
    ROLE_DISTRIBUTION --> ROLE_REVEAL : توزيع مشفر في الخادم
    ROLE_REVEAL --> NIGHT_MAFIA : بدء الليل وتفعيل النوار
    NIGHT_MAFIA --> NIGHT_DOCTOR : اختيار الضحية
    NIGHT_DOCTOR --> NIGHT_DETECTIVE : اختيار الحماية
    NIGHT_DETECTIVE --> DAY_INTRO : حل أفعال الليل والإعلان
    DAY_INTRO --> DISCUSSION : شروق الشمس والضوء النهاري
    DISCUSSION --> VOTING : تسليم الأدوار وانتهائها
    VOTING --> ELIMINATION : احتساب الأصوات وقوة العمدة
    ELIMINATION --> NIGHT_MAFIA : استمرار المباراة وتعيين القائد
    ELIMINATION --> GAME_OVER : تحقق شرط فوز المافيا أو المواطنين
    GAME_OVER --> [*]
```

---

## 3. مبادئ الأمان والسرية (Security Model)

1. **حماية بطاقة الدور السري:**
   لا يتم بث جدول الأدوار الكامل لأي جهاز عادي عبر الـ Network payloads. يستعلم كل لاعب بطاقته الفردية فقط عبر `/api/game/role` مع التحقق من صحة `guestToken`.
2. **صلاحية القائد (Game Master):**
   عند إقصاء أول لاعب، يُسجل في الخادم كـ `leader_player_id`. الخادم هو من يقرر إرسال قائمة هويات اللاعبين في استعلام الدور للقائد فقط.
3. **منع التكرار (Idempotency):**
   كل فعل ليلي أو تصويت يتم قفله بمفتاح فريد يمنع تكراره في نفس الجولة.
