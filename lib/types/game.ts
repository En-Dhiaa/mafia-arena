// ========================================================
// MAFIA ARENA — CORE TYPE DEFINITIONS
// ========================================================

export type TeamType = 'mafia' | 'citizen' | 'neutral';

export type GamePhase =
  | 'LOBBY'
  | 'ROLE_DISTRIBUTION'
  | 'ROLE_REVEAL'
  | 'NIGHT_INTRO'
  | 'NIGHT_MAFIA'
  | 'NIGHT_DOCTOR'
  | 'NIGHT_DETECTIVE'
  | 'NIGHT_SNIPER'
  | 'NIGHT_RESOLUTION'
  | 'DAY_INTRO'
  | 'DISCUSSION'
  | 'VOTING'
  | 'VOTE_RESOLUTION'
  | 'ELIMINATION'
  | 'GAME_OVER';

export type LeaderMode = 'SUPERVISOR' | 'CONTROLLER';

export type FitMode = 'contain' | 'cover';

export interface CardSpecialRules {
  protectSelf?: boolean;
  canProtectConsecutive?: boolean;
  bulletCount?: number;
  revealsCardName?: boolean;
  suicideBombCount?: number; // for bomber mafia
  dragAlongRule?: 'player_choice' | 'leader_choice' | 'random';
  voteWeight?: number;
  [key: string]: unknown;
}

export interface CharacterRole {
  id: string;
  slug: string;
  name: string;
  name_en: string;
  team: TeamType;
  image_url: string;
  back_image_url?: string;
  description: string;
  description_en: string;
  abilities: string;
  abilities_en: string;
  special_rules: CardSpecialRules;
  is_default: boolean;
  is_enabled: boolean;
  allow_duplicates: boolean;
  fit_mode: FitMode;
  focal_point_x?: number; // 0 to 100 percentage
  focal_point_y?: number; // 0 to 100 percentage
  sort_order: number;
}

export interface RoomSettings {
  language: 'ar' | 'en';
  minPlayers: number;
  maxPlayers: number;
  discussionTimeSeconds: number; // 0 for manual passing
  votingTimeSeconds: number;
  isPrivate: boolean;
  leaderMode: LeaderMode;
  assignLeaderOnFirstElimination: boolean;
  revealRoleOnDeath: boolean;
  allowDoctorSelfProtect: boolean;
  tieVotePolicy: 'revote' | 'no_elimination' | 'leader_decides';
  enabledRoleSlugs: string[];
}

export interface RoomPlayer {
  id: string;
  room_id: string;
  user_id?: string;
  guest_token: string;
  display_name: string;
  avatar_url?: string;
  seat_order: number;
  is_host: boolean;
  is_ready: boolean;
  is_alive: boolean;
  is_muted: boolean; // silencer effect
  connection_status: 'online' | 'disconnected';
  last_seen_at: string;
}

export interface PlayerSecretRole {
  player_id: string;
  game_id: string;
  role: CharacterRole;
  assigned_at: string;
}

export interface NightActionPayload {
  game_id: string;
  round_number: number;
  actor_player_id: string;
  action_type: 'kill' | 'protect' | 'investigate' | 'snipe' | 'silence';
  target_player_id: string;
}

export interface VotePayload {
  game_id: string;
  round_number: number;
  voter_player_id: string;
  target_player_id: string; // or 'abstain'
  vote_weight: number;
}

export interface GameState {
  id: string;
  room_id: string;
  round_number: number;
  phase: GamePhase;
  phase_version: number;
  current_speaker_index: number;
  speaker_player_ids: string[];
  leader_player_id: string | null;
  leader_mode: LeaderMode;
  winner_team: TeamType | null;
  started_at: string;
  ended_at?: string;
}

export interface NightResolutionResult {
  killedPlayerIds: string[];
  savedPlayerIds: string[];
  investigationResults: {
    detectivePlayerId: string;
    targetPlayerId: string;
    targetIsMafia: boolean;
  }[];
  silencedPlayerId: string | null;
  eventsLog: string[];
}

export interface PublicGameSnapshot {
  game: GameState;
  players: Omit<RoomPlayer, 'guest_token'>[];
  currentSpeakerId: string | null;
  settings: RoomSettings;
  recentEvents: Array<{
    id: string;
    event_type: string;
    description_ar: string;
    description_en: string;
    created_at: string;
  }>;
}
