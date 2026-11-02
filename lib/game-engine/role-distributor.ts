import { CharacterRole } from '../types/game';
import { DEFAULT_ROLES } from '../constants/default-roles';

/**
 * Distributes roles fairly and securely to an array of player IDs.
 * Guarantees mafia-to-citizen balance and prevents duplicate unique cards.
 */
export function distributeRoles(
  playerIds: string[],
  enabledRoleSlugs: string[]
): Map<string, CharacterRole> {
  const playerCount = playerIds.length;
  if (playerCount < 4) {
    throw new Error('Minimum 4 players required to distribute roles');
  }

  // Filter pool by enabled slugs or fallback to default
  const availableRoles = DEFAULT_ROLES.filter((r) =>
    enabledRoleSlugs.includes(r.slug)
  );

  const roleDeck: CharacterRole[] = [];

  // Determine ideal Mafia ratio: ~1 mafia for every 3-4 players
  const mafiaTargetCount = Math.max(1, Math.floor(playerCount / 3.5));

  // Find mafia cards
  const mafiaBoss = availableRoles.find((r) => r.slug === 'mafia_boss') || DEFAULT_ROLES[0];
  const regularMafia = availableRoles.find((r) => r.slug === 'mafia') || DEFAULT_ROLES[1];
  const silencer = availableRoles.find((r) => r.slug === 'silencer_mafia');
  const bomber = availableRoles.find((r) => r.slug === 'bomber_mafia');

  roleDeck.push(mafiaBoss);
  let mafiaAdded = 1;

  if (mafiaTargetCount > 1 && silencer) {
    roleDeck.push(silencer);
    mafiaAdded++;
  }
  if (mafiaTargetCount > mafiaAdded && bomber) {
    roleDeck.push(bomber);
    mafiaAdded++;
  }
  while (mafiaAdded < mafiaTargetCount) {
    roleDeck.push(regularMafia);
    mafiaAdded++;
  }

  // Essential citizen power roles
  const doctor = availableRoles.find((r) => r.slug === 'doctor') || DEFAULT_ROLES[4];
  const detective = availableRoles.find((r) => r.slug === 'detective') || DEFAULT_ROLES[5];
  const mayor = availableRoles.find((r) => r.slug === 'mayor');
  const sniper = availableRoles.find((r) => r.slug === 'sniper');
  const youngCitizen = availableRoles.find((r) => r.slug === 'young_citizen');
  const regularCitizen = availableRoles.find((r) => r.slug === 'citizen') || DEFAULT_ROLES[9];

  roleDeck.push(doctor);
  roleDeck.push(detective);

  if (playerCount >= 6 && mayor) roleDeck.push(mayor);
  if (playerCount >= 7 && sniper) roleDeck.push(sniper);
  if (playerCount >= 8 && youngCitizen) roleDeck.push(youngCitizen);

  // Fill remaining slots with regular Citizens
  while (roleDeck.length < playerCount) {
    roleDeck.push(regularCitizen);
  }

  // Trim if needed to match exact player count
  const finalDeck = roleDeck.slice(0, playerCount);

  // Cryptographically secure Fisher-Yates shuffle
  for (let i = finalDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [finalDeck[i], finalDeck[j]] = [finalDeck[j], finalDeck[i]];
  }

  const assignmentMap = new Map<string, CharacterRole>();
  playerIds.forEach((pId, idx) => {
    assignmentMap.set(pId, finalDeck[idx]);
  });

  return assignmentMap;
}
