export const RELATIONSHIP_STAGES = ["Hostile", "Unfriendly", "Neutral", "Friendly", "Supportive", "Ally", "Devoted"] as const;

export const ATTITUDE_LEVELS = { min: -10, max: 10, default: 0 };

export const DIALOGUE_TOPICS = ["Current Events", "Personal History", "Local Rumors", "Quest Related", "Faction Business"] as const;

export const DIALOGUE_MOODS = ["Cheerful", "Neutral", "Grumpy", "Suspicious", "Flirty"] as const;

export const BASE_TONES = ["Friendly", "Neutral", "Assertive"] as const;

export const WILDCARD_TONES = ["Humorous", "Sarcastic", "Intimidating", "Persuasive", "Deceptive"] as const;

export const INITIAL_TONES_HARDCORE = ["Friendly", "Neutral", "Assertive"] as const;

export const RELATIONSHIP_STATUS_ICONS = {
  Romance: 'Heart',
  Bond: 'Link2',
  Toxic: 'AlertTriangle',
  Friendly: 'Smile',
  Neutral: 'Meh',
  Hostile: 'FrownAngry', // Placeholder, might need custom or different Lucide icon
} as const;

export const FACTION_PLACEHOLDER_ICON = "Users";
export const NPC_PLACEHOLDER_AVATAR = "https://placehold.co/100x100.png";
export const FACTION_PLACEHOLDER_BANNER = "https://placehold.co/300x100.png";

// LET'S TALK! Dialogue Engine Core Tables
export const TONE_DECK = [
  "Friendly",
  "Neutral",
  "Assertive",
  "Charming",
  "Sarcastic",
  "Humorous",
  "Questioning",
  "Flirting",
  "Romantic"
] as const;

// Topic Roll Table (1d10)
export const TOPIC_ROLL_TABLE = [
  "Greetings",
  "Small Talk",
  "Rumors",
  "Personal Matters",
  "Quests",
  "Factions",
  "Requests",
  "Opportunities",
  "Warnings",
  "Farewells"
];

// Placeholder for Mood and Reaction tables (to be filled in next steps)
export const MOOD_ROLL_TABLE: string[][] = [];
export const REACTION_ROLL_TABLE: string[][] = [];
export const NPC_REACTION_TABLE: Record<string, string[]> = {};
