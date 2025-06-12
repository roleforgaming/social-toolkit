import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TOPIC_ROLL_TABLE, MOOD_ROLL_TABLE, REACTION_ROLL_TABLE, NPC_REACTION_TABLE } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dice rolling utilities
export function roll1d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function roll2d6(): number {
  return roll1d6() + roll1d6();
}

export function roll1d10(): number {
  return Math.floor(Math.random() * 10) + 1;
}

export function roll2d10(): [number, number] {
  return [roll1d10(), roll1d10()];
}

// Allowed Attitude/AR/Condition values per rules
export const ATTITUDE_LEVEL_MIN = -2;
export const ATTITUDE_LEVEL_MAX = 2;
export const AR_MIN_DEFAULT = -4;
export const AR_MAX_DEFAULT = 6;
export const AR_MIN_BOND = -5;
export const AR_MAX_BOND = 5;
export const CONDITIONS = ["Stressed", "Pleased"] as const;

// Clamp helpers
export function clampAttitudeLevel(val: number): number {
  return Math.max(ATTITUDE_LEVEL_MIN, Math.min(ATTITUDE_LEVEL_MAX, val));
}
export function clampAR(val: number, min = AR_MIN_DEFAULT, max = AR_MAX_DEFAULT): number {
  return Math.max(min, Math.min(max, val));
}

// Condition logic
export function getConditionForAR(ar: number, min = AR_MIN_DEFAULT, max = AR_MAX_DEFAULT): string | null {
  if (ar >= max) return "Pleased";
  if (ar <= min) return "Stressed";
  return null;
}

// Add/remove conditions, ensuring only allowed values and no duplicates
export function addCondition(conditions: string[], cond: string): string[] {
  if (!CONDITIONS.includes(cond as any)) return conditions;
  return conditions.includes(cond) ? conditions : [...conditions, cond];
}
export function removeCondition(conditions: string[], cond: string): string[] {
  return conditions.filter(c => c !== cond);
}

// Core AR change logic for [NPC] approves/disapproves that!
export function npcApprovesThat(ar: number, min = AR_MIN_DEFAULT, max = AR_MAX_DEFAULT): { ar: number, result: string } {
  const roll = roll1d6();
  if (roll <= 3) {
    return { ar, result: "slightly approves (+0 AR)" };
  } else {
    const newAR = clampAR(ar + 1, min, max);
    return { ar: newAR, result: "approves (+1 AR)" };
  }
}
export function npcDisapprovesThat(ar: number, min = AR_MIN_DEFAULT, max = AR_MAX_DEFAULT): { ar: number, result: string } {
  const roll = roll1d6();
  if (roll <= 3) {
    const newAR = clampAR(ar - 1, min, max);
    return { ar: newAR, result: "disapproves (-1 AR)" };
  } else {
    const newAR = clampAR(ar - 2, min, max);
    return { ar: newAR, result: "highly disapproves (-2 AR)" };
  }
}

// Update Relationships logic (per rules)
export function updateRelationship(npc: any): { attitudeLevel: number, ar: number, conditions: string[], result: string } {
  let { attitudeLevel, ar, conditions } = npc;
  let result = '';
  // Both Stressed and Pleased: clear both, AR to 0
  if (conditions.includes('Stressed') && conditions.includes('Pleased')) {
    conditions = conditions.filter((c: string) => c !== 'Stressed' && c !== 'Pleased');
    ar = 0;
    result = 'Both Stressed and Pleased: reset both, AR to 0.';
  } else if (conditions.includes('Stressed')) {
    // Stressed only
    const roll = roll1d6();
    if (roll <= 3) {
      conditions = conditions.filter((c: string) => c !== 'Stressed');
      ar = 0;
      attitudeLevel = clampAttitudeLevel(attitudeLevel - 1);
      result = 'Stressed: Attitude worsens, Stressed removed, AR reset.';
    } else {
      conditions = conditions.filter((c: string) => c !== 'Stressed');
      ar = 0;
      result = 'Stressed: Bullet dodged, Stressed removed, AR reset.';
    }
  } else if (conditions.includes('Pleased')) {
    // Pleased only
    const roll = roll1d6();
    if (roll <= 3) {
      conditions = conditions.filter((c: string) => c !== 'Pleased');
      ar = 0;
      attitudeLevel = clampAttitudeLevel(attitudeLevel + 1);
      result = 'Pleased: Attitude improves, Pleased removed, AR reset.';
    } else {
      conditions = conditions.filter((c: string) => c !== 'Pleased');
      ar = 0;
      result = 'Pleased: No change in Attitude, Pleased removed, AR reset.';
    }
  } else {
    result = 'No update needed.';
  }
  return { attitudeLevel, ar, conditions, result };
}

