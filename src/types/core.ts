import type { RELATIONSHIP_STAGES, DIALOGUE_TOPICS, DIALOGUE_MOODS, BASE_TONES, WILDCARD_TONES } from '@/lib/constants';

export type RelationshipStage = typeof RELATIONSHIP_STAGES[number];
export type DialogueTopic = typeof DIALOGUE_TOPICS[number];
export type DialogueMood = typeof DIALOGUE_MOODS[number];
export type BaseTone = typeof BASE_TONES[number];
export type WildcardTone = typeof WILDCARD_TONES[number];
export type DialogueTone = BaseTone | WildcardTone;

export interface NPC {
  id: string;
  name: string;
  avatarUrl?: string;
  factionId?: string;
  relationshipStage: RelationshipStage;
  attitudeLevel: number; // e.g., -10 to 10
  ar: number; // Attitude Rating
  conditions: string[];
  questProgress: string;
  isBonded: boolean;
  isRomance: boolean;
  backstorySnippet?: string;
  notes?: string;
}

export interface Faction {
  id: string;
  name: string;
  iconUrl?: string;
  ar: number; // Attitude Rating towards player/main group
  description?: string;
  memberIds: string[]; // List of NPC IDs belonging to this faction
  notes?: string;
}

export interface DialogueSettings {
  selectedWildcardTone: WildcardTone | null;
  hardcoreMode: boolean;
}

export interface AppSettings extends DialogueSettings {
  // Add other global settings if needed
}

export interface DialogueEncounter {
  npc: NPC;
  currentTopic: DialogueTopic | null;
  currentMood: DialogueMood | null;
  availableTones: DialogueTone[];
  playerSelectedTone: DialogueTone | null;
  npcReactionRoll?: number; // 2d6 + modifiers
  npcFinalReaction?: string; // Text description
  dialogueHistory: { playerLine?: string; npcResponse?: string }[];
}
