-- ========================================================
-- MAFIA ARENA — COMPLETE POSTGRESQL & SUPABASE MIGRATION
-- ========================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    preferred_locale TEXT DEFAULT 'ar' CHECK (preferred_locale IN ('ar', 'en')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    host_user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'LOBBY' CHECK (status IN ('LOBBY', 'IN_GAME', 'FINISHED', 'CLOSED')),
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rooms_code ON public.rooms(code);

-- 3. Room Players Table
CREATE TABLE IF NOT EXISTS public.room_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    guest_token TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    seat_order INT NOT NULL DEFAULT 1,
    is_host BOOLEAN NOT NULL DEFAULT false,
    is_ready BOOLEAN NOT NULL DEFAULT true,
    is_alive BOOLEAN NOT NULL DEFAULT true,
    is_muted BOOLEAN NOT NULL DEFAULT false,
    connection_status TEXT NOT NULL DEFAULT 'online' CHECK (connection_status IN ('online', 'disconnected')),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_room_player_guest UNIQUE (room_id, guest_token)
);
CREATE INDEX IF NOT EXISTS idx_room_players_room ON public.room_players(room_id);

-- 4. Games Table
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    round_number INT NOT NULL DEFAULT 1,
    phase TEXT NOT NULL DEFAULT 'LOBBY',
    phase_version INT NOT NULL DEFAULT 1,
    leader_player_id UUID,
    leader_mode TEXT NOT NULL DEFAULT 'SUPERVISOR' CHECK (leader_mode IN ('SUPERVISOR', 'CONTROLLER')),
    winner_team TEXT CHECK (winner_team IN ('mafia', 'citizen', 'neutral')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_games_room ON public.games(room_id);

-- 5. Cards & Roles Catalog Table
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    team TEXT NOT NULL CHECK (team IN ('mafia', 'citizen', 'neutral')),
    image_url TEXT NOT NULL,
    back_image_url TEXT DEFAULT '/images/cards/card-back.png',
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    abilities_ar TEXT NOT NULL,
    abilities_en TEXT NOT NULL,
    special_rules JSONB DEFAULT '{}'::jsonb,
    is_default BOOLEAN NOT NULL DEFAULT true,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    allow_duplicates BOOLEAN NOT NULL DEFAULT false,
    fit_mode TEXT NOT NULL DEFAULT 'contain' CHECK (fit_mode IN ('contain', 'cover')),
    focal_point_x INT DEFAULT 50,
    focal_point_y INT DEFAULT 35,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Player Roles Table (CRITICAL CONFIDENTIAL SECURITY)
CREATE TABLE IF NOT EXISTS public.player_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.room_players(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES public.cards(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_player_role UNIQUE (game_id, player_id)
);
CREATE INDEX IF NOT EXISTS idx_player_roles_game ON public.player_roles(game_id);

-- 7. Night Actions Table (Confidential)
CREATE TABLE IF NOT EXISTS public.night_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    round_number INT NOT NULL DEFAULT 1,
    actor_player_id UUID NOT NULL REFERENCES public.room_players(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('kill', 'protect', 'investigate', 'snipe', 'silence')),
    target_player_id UUID NOT NULL REFERENCES public.room_players(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'RESOLVED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_actor_round_action UNIQUE (game_id, round_number, actor_player_id)
);

-- 8. Votes Table
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    round_number INT NOT NULL DEFAULT 1,
    voter_player_id UUID NOT NULL REFERENCES public.room_players(id) ON DELETE CASCADE,
    target_player_id TEXT NOT NULL, -- player UUID or 'abstain'
    vote_weight INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_voter_round UNIQUE (game_id, round_number, voter_player_id)
);

-- 9. Game Events & Audit Log Table
CREATE TABLE IF NOT EXISTS public.game_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    actor_player_id UUID,
    payload_public JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Assets Management Table
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type TEXT NOT NULL CHECK (asset_type IN ('card', 'audio', 'avatar', 'branding', 'background')),
    name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Admin Roles Table
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'GAME_ADMIN' CHECK (role IN ('SUPER_ADMIN', 'CONTENT_ADMIN', 'GAME_ADMIN')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.night_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Public can read active rooms & public games
CREATE POLICY "Public read rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Public create rooms" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read room players" ON public.room_players FOR SELECT USING (true);
CREATE POLICY "Public insert room players" ON public.room_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public read cards" ON public.cards FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public read events" ON public.game_events FOR SELECT USING (true);
CREATE POLICY "Public read assets" ON public.assets FOR SELECT USING (true);

-- CONFIDENTIAL POLICIES:
-- Player roles can only be read by authorized service_role or server API.
-- Direct client access to player_roles is prohibited to prevent leaking secret identities.

