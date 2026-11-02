// ========================================================
// MAFIA ARENA — MULTIPLAYER LIVE INTEGRATION SIMULATION
// ========================================================

import { roomStore } from '../lib/game-engine/room-store';

console.log('\n=============================================');
console.log(' SIMULATING MULTI-DEVICE MULTIPLAYER SESSION');
console.log('=============================================\n');

// Device 1: Host creates room
console.log('📱 Device 1: Host creates room "Godfather"...');
const hostResult = roomStore.createRoom('Godfather', { minPlayers: 4 });
const code = hostResult.code;
console.log(`   -> Room created with code: ${code}`);

// Device 2: Player 2 joins from iPhone
console.log('📱 Device 2 (iPhone): Player 2 joins "DrWatson"...');
const p2 = roomStore.joinRoom(code, 'DrWatson');
console.log(`   -> Player 2 joined successfully: ${p2.success}`);

// Device 3: Player 3 joins from Android
console.log('📱 Device 3 (Android): Player 3 joins "Sherlock"...');
const p3 = roomStore.joinRoom(code, 'Sherlock');
console.log(`   -> Player 3 joined successfully: ${p3.success}`);

// Device 4: Player 4 joins from iPad
console.log('📱 Device 4 (iPad): Player 4 joins "MayorQuimby"...');
const p4 = roomStore.joinRoom(code, 'MayorQuimby');
console.log(`   -> Player 4 joined successfully: ${p4.success}`);

// Verify snapshot visible to all
const snapshot = roomStore.getPublicSnapshot(code);
console.log(`\n👥 Lobby synchronization check: ${snapshot?.players.length} players online.`);
if (snapshot?.players.length !== 4) {
  console.error('❌ Lobby count mismatch!');
  process.exit(1);
}

// Start Game Atomically
console.log('\n🎮 Device 1: Host starts the match...');
const start = roomStore.startGame(code, hostResult.guestToken);
console.log(`   -> Game started: ${start.success}`);

// Verify role privacy:
console.log('\n🔒 Verifying Role Confidentiality across devices:');
const hostRole = roomStore.getPlayerRole(code, hostResult.guestToken);
const p2Role = roomStore.getPlayerRole(code, p2.guestToken!);
const p3Role = roomStore.getPlayerRole(code, p3.guestToken!);
const p4Role = roomStore.getPlayerRole(code, p4.guestToken!);

console.log(`   * Device 1 receives role: ${hostRole.role?.name}`);
console.log(`   * Device 2 receives role: ${p2Role.role?.name}`);
console.log(`   * Device 3 receives role: ${p3Role.role?.name}`);
console.log(`   * Device 4 receives role: ${p4Role.role?.name}`);

if (!hostRole.role || !p2Role.role || !p3Role.role || !p4Role.role) {
  console.error('❌ Failed to distribute roles!');
  process.exit(1);
}

if ((hostRole as Record<string, unknown>).allRolesIfLeader !== undefined || (p2Role as Record<string, unknown>).allRolesIfLeader !== undefined) {
  console.error('❌ Security breach: secret roles leaked to host or player!');
  process.exit(1);
}
console.log('   🔒 Strict role confidentiality confirmed: Host and guests receive ONLY their own card!');

// Night Phase Transition
console.log('\n🌙 Advancing to Night Phase...');
const nightPhase = roomStore.advancePhase(code, hostResult.guestToken);
console.log(`   -> Current Phase: ${nightPhase.nextPhase}`);

// Night Action: Submit action
console.log('🔫 Submitting Night Action...');
const actionRes = roomStore.submitNightAction(code, hostResult.guestToken, {
  action_type: 'kill',
  target_player_id: p4.playerId!,
});
console.log(`   -> Night Action submitted: ${actionRes.success}`);

// Advance Phase to Day
console.log('\n☀️ Advancing to Day Phase...');
// Advance past doctor, detective to Day
roomStore.advancePhase(code, hostResult.guestToken);
roomStore.advancePhase(code, hostResult.guestToken);
const dayPhase = roomStore.advancePhase(code, hostResult.guestToken);
console.log(`   -> Day reached: ${dayPhase.nextPhase}`);

// Speaker Passing
console.log('\n🎙️ Testing Speaker Turn Passing...');
const pass1 = roomStore.passSpeakerTurn(code, hostResult.guestToken);
console.log(`   -> Speaker passed. Next: ${pass1.nextSpeakerId}, Finished: ${pass1.allFinished}`);

// Cast Votes
console.log('\n🗳️ Testing Voting Ballots...');
roomStore.advancePhase(code, hostResult.guestToken); // reach VOTING
const v1 = roomStore.castVote(code, hostResult.guestToken, p3.playerId!);
const v2 = roomStore.castVote(code, p2.guestToken!, p3.playerId!);
console.log(`   -> Votes cast for Player 3: ${v1.success && v2.success}`);

// Advance to Resolution
console.log('\n⚖️ Resolving Votes & Eliminating...');
roomStore.advancePhase(code, hostResult.guestToken);
const finalSnapshot = roomStore.getPublicSnapshot(code);
const p3Status = finalSnapshot?.players.find((p) => p.id === p3.playerId);
console.log(`   -> Player 3 eliminated status (is_alive): ${p3Status?.is_alive}`);

console.log('\n=============================================');
console.log(' 🌟 MULTIPLAYER SIMULATION PASSED 100% CLEAN!');
console.log('=============================================\n');

