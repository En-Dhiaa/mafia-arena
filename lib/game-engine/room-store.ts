import {
  GameState,
  RoomPlayer,
  RoomSettings,
  CharacterRole,
  NightActionPayload,
  VotePayload,
  PublicGameSnapshot,
  GamePhase,
} from '../types/game';
import { generateRoomCode, generateGuestToken } from '../utils/room-code';
import { DEFAULT_ROLES } from '../constants/default-roles';
import { distributeRoles } from './role-distributor';
import { resolveNightActions } from './night-resolver';
import { tallyVotes } from './vote-counter';
import { checkWinCondition } from './win-checker';

interface ActiveRoomData {
  id: string;
  code: string;
  status: 'LOBBY' | 'IN_GAME' | 'FINISHED' | 'CLOSED';
  settings: RoomSettings;
  created_at: string;
  players: RoomPlayer[];
  game: GameState;
  secretRoles: Map<string, CharacterRole>; // Confidential!
  nightActions: NightActionPayload[];
  votes: VotePayload[];
  eventsLog: Array<{
    id: string;
    event_type: string;
    description_ar: string;
    description_en: string;
    created_at: string;
  }>;
}

class RoomStore {
  private rooms: Map<string, ActiveRoomData> = new Map();

  constructor() {
    // Initialize with a demo room for quick testing if needed
  }

  public createRoom(
    hostName: string,
    customSettings?: Partial<RoomSettings>
  ): { code: string; guestToken: string; playerId: string } {
    let code = generateRoomCode();
    while (this.rooms.has(code)) {
      code = generateRoomCode();
    }

    const hostGuestToken = generateGuestToken();
    const hostPlayerId = 'p_' + Math.random().toString(36).substring(2, 9);
    const roomId = 'rm_' + Math.random().toString(36).substring(2, 9);

    const defaultSettings: RoomSettings = {
      language: 'ar',
      minPlayers: 4,
      maxPlayers: 16,
      discussionTimeSeconds: 0,
      votingTimeSeconds: 60,
      isPrivate: false,
      leaderMode: 'SUPERVISOR',
      assignLeaderOnFirstElimination: true,
      revealRoleOnDeath: true,
      allowDoctorSelfProtect: true,
      tieVotePolicy: 'no_elimination',
      enabledRoleSlugs: DEFAULT_ROLES.map((r) => r.slug),
      ...customSettings,
    };

    const hostPlayer: RoomPlayer = {
      id: hostPlayerId,
      room_id: roomId,
      guest_token: hostGuestToken,
      display_name: hostName.trim() || 'المضيف',
      avatar_url: `/images/cards/mafia_boss.png`,
      seat_order: 1,
      is_host: true,
      is_ready: true,
      is_alive: true,
      is_muted: false,
      connection_status: 'online',
      last_seen_at: new Date().toISOString(),
    };

    const newGame: GameState = {
      id: 'gm_' + Math.random().toString(36).substring(2, 9),
      room_id: roomId,
      round_number: 1,
      phase: 'LOBBY',
      phase_version: 1,
      current_speaker_index: 0,
      speaker_player_ids: [],
      leader_player_id: null,
      leader_mode: defaultSettings.leaderMode,
      winner_team: null,
      started_at: new Date().toISOString(),
    };

    const roomData: ActiveRoomData = {
      id: roomId,
      code,
      status: 'LOBBY',
      settings: defaultSettings,
      created_at: new Date().toISOString(),
      players: [hostPlayer],
      game: newGame,
      secretRoles: new Map(),
      nightActions: [],
      votes: [],
      eventsLog: [
        {
          id: 'ev_1',
          event_type: 'ROOM_CREATED',
          description_ar: `تم تأسيس الغرفة بواسطة ${hostPlayer.display_name}`,
          description_en: `Room created by ${hostPlayer.display_name}`,
          created_at: new Date().toISOString(),
        },
      ],
    };

    this.rooms.set(code, roomData);
    return { code, guestToken: hostGuestToken, playerId: hostPlayerId };
  }

  public joinRoom(
    code: string,
    playerName: string
  ): { success: boolean; guestToken?: string; playerId?: string; error?: string } {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) {
      return { success: false, error: 'رمز الغرفة غير موجود أو انتهت صلاحيتها' };
    }
    if (room.status !== 'LOBBY') {
      return { success: false, error: 'المباراة قد بدأت بالفعل، لا يمكن الانضمام الآن' };
    }
    if (room.players.length >= room.settings.maxPlayers) {
      return { success: false, error: 'الغرفة ممتلئة بالكامل' };
    }

