import { TeamType, RoomPlayer, CharacterRole } from '../types/game';

export interface WinCheckResult {
  isGameOver: boolean;
  winnerTeam: TeamType | null;
  reason: string;
}

export function checkWinCondition(
  players: RoomPlayer[],
  rolesMap: Map<string, CharacterRole>
): WinCheckResult {
  const livingPlayers = players.filter((p) => p.is_alive);

  let mafiaAlive = 0;
  let citizenAlive = 0;
  let neutralAlive = 0;

  livingPlayers.forEach((p) => {
    const role = rolesMap.get(p.id);
    if (!role) return;

    if (role.team === 'mafia') {
      mafiaAlive++;
    } else if (role.team === 'citizen') {
      citizenAlive++;
    } else {
      neutralAlive++;
    }
  });

  // Condition 1: All Mafia eliminated -> Citizens win
  if (mafiaAlive === 0) {
    return {
      isGameOver: true,
      winnerTeam: 'citizen',
      reason: 'نجح المواطنون الشرفاء في القضاء على جميع أفراد عصابة المافيا وتطهير المدينة!',
    };
  }

  // Condition 2: Mafia equals or outnumbers Citizens -> Mafia wins
  if (mafiaAlive >= citizenAlive) {
    return {
      isGameOver: true,
      winnerTeam: 'mafia',
      reason: 'فرضت عصابة المافيا هيمنتها الكاملة على المدينة بعد تفوق أعدادهم على المواطنين الأحياء!',
    };
  }

  // Game continues
  return {
    isGameOver: false,
    winnerTeam: null,
    reason: 'المباراة مستمرة والصراع على أشده...',
  };
}
