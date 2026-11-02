// ========================================================
// MAFIA ARENA — AUTOMATED GAME ENGINE TEST SUITE
// ========================================================

const { distributeRoles } = require('../lib/game-engine/role-distributor.ts');
const { resolveNightActions } = require('../lib/game-engine/night-resolver.ts');
const { tallyVotes } = require('../lib/game-engine/vote-counter.ts');
const { checkWinCondition } = require('../lib/game-engine/win-checker.ts');
const { roomStore } = require('../lib/game-engine/room-store.ts');
const { DEFAULT_ROLES } = require('../lib/constants/default-roles.ts');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  passedTests++;
  console.log(`✅ PASS: ${message}`);
}

console.log('\n=============================================');
console.log(' RUNNING MAFIA ARENA GAME ENGINE TESTS');
console.log('=============================================\n');

// Test 1: Role Distribution Count & Balance
{
  const players = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
  const enabledSlugs = DEFAULT_ROLES.map((r) => r.slug);
  const distributed = distributeRoles(players, enabledSlugs);

  assert(distributed.size === 8, 'Distributed role count exactly equals player count (8)');

  const roles = Array.from(distributed.values());
  const mafiaCount = roles.filter((r) => r.team === 'mafia').length;
  const citizenCount = roles.filter((r) => r.team === 'citizen').length;

  assert(mafiaCount >= 1 && mafiaCount <= 3, `Mafia count is balanced for 8 players (${mafiaCount})`);
  assert(citizenCount >= 5, `Citizen count is balanced for 8 players (${citizenCount})`);

  // Ensure unique cards are not duplicated
  const uniqueSlugs = ['mafia_boss', 'doctor', 'detective', 'mayor', 'sniper'];
  uniqueSlugs.forEach((slug) => {
    const matches = roles.filter((r) => r.slug === slug);
    assert(matches.length <= 1, `Unique card '${slug}' is never duplicated (found ${matches.length})`);
  });
}

// Test 2: Doctor Protection Saves Victim
{
  const rolesMap = new Map();
  rolesMap.set('doc_id', DEFAULT_ROLES.find((r) => r.slug === 'doctor'));
  rolesMap.set('target_id', DEFAULT_ROLES.find((r) => r.slug === 'citizen'));
  rolesMap.set('mafia_id', DEFAULT_ROLES.find((r) => r.slug === 'mafia_boss'));

  const actions = [
    {
      game_id: 'g1',
      round_number: 1,
      actor_player_id: 'doc_id',
      action_type: 'protect',
      target_player_id: 'target_id',
    },
    {
      game_id: 'g1',
      round_number: 1,
      actor_player_id: 'mafia_id',
      action_type: 'kill',
      target_player_id: 'target_id',
    },
  ];

  const result = resolveNightActions(actions, rolesMap);
  assert(result.savedPlayerIds.includes('target_id'), 'Doctor successfully saved victim from assassination');
  assert(!result.killedPlayerIds.includes('target_id'), 'Saved player is not in killed list');
}

// Test 3: Detective Investigation
{
  const rolesMap = new Map();
  rolesMap.set('det_id', DEFAULT_ROLES.find((r) => r.slug === 'detective'));
  rolesMap.set('mafia_target', DEFAULT_ROLES.find((r) => r.slug === 'mafia_boss'));
  rolesMap.set('citizen_target', DEFAULT_ROLES.find((r) => r.slug === 'citizen'));

  const actions = [
    {
      game_id: 'g1',
      round_number: 1,
      actor_player_id: 'det_id',
      action_type: 'investigate',
      target_player_id: 'mafia_target',
    },
    {
      game_id: 'g1',
      round_number: 1,
      actor_player_id: 'det_id',
      action_type: 'investigate',
      target_player_id: 'citizen_target',
    },
  ];

  const result = resolveNightActions(actions, rolesMap);
  const mafiaInv = result.investigationResults.find((r) => r.targetPlayerId === 'mafia_target');
  const citizenInv = result.investigationResults.find((r) => r.targetPlayerId === 'citizen_target');

  assert(mafiaInv && mafiaInv.targetIsMafia === true, 'Detective correctly identifies Mafia member');
  assert(citizenInv && citizenInv.targetIsMafia === false, 'Detective correctly identifies innocent Citizen');
}