    const guestToken = generateGuestToken();
    const playerId = 'p_' + Math.random().toString(36).substring(2, 9);

    const newPlayer: RoomPlayer = {
      id: playerId,
      room_id: room.id,
      guest_token: guestToken,
      display_name: playerName.trim() || `لاعب ${room.players.length + 1}`,
      avatar_url: `/images/cards/card-back.png`,
      seat_order: room.players.length + 1,
      is_host: false,
      is_ready: true,
      is_alive: true,
      is_muted: false,
      connection_status: 'online',
      last_seen_at: new Date().toISOString(),
    };

    room.players.push(newPlayer);
    room.eventsLog.push({
      id: 'ev_' + Math.random().toString(36).substring(2, 7),
      event_type: 'PLAYER_JOINED',
      description_ar: `انضم ${newPlayer.display_name} إلى الردهة`,
      description_en: `${newPlayer.display_name} joined the lobby`,
      created_at: new Date().toISOString(),
    });

    return { success: true, guestToken, playerId };
  }

  public getPublicSnapshot(code: string): PublicGameSnapshot | null {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) return null;

    const safePlayers = room.players.map(({ guest_token, ...safe }) => safe);
    const currentSpeakerId =
      room.game.speaker_player_ids[room.game.current_speaker_index] || null;

    return {
      game: room.game,
      players: safePlayers,
      currentSpeakerId,
      settings: room.settings,
      recentEvents: room.eventsLog.slice(-15),
    };
  }

  public getPlayerRole(
    code: string,
    guestToken: string
  ): {
    role: CharacterRole | null;
    isLeader: boolean;
    allRolesIfLeader?: Array<{ playerId: string; playerName: string; role: CharacterRole }>;
    teamMembersIfMafia?: Array<{ playerId: string; playerName: string }>;
  } {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) return { role: null, isLeader: false };

    const requestingPlayer = room.players.find((p) => p.guest_token === guestToken);
    if (!requestingPlayer) return { role: null, isLeader: false };

    const role = room.secretRoles.get(requestingPlayer.id) || null;
    const isLeader = room.game.leader_player_id === requestingPlayer.id;

    let allRolesIfLeader: Array<{ playerId: string; playerName: string; role: CharacterRole }> | undefined;
    if (isLeader) {
      allRolesIfLeader = room.players.map((p) => ({
        playerId: p.id,
        playerName: p.display_name,
        role: room.secretRoles.get(p.id) || DEFAULT_ROLES[9],
      }));
    }

    let teamMembersIfMafia: Array<{ playerId: string; playerName: string }> | undefined;
    if (role && role.team === 'mafia') {
      teamMembersIfMafia = room.players
        .filter((p) => {
          const r = room.secretRoles.get(p.id);
          return r && r.team === 'mafia';
        })
        .map((p) => ({ playerId: p.id, playerName: p.display_name }));
    }

    return { role, isLeader, allRolesIfLeader, teamMembersIfMafia };
  }

  public startGame(
    code: string,
    guestToken: string
  ): { success: boolean; error?: string } {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) return { success: false, error: 'الغرفة غير موجودة' };

    const host = room.players.find((p) => p.guest_token === guestToken);
    if (!host || !host.is_host) {
      return { success: false, error: 'المضيف فقط هو المخول ببدء المباراة' };
    }
    if (room.status !== 'LOBBY') {
      return { success: false, error: 'المباراة قد بدأت مسبقاً' };
    }
    if (room.players.length < room.settings.minPlayers) {
      return {
        success: false,
        error: `يلزم ${room.settings.minPlayers} لاعبين على الأقل لبدء المباراة`,
      };
    }

    // Distribute roles
    const playerIds = room.players.map((p) => p.id);
    const distributed = distributeRoles(playerIds, room.settings.enabledRoleSlugs);
    room.secretRoles = distributed;

    // Transition state
    room.status = 'IN_GAME';
    room.game.phase = 'ROLE_REVEAL';
    room.game.phase_version++;
    room.game.speaker_player_ids = playerIds;
    room.game.current_speaker_index = 0;

    room.eventsLog.push({
      id: 'ev_' + Math.random().toString(36).substring(2, 7),
      event_type: 'GAME_STARTED',
      description_ar: 'بدأت المباراة! وزّع النظام الأدوار السرية على جميع اللاعبين.',
      description_en: 'Game started! Secret roles have been distributed.',
      created_at: new Date().toISOString(),
    });

    return { success: true };
  }

  public advancePhase(
    code: string,
    guestToken: string,
    overrideLeader: boolean = false
  ): { success: boolean; nextPhase: GamePhase; error?: string } {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) return { success: false, nextPhase: 'LOBBY', error: 'الغرفة غير موجودة' };

    const player = room.players.find((p) => p.guest_token === guestToken);
    const isHost = player?.is_host;
    const isLeader = room.game.leader_player_id === player?.id;

    if (!isHost && !isLeader && !overrideLeader) {
      return { success: false, nextPhase: room.game.phase, error: 'غير مصرح لك بنقل المرحلة' };
    }

    const currentPhase = room.game.phase;
    let nextPhase: GamePhase = 'NIGHT_INTRO';

    if (currentPhase === 'ROLE_REVEAL' || currentPhase === 'LOBBY') {
      nextPhase = 'NIGHT_MAFIA';
    } else if (currentPhase === 'NIGHT_MAFIA') {
      nextPhase = 'NIGHT_DOCTOR';
    } else if (currentPhase === 'NIGHT_DOCTOR') {
      nextPhase = 'NIGHT_DETECTIVE';
    } else if (currentPhase === 'NIGHT_DETECTIVE') {
      // Resolve night actions before Day
      const resolution = resolveNightActions(room.nightActions, room.secretRoles);

      // Apply eliminations
      resolution.killedPlayerIds.forEach((killedId) => {
        const victim = room.players.find((p) => p.id === killedId);
        if (victim) {
          victim.is_alive = false;
          // Check if first eliminated player becomes Game Leader
          if (room.settings.assignLeaderOnFirstElimination && !room.game.leader_player_id) {
            room.game.leader_player_id = victim.id;
            room.eventsLog.push({
              id: 'ev_' + Math.random().toString(36).substring(2, 7),
              event_type: 'LEADER_ASSIGNED',
              description_ar: `أصبح ${victim.display_name} قائداً ومديراً للمباراة بعد إقصائه!`,
              description_en: `${victim.display_name} is now the Game Master!`,
              created_at: new Date().toISOString(),
            });
          }
        }
      });

      // Clear night actions
      room.nightActions = [];

      // Check win condition
      const winCheck = checkWinCondition(room.players, room.secretRoles);
      if (winCheck.isGameOver) {
        room.game.phase = 'GAME_OVER';
        room.game.winner_team = winCheck.winnerTeam;
        room.status = 'FINISHED';
        return { success: true, nextPhase: 'GAME_OVER' };
      }

      nextPhase = 'DAY_INTRO';
    } else if (currentPhase === 'DAY_INTRO') {
      // Set living players for discussion
      const livingIds = room.players.filter((p) => p.is_alive).map((p) => p.id);
      room.game.speaker_player_ids = livingIds;
      room.game.current_speaker_index = 0;
      nextPhase = 'DISCUSSION';
    } else if (currentPhase === 'DISCUSSION') {
      room.votes = [];
      nextPhase = 'VOTING';
    } else if (currentPhase === 'VOTING') {
      // Tally Votes
      const tally = tallyVotes(room.votes, room.settings.tieVotePolicy);

      if (tally.eliminatedPlayerId) {
        const victim = room.players.find((p) => p.id === tally.eliminatedPlayerId);
        if (victim) {
          victim.is_alive = false;
          room.eventsLog.push({
            id: 'ev_' + Math.random().toString(36).substring(2, 7),
            event_type: 'PLAYER_VOTED_OUT',
            description_ar: `صوّتت المدينة بالأغلبية لإقصاء ${victim.display_name}!`,
            description_en: `Town voted to eliminate ${victim.display_name}!`,
            created_at: new Date().toISOString(),
          });

          // Check if first eliminated becomes leader
          if (room.settings.assignLeaderOnFirstElimination && !room.game.leader_player_id) {
            room.game.leader_player_id = victim.id;
          }
        }
      }

      // Check win condition after voting
      const winCheck = checkWinCondition(room.players, room.secretRoles);
      if (winCheck.isGameOver) {
        room.game.phase = 'GAME_OVER';
        room.game.winner_team = winCheck.winnerTeam;
        room.status = 'FINISHED';
        return { success: true, nextPhase: 'GAME_OVER' };
      }

      // Increment round number and return to night
      room.game.round_number++;
      nextPhase = 'NIGHT_MAFIA';
    }

    room.game.phase = nextPhase;
    room.game.phase_version++;
    return { success: true, nextPhase };
  }

  public passSpeakerTurn(
    code: string,
    guestToken: string
  ): { success: boolean; nextSpeakerId: string | null; allFinished: boolean } {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) return { success: false, nextSpeakerId: null, allFinished: false };

    const player = room.players.find((p) => p.guest_token === guestToken);
    const isHost = player?.is_host;
    const isLeader = room.game.leader_player_id === player?.id;
    const currentSpeakerId =
      room.game.speaker_player_ids[room.game.current_speaker_index];

    // Current speaker or host or leader can pass
    if (player?.id !== currentSpeakerId && !isHost && !isLeader) {
      return { success: false, nextSpeakerId: null, allFinished: false };
    }

    const nextIndex = room.game.current_speaker_index + 1;
    if (nextIndex >= room.game.speaker_player_ids.length) {
      // Discussion completed -> auto transition to voting!
      room.game.phase = 'VOTING';
      room.game.phase_version++;
      return { success: true, nextSpeakerId: null, allFinished: true };
    }

    room.game.current_speaker_index = nextIndex;
    room.game.phase_version++;
    const nextSpeakerId = room.game.speaker_player_ids[nextIndex];
    return { success: true, nextSpeakerId, allFinished: false };
  }

  public submitNightAction(
    code: string,
    guestToken: string,
    action: {
      action_type: 'kill' | 'protect' | 'investigate' | 'snipe' | 'silence';
      target_player_id: string;
    }
  ): { success: boolean; result?: unknown; error?: string } {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) return { success: false, error: 'الغرفة غير موجودة' };

    const player = room.players.find((p) => p.guest_token === guestToken);
    if (!player || !player.is_alive) {
      return { success: false, error: 'غير مصرح لك بتنفيذ هذا الفعل' };
    }

    const role = room.secretRoles.get(player.id);
    if (!role) return { success: false, error: 'الدور غير متاح' };

    // Prevent duplicate action per player in same round
    room.nightActions = room.nightActions.filter((a) => a.actor_player_id !== player.id);

    room.nightActions.push({
      game_id: room.game.id,
      round_number: room.game.round_number,
      actor_player_id: player.id,
      action_type: action.action_type,
      target_player_id: action.target_player_id,
    });

    // If Detective, return instant secret verdict
    if (action.action_type === 'investigate') {
      const targetRole = room.secretRoles.get(action.target_player_id);
      const isMafia = targetRole ? targetRole.team === 'mafia' : false;
      return { success: true, result: { targetIsMafia: isMafia } };
    }

    return { success: true };
  }

  public castVote(
    code: string,
    guestToken: string,
    targetPlayerId: string
  ): { success: boolean; error?: string } {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) return { success: false, error: 'الغرفة غير موجودة' };

    const player = room.players.find((p) => p.guest_token === guestToken);
    if (!player || !player.is_alive) {
      return { success: false, error: 'لا يمكن للاعب مقصي التصويت' };
    }

    const role = room.secretRoles.get(player.id);
    const voteWeight = role?.special_rules?.voteWeight || 1; // Mayor gets 3 votes

    // Overwrite any existing vote by this player in current round
    room.votes = room.votes.filter((v) => v.voter_player_id !== player.id);

    room.votes.push({
      game_id: room.game.id,
      round_number: room.game.round_number,
      voter_player_id: player.id,
      target_player_id: targetPlayerId,
      vote_weight: voteWeight,
    });

    return { success: true };
  }

  public getAllActiveRooms() {
    return Array.from(this.rooms.values()).map((r) => ({
      id: r.id,
      code: r.code,
      status: r.status,
      playerCount: r.players.length,
      maxPlayers: r.settings.maxPlayers,
      roundNumber: r.game.round_number,
      phase: r.game.phase,
      created_at: r.created_at,
    }));
  }
}

// Global Singleton for in-memory game engine
export const roomStore = new RoomStore();
