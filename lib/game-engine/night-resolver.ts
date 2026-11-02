import { NightActionPayload, NightResolutionResult, CharacterRole } from '../types/game';

export function resolveNightActions(
  actions: NightActionPayload[],
  rolesMap: Map<string, CharacterRole>
): NightResolutionResult {
  const killedPlayerIds: string[] = [];
  const savedPlayerIds: string[] = [];
  const investigationResults: {
    detectivePlayerId: string;
    targetPlayerId: string;
    targetIsMafia: boolean;
  }[] = [];
  let silencedPlayerId: string | null = null;
  const eventsLog: string[] = [];

  // 1. Collect protected players
  const protectedTargets = new Set<string>();
  actions
    .filter((a) => a.action_type === 'protect')
    .forEach((a) => {
      protectedTargets.add(a.target_player_id);
    });

  // 2. Resolve Mafia Kill
  const mafiaKills = actions.filter((a) => a.action_type === 'kill');
  if (mafiaKills.length > 0) {
    // Find consensus or boss vote
    const targetCounts = new Map<string, number>();
    mafiaKills.forEach((k) => {
      targetCounts.set(k.target_player_id, (targetCounts.get(k.target_player_id) || 0) + 1);
    });

    let primaryTarget = mafiaKills[0].target_player_id;
    let maxVotes = 0;
    targetCounts.forEach((cnt, tId) => {
      if (cnt > maxVotes) {
        maxVotes = cnt;
        primaryTarget = tId;
      }
    });

    if (protectedTargets.has(primaryTarget)) {
      savedPlayerIds.push(primaryTarget);
      eventsLog.push('تدخل ملاك الرحمة في جنح الظلام... ولم يُسجل أي هجوم ناجح للمافيا الليلة!');
    } else {
      killedPlayerIds.push(primaryTarget);
      eventsLog.push(`استيقظت المدينة على فاجعة اغتيال أحد سكانها الغادرين في الليل.`);
    }
  }

  // 3. Resolve Sniper Shot
  const sniperActions = actions.filter((a) => a.action_type === 'snipe');
  sniperActions.forEach((sa) => {
    if (protectedTargets.has(sa.target_player_id)) {
      savedPlayerIds.push(sa.target_player_id);
    } else if (!killedPlayerIds.includes(sa.target_player_id)) {
      killedPlayerIds.push(sa.target_player_id);
      eventsLog.push('دوى صوت طلقة قناص مجهولة في سكون الليل وسقطت ضحية أخرى.');
    }
  });

  // 4. Resolve Detective Investigation
  const investigations = actions.filter((a) => a.action_type === 'investigate');
  investigations.forEach((inv) => {
    const targetRole = rolesMap.get(inv.target_player_id);
    const targetIsMafia = targetRole ? targetRole.team === 'mafia' : false;
    investigationResults.push({
      detectivePlayerId: inv.actor_player_id,
      targetPlayerId: inv.target_player_id,
      targetIsMafia,
    });
  });

  // 5. Resolve Silencer
  const silences = actions.filter((a) => a.action_type === 'silence');
  if (silences.length > 0) {
    silencedPlayerId = silences[0].target_player_id;
    eventsLog.push('تسلل شبح التسكيت في الظلام وكمم أحد الشهود، لن يتمكن من الكلام اليوم!');
  }

  return {
    killedPlayerIds,
    savedPlayerIds,
    investigationResults,
    silencedPlayerId,
    eventsLog,
  };
}
