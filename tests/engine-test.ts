// ========================================================
// MAFIA ARENA — AUTOMATED ENGINE TESTS (TypeScript)
// ========================================================

import { distributeRoles } from '../lib/game-engine/role-distributor';
import { resolveNightActions } from '../lib/game-engine/night-resolver';
import { tallyVotes } from '../lib/game-engine/vote-counter';
import { checkWinCondition } from '../lib/game-engine/win-checker';
import { roomStore } from '../lib/game-engine/room-store';
import { DEFAULT_ROLES } from '../lib/constants/default-roles';
import { RoomPlayer, CharacterRole } from '../lib/types/game';

let passed = 0;
let total = 0;

function assert(condition: boolean, name: string) {
  total++;
  if (!condition) {
    console.error(`❌ FAIL: ${name}`);
    process.exit(1);
  }
  passed++;
  console.log(`✅ PASS: ${name}`);
}

console.log('\n=============================================');
console.log(' MAFIA ARENA ENGINE VERIFICATION');
console.log('=============================================\n');

// 1. Distribution
const players = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
const dist = distributeRoles(players, DEFAULT_ROLES.map((r) => r.slug));
assert(dist.size === 8, '8 players assigned exactly 8 roles');

const roles = Array.from(dist.values());
const mafiaRoles = roles.filter((r) => r.team === 'mafia');
assert(mafiaRoles.length >= 1 && mafiaRoles.length <= 3, 'Mafia team balanced (1-3 members)');

// 2. Doctor Protection
const rolesMap = new Map<string, CharacterRole>();
rolesMap.set('doc', DEFAULT_ROLES[4]);
rolesMap.set('target', DEFAULT_ROLES[9]);
rolesMap.set('boss', DEFAULT_ROLES[0]);

const nightResult = resolveNightActions(
  [
    { game_id: 'g1', round_number: 1, actor_player_id: 'doc', action_type: 'protect', target_player_id: 'target' },
    { game_id: 'g1', round_number: 1, actor_player_id: 'boss', action_type: 'kill', target_player_id: 'target' },
  ],
  rolesMap
);
assert(nightResult.savedPlayerIds.includes('target'), 'Doctor successfully guarded victim');
assert(!nightResult.killedPlayerIds.includes('target'), 'Guarded victim is not killed');

// 3. Mayor Triple-Vote
const voteTally = tallyVotes([
  { game_id: 'g1', round_number: 1, voter_player_id: 'p1', target_player_id: 'suspect_a', vote_weight: 1 },
  { game_id: 'g1', round_number: 1, voter_player_id: 'p2', target_player_id: 'suspect_a', vote_weight: 1 },
  { game_id: 'g1', round_number: 1, voter_player_id: 'mayor', target_player_id: 'suspect_b', vote_weight: 3 },
]);
assert(voteTally.eliminatedPlayerId === 'suspect_b', 'Mayor 3x vote eliminates suspect B');

// 4. Win Condition Calculation
const mockPlayers: RoomPlayer[] = [
  { id: 'p1', room_id: 'r1', guest_token: 't1', display_name: 'P1', seat_order: 1, is_host: false, is_ready: true, is_alive: false, is_muted: false, connection_status: 'online', last_seen_at: '' },
  { id: 'p2', room_id: 'r1', guest_token: 't2', display_name: 'P2', seat_order: 2, is_host: false, is_ready: true, is_alive: true, is_muted: false, connection_status: 'online', last_seen_at: '' },
  { id: 'p3', room_id: 'r1', guest_token: 't3', display_name: 'P3', seat_order: 3, is_host: false, is_ready: true, is_alive: true, is_muted: false, connection_status: 'online', last_seen_at: '' },
];
rolesMap.set('p1', DEFAULT_ROLES[1]); // mafia (dead)
rolesMap.set('p2', DEFAULT_ROLES[9]); // citizen (alive)
rolesMap.set('p3', DEFAULT_ROLES[9]); // citizen (alive)

const win = checkWinCondition(mockPlayers, rolesMap);
assert(win.isGameOver && win.winnerTeam === 'citizen', 'Citizens win when all mafia dead');

// 5. Room Store Atomic Start & Secret Role Privacy
const room = roomStore.createRoom('HostTest');
const join2 = roomStore.joinRoom(room.code, 'GuestTest2');
const join3 = roomStore.joinRoom(room.code, 'GuestTest3');
const join4 = roomStore.joinRoom(room.code, 'GuestTest4');
assert(join2.success && join3.success && join4.success, 'Players joined');

const start = roomStore.startGame(room.code, room.guestToken);
assert(start.success, 'Game started successfully');

const hostRole = roomStore.getPlayerRole(room.code, room.guestToken);
const guestRole = roomStore.getPlayerRole(room.code, join2.guestToken!);
assert(hostRole.role !== null && guestRole.role !== null, 'Roles distributed');
// Verify strict privacy: Neither host nor guest can see any other player's card
assert((hostRole as Record<string, unknown>).allRolesIfLeader === undefined, 'Strict Secrecy: Host cannot view other players secret cards');
assert((guestRole as Record<string, unknown>).allRolesIfLeader === undefined, 'Guest cannot view secret roles of other players');

console.log('\n=============================================');
console.log(` ALL ${passed}/${total} AUTOMATED TESTS PASSED!`);
console.log('=============================================\n');