// Test 4: Mayor 3x Vote Weight
{
  const votes = [
    { game_id: 'g1', round_number: 1, voter_player_id: 'p1', target_player_id: 'candidate_A', vote_weight: 1 },
    { game_id: 'g1', round_number: 1, voter_player_id: 'p2', target_player_id: 'candidate_A', vote_weight: 1 },
    { game_id: 'g1', round_number: 1, voter_player_id: 'mayor_id', target_player_id: 'candidate_B', vote_weight: 3 },
  ];

  const tally = tallyVotes(votes);
  assert(tally.tallies['candidate_A'] === 2, 'Candidate A has 2 regular votes');
  assert(tally.tallies['candidate_B'] === 3, 'Candidate B has 3 votes via Mayor triple-vote');
  assert(tally.eliminatedPlayerId === 'candidate_B', 'Candidate B is eliminated due to Mayor vote weight');
}

// Test 5: Win Condition Calculation
{
  const rolesMap = new Map();
  rolesMap.set('p1', DEFAULT_ROLES.find((r) => r.slug === 'mafia'));
  rolesMap.set('p2', DEFAULT_ROLES.find((r) => r.slug === 'citizen'));
  rolesMap.set('p3', DEFAULT_ROLES.find((r) => r.slug === 'citizen'));

  // Scenario A: 1 Mafia vs 2 Citizens -> Game ongoing
  let players = [
    { id: 'p1', is_alive: true },
    { id: 'p2', is_alive: true },
    { id: 'p3', is_alive: true },
  ];
  let win = checkWinCondition(players, rolesMap);
  assert(win.isGameOver === false, 'Game continues when 1 Mafia vs 2 Citizens');

  // Scenario B: Mafia eliminated -> Citizens win
  players = [
    { id: 'p1', is_alive: false },
    { id: 'p2', is_alive: true },
    { id: 'p3', is_alive: true },
  ];
  win = checkWinCondition(players, rolesMap);
  assert(win.isGameOver === true && win.winnerTeam === 'citizen', 'Citizens win when all Mafia eliminated');

  // Scenario C: 1 Mafia vs 1 Citizen -> Mafia wins (equal numbers)
  players = [
    { id: 'p1', is_alive: true },
    { id: 'p2', is_alive: false },
    { id: 'p3', is_alive: true },
  ];
  win = checkWinCondition(players, rolesMap);
  assert(win.isGameOver === true && win.winnerTeam === 'mafia', 'Mafia wins when numbers are equal or greater');
}

// Test 6: Room Store Multi-Player Lifecycle & Leader Assignment
{
  const { code, guestToken: hostToken } = roomStore.createRoom('HostPlayer');
  assert(code.length === 6, 'Generated room code is 6 characters');

  // Add 4 more players
  const p2 = roomStore.joinRoom(code, 'Player2');
  const p3 = roomStore.joinRoom(code, 'Player3');
  const p4 = roomStore.joinRoom(code, 'Player4');
  const p5 = roomStore.joinRoom(code, 'Player5');

  assert(p2.success && p3.success && p4.success && p5.success, '4 additional players joined successfully');

  // Start game atomically
  const startResult = roomStore.startGame(code, hostToken);
  assert(startResult.success, 'Host started game successfully');

  // Verify private role retrieval: each player only receives their own role
  const hostRoleInfo = roomStore.getPlayerRole(code, hostToken);
  const p2RoleInfo = roomStore.getPlayerRole(code, p2.guestToken);

  assert(hostRoleInfo.role !== null, 'Host has a secret role assigned');
  assert(p2RoleInfo.role !== null, 'Player 2 has a secret role assigned');
  assert(p2RoleInfo.allRolesIfLeader === undefined, 'Normal player cannot access all roles list');
}

console.log('\n=============================================');
console.log(` ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY! 🎯`);
console.log('=============================================\n');
