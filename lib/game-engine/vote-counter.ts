import { VotePayload } from '../types/game';

export interface VoteTallyResult {
  tallies: Record<string, number>;
  eliminatedPlayerId: string | null;
  isTie: boolean;
  tiedPlayerIds: string[];
}

export function tallyVotes(
  votes: VotePayload[],
  tiePolicy: 'revote' | 'no_elimination' | 'leader_decides' = 'no_elimination'
): VoteTallyResult {
  const tallies: Record<string, number> = {};

  votes.forEach((v) => {
    if (v.target_player_id && v.target_player_id !== 'abstain') {
      const weight = v.vote_weight || 1;
      tallies[v.target_player_id] = (tallies[v.target_player_id] || 0) + weight;
    }
  });

  let maxVotes = 0;
  const candidatesWithMax: string[] = [];

  for (const [pId, count] of Object.entries(tallies)) {
    if (count > maxVotes) {
      maxVotes = count;
      candidatesWithMax.length = 0;
      candidatesWithMax.push(pId);
    } else if (count === maxVotes && maxVotes > 0) {
      candidatesWithMax.push(pId);
    }
  }

  if (candidatesWithMax.length === 1 && maxVotes > 0) {
    return {
      tallies,
      eliminatedPlayerId: candidatesWithMax[0],
      isTie: false,
      tiedPlayerIds: [],
    };
  } else if (candidatesWithMax.length > 1) {
    return {
      tallies,
      eliminatedPlayerId: null, // Will depend on leader decision or revote
      isTie: true,
      tiedPlayerIds: candidatesWithMax,
    };
  }

  return {
    tallies,
    eliminatedPlayerId: null,
    isTie: false,
    tiedPlayerIds: [],
  };
}
