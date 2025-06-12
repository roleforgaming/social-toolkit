import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