// Create Bond logic
export function createBond(npc: any, personalQuestStages: number = 0): { success: boolean, roll: number, result: string, arMin: number, arMax: number } {
  // Only if attitudeLevel >= 0 and not Stressed
  if (npc.attitudeLevel < 0 || npc.conditions.includes('Stressed')) {
    return { success: false, roll: 0, result: 'Cannot create bond: Attitude < 0 or Stressed.', arMin: AR_MIN_DEFAULT, arMax: AR_MAX_DEFAULT };
  }
  const roll = roll2d6() + npc.attitudeLevel + personalQuestStages;
  if (roll >= 10) {
    return { success: true, roll, result: 'Bond created! AR limits now -5/+5.', arMin: AR_MIN_BOND, arMax: AR_MAX_BOND };
  } else if (roll >= 7) {
    return { success: false, roll, result: 'Too soon. Try again later with +2 bonus.', arMin: AR_MIN_DEFAULT, arMax: AR_MAX_DEFAULT };
  } else {
    return { success: false, roll, result: 'Rejected. Cannot try again for a while.', arMin: AR_MIN_DEFAULT, arMax: AR_MAX_DEFAULT };
  }
}

// Break Bond logic
export function breakBond(npc: any): { roll: number, result: string } {
  const roll = roll2d6() + npc.attitudeLevel;
  if (roll >= 10) {
    return { roll, result: 'Bond broken amicably.' };
  } else if (roll >= 7) {
    return { roll, result: 'Bond broken, but feelings are hurt.' };
  } else {
    return { roll, result: 'Bad breakup! Attitude drops to -2.' };
  }
}

// Start Romance logic
export function startRomance(npc: any): { success: boolean, roll: number, result: string } {
  // Only if Bond, Pleased, not Stressed, Attitude +2
  if (!npc.isBonded || !npc.conditions.includes('Pleased') || npc.conditions.includes('Stressed') || npc.attitudeLevel < 2) {
    return { success: false, roll: 0, result: 'Cannot start romance: prerequisites not met.' };
  }
  const roll = roll2d6();
  if (roll >= 10) {
    return { success: true, roll, result: 'Romance started! Attitude resets to 0 (Romantic).' };
  } else if (roll >= 7) {
    return { success: false, roll, result: 'Not ready. Try again later with +2 bonus.' };
  } else {
    return { success: false, roll, result: 'Rejected. -2 AR.' };
  }
}

// End Romance logic
export function endRomance(npc: any): { roll: number, result: string } {
  const roll = roll2d6() + npc.attitudeLevel;
  if (roll >= 10) {
    return { roll, result: 'Romance ended amicably. Becomes Bond at same level.' };
  } else if (roll >= 7) {
    return { roll, result: 'Romance ended, but feelings are hurt. Bond at one level lower.' };
  } else {
    return { roll, result: 'Bad breakup! All relationships broken, Attitude -2.' };
  }
}

// Draw 3 random tones from the deck (optionally excluding used/forbidden)
export function drawTones(deck: string[], used: string[] = [], forbidden: string[] = []): string[] {
  const available = deck.filter(t => !used.includes(t) && !forbidden.includes(t));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// Check if a tone is available for the current attitude/relationship
export function isToneAvailable(tone: string, npc: any): boolean {
  // Example: Flirting only if attitude >= -1, Romantic only if isRomance
  if (tone === 'Flirting' && npc.attitudeLevel < -1) return false;
  if (tone === 'Romantic' && !npc.isRomance) return false;
  // Charming/Friendly not with Very Unfriendly
  if ((tone === 'Charming' || tone === 'Friendly') && npc.attitudeLevel <= -2) return false;
  return true;
}

// Get topic (player chooses or roll 1d10)
export function getTopic(playerInitiates: boolean, chosen?: string): string {
  if (playerInitiates && chosen) return chosen;
  const roll = roll1d10();
  return TOPIC_ROLL_TABLE[roll - 1];
}

// Get mood (roll 2d10, lookup table)
export function getMood(attitudeLevel: number = 0): string {
  // Clamp attitudeLevel to -2..+2, map to 0..4
  const col = Math.max(0, Math.min(4, attitudeLevel + 2));
  const [row1] = roll2d10();
  const row = Math.max(0, Math.min(9, row1 - 1));
  return MOOD_ROLL_TABLE[row][col];
}

// Get reaction outcome (Positive, Somewhat Positive, etc.)
export function getReaction(attitudeLevel: number): string {
  // Clamp attitudeLevel to -2..+2, map to 0..4
  const col = Math.max(0, Math.min(4, attitudeLevel + 2));
  const roll = roll1d10();
  // Find outcome for this attitude/column
  return REACTION_ROLL_TABLE[col][roll - 1];
}

// Get NPC reaction word (cross-reference tone and outcome)
export function getNpcReaction(tone: string, outcome: string): string {
  // outcome: "Positive", "Somewhat Positive", "Somewhat Negative", "Negative"
  const idx = ["Positive", "Somewhat Positive", "Somewhat Negative", "Negative"].indexOf(outcome);
  if (NPC_REACTION_TABLE[tone] && idx >= 0) {
    return NPC_REACTION_TABLE[tone][idx];
  }
  return outcome;
}

// Track dialogue exchanges (max 3)
export function canExchange(current: number): boolean {
  return current < 3;
}
