-- ========================================================
-- MAFIA ARENA — SEED DATA FOR 11 DEFAULT ROLES
-- ========================================================

INSERT INTO public.cards (
    slug, name_ar, name_en, team, image_url, back_image_url,
    description_ar, description_en, abilities_ar, abilities_en,
    special_rules, is_default, is_enabled, allow_duplicates, fit_mode,
    focal_point_x, focal_point_y, sort_order
) VALUES
(
    'mafia_boss', 'زعيم المافيا', 'Mafia Boss', 'mafia',
    '/images/cards/mafia_boss.png', '/images/cards/card-back.png',
    'رأس الهرم وعقل عصابة المافيا المدبر. كلمته هي الفيصل الحاسم عند اختلاف اختيارات أفراد المافيا ليلاً.',
    'The ruthless mastermind and godfather of the mob. Holds the casting vote whenever mafia members disagree on night targets.',
    'القرار النهائي ليلاً في تحديد الضحية، ولا يظهر للمحقق كعضو عادي في بعض القواعد المتقدمة.',
    'Has the decisive vote on night assassination targets; stealthy and authoritative.',
    '{"hasVetoPower": true, "revealsCardName": false}'::jsonb,
    true, true, false, 'contain', 50, 35, 1
),
(
    'mafia', 'المافيا', 'Mobster', 'mafia',
    '/images/cards/mafia.png', '/images/cards/card-back.png',
    'عضو أساسي في عصابة المافيا. يستيقظ ليلاً مع بقية رفاقه لاختيار ضحية واحدة للتخلص منها.',
    'A loyal member of the crime family. Wakes up at night with fellow mobsters to eliminate an innocent target.',
    'التشاور السري ليلاً والمشاركة في اختيار الضحية بالاقتراع المشترك.',
    'Secretly communicates and votes with other mafia members during the night phase.',
    '{"hasVetoPower": false}'::jsonb,
    true, true, true, 'contain', 50, 35, 2
),
(
    'silencer_mafia', 'مافيا التسكيت', 'The Silencer', 'mafia',
    '/images/cards/silencer_mafia.png', '/images/cards/card-back.png',
    'قاتل متسلل يملك القدرة على تكميم فم أحد اللاعبين ومنعه من التحدث تماماً في نهار اليوم التالي.',
    'A stealthy underworld enforcer who can intimidate and gag any player, silencing them completely during the next day discussion.',
    'يختار لاعباً ليلاً، فيُمنع هذا اللاعب من التحدث في مرحلة النقاش النهارية (ولكن يمكنه التصويت).',
    'Selects a player at night to silence them during the following day discussion phase (they may still vote).',
    '{"muteTargetNextDay": true}'::jsonb,
    true, true, false, 'contain', 50, 35, 3
),
(
    'bomber_mafia', 'مافيا القنبلة', 'The Bomber', 'mafia',
    '/images/cards/bomber_mafia.png', '/images/cards/card-back.png',
    'عضو مافيا انتحاري يحمل متفجرات موقوتة. عند إقصائه في التصويت النهاري يفجر عبوته ويسحب لاعبين معه.',
    'A volatile mob saboteur rigged with explosives. If eliminated during the daytime town vote, detonation pulls targets down with them.',
    'عند إقصائه نهاراً، تنفجر قنبلته لتسحب لاعباً مجاوراً أو محدداً وفق قواعد المباراة.',
    'Upon being voted out in daytime, their bomb explodes and eliminates designated or adjacent players.',
    '{"suicideBombCount": 1, "dragAlongRule": "player_choice"}'::jsonb,
    true, true, false, 'contain', 50, 35, 4
),
(
    'doctor', 'الدكتور', 'The Doctor', 'citizen',
    '/images/cards/doctor.png', '/images/cards/card-back.png',
    'طبيب المدينة المخلص. يخرج تحت جنح الظلام كل ليلة ليحقن أحد المواطنين ويحميه من رصاص المافيا.',
    'The dedicated town medic who braves the night to protect one player from assassination.',
    'حماية لاعب واحد كل ليلة من القتل. إذا هاجمت المافيا نفس اللاعب، ينجو ولا يموت أحد.',
    'Guards one player each night against assassination. If the mafia attacks that player, they survive.',
    '{"protectSelf": true, "canProtectConsecutive": false}'::jsonb,
    true, true, false, 'contain', 50, 35, 5
),
(
    'detective', 'المحقق', 'The Detective', 'citizen',
    '/images/cards/detective.png', '/images/cards/card-back.png',
    'المفتش الذكي الذي يتعقب خيوط الجريمة. يستيقظ ليلاً ليفحص هوية لاعب ويكتشف إن كان ينتمي لعصابة المافيا.',
    'A sharp film-noir investigator. Investigates one suspect each night to determine if they belong to the mafia.',
    'التحقق من هوية لاعب واحد كل ليلة، ويتلقى إجابة سرية فورية (مافيا / بريء).',
    'Investigates one suspect per night, receiving a private verdict: Mafia or Innocent.',
    '{"revealsCardName": false}'::jsonb,
    true, true, false, 'contain', 50, 35, 6
),
(
    'sniper', 'القناص', 'The Sniper', 'citizen',
    '/images/cards/sniper.png', '/images/cards/card-back.png',
    'حارس المدينة السري ذو البندقية الدقيقة. يملك رصاصات محدودة لإعدام مشتبه به في الليل دون انتظار المحاكمة.',
    'A vigilante sharpshooter with limited silver bullets. Can eliminate a suspected mobster under the cover of darkness.',
    'إطلاق رصاصة قاتلة في الليل على أي لاعب. لكن الحذر: قتل مواطن بريء قد يؤدي لعواقب وخيمة!',
    'Can fire a lethal shot at a chosen player at night. Firing at an innocent carries severe consequences.',
    '{"bulletCount": 1}'::jsonb,
    true, true, false, 'contain', 50, 35, 7
),
(
    'young_citizen', 'المواطن الشاب', 'The Young Rebel', 'citizen',
    '/images/cards/young_citizen.png', '/images/cards/card-back.png',
    'شاب شجاع يرفض الخنوع. إذا تم التصويت لإقصائه نهاراً، فإنه ينتقم ويسحب مشتبهاً به معه للقبر.',
    'A defiant and brave young civilian. If wrongfully lynched in the town square, he drags down his prime suspect with him.',
    'عند إقصائه بالتصويت النهاري، يختار لاعباً آخر ليتم إقصاؤه فوراً برفقته.',
    'Upon being voted out by the town, instantly eliminates one other player of their choice.',
    '{"dragAlongRule": "player_choice"}'::jsonb,
    true, true, false, 'contain', 50, 35, 8
),
(
    'mayor', 'العمدة', 'The Mayor', 'citizen',
    '/images/cards/mayor.png', '/images/cards/card-back.png',
    'شخصية قيادية ذات سلطة نافذة في المدينة. صوته في الاقتراع النهاري يزن ثلاثة أصوات حاسمة.',
    'The authoritative civic leader of the town. In daytime deliberations, their single vote carries the decisive weight of 3 votes.',
    'قوة تصويت مضاعفة تعادل (3 أصوات) في أي اقتراع نهاري للإقصاء.',
    'Their vote counts as 3 individual votes during town square daytime ballots.',
    '{"voteWeight": 3}'::jsonb,
    true, true, false, 'contain', 50, 35, 9
),
(
    'citizen', 'المواطن', 'Citizen', 'citizen',
    '/images/cards/citizen.png', '/images/cards/card-back.png',
    'أحد سكان المدينة الشرفاء. لا يمتلك قوى خارقة ليلاً، وسلاحه الوحيد هو الذكاء والتحليل والتصويت النهاري.',
    'An honest, law-abiding resident of the city. Possesses no night actions; relies entirely on deductive logic, vigilance, and the daytime vote.',
    'المشاركة في النقاش النهاري وتصويت الإقصاء للدفاع عن المدينة وكشف أعضاء المافيا.',
    'Active participation in daytime debate, suspicion sharing, and voting to expose the mafia.',
    '{}'::jsonb,
    true, true, true, 'contain', 50, 35, 10
),
(
    'judge', 'الحكم', 'The Arbiter', 'neutral',
    '/images/cards/judge.png', '/images/cards/card-back.png',
    'حكم محايد يسعى لحفظ التوازن في المحكمة. في حالات التعادل الشائك، يملك السلطة القضائية للفصل في الإقصاء.',
    'An impartial jurist dedicated to cosmic balance. Steps in during deadlock ties to render the final binding verdict.',
    'شخصية محايدة تفصل في حالات التعادل النهاري بين المتهمين بحكم بات.',
    'Neutral mediator with special gavel jurisdiction to break ties or orchestrate court decrees.',
    '{"tieBreakAuthority": true}'::jsonb,
    true, true, false, 'contain', 50, 35, 11
)
ON CONFLICT (slug) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    team = EXCLUDED.team,
    image_url = EXCLUDED.image_url,
    description_ar = EXCLUDED.description_ar,
    description_en = EXCLUDED.description_en,
    abilities_ar = EXCLUDED.abilities_ar,
    abilities_en = EXCLUDED.abilities_en,
    special_rules = EXCLUDED.special_rules,
    updated_at = NOW();

