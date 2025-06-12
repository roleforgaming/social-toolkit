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
