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

// Mood Roll Table (2d10, 10x5, columns: Attitude -2 to +2)
export const MOOD_ROLL_TABLE: string[][] = [
  ["Angry", "Angry", "Grumpy", "Nitpicking", "Self-absorbed"],
  ["Defiant", "Harsh", "Suspicious", "Dubitative", "Inquisitive"],
  ["Harsh", "Grumpy", "Impatient", "Self-absorbed", "Pragmatic"],
  ["Arrogant", "Suspicious", "Nitpicking", "Chatty", "Chatty"],
  ["Grumpy", "Ironic", "Self-absorbed", "Inquisitive", "Fair"],
  ["Ironic", "Dubitative", "Chatty", "Fair", "Patient"],
  ["Suspicious", "Skeptical", "Fair", "Fair", "Patient"],
  ["Sarcastic", "Impatient", "Negotiator", "Patient", "Empathic"],
  ["Skeptical", "Dubitative", "Pragmatic", "Empathic", "Sympathetic"],
  ["Dubitative", "Negotiator", "Diplomatic", "Sympathetic", "Helpful"]
];

// Reaction Roll Table (1d10, 5 columns for Attitude -2 to +2)
// Each column: [Positive, Somewhat Positive, Somewhat Negative, Negative]
export const REACTION_ROLL_TABLE: string[][] = [
  // Attitude -2 (Very Unfriendly)
  ["Negative", "Negative", "Somewhat Negative", "Somewhat Negative", "Somewhat Negative", "Somewhat Negative", "Somewhat Positive", "Somewhat Positive", "Positive", "Positive"],
  // Attitude -1 (Unfriendly)
  ["Negative", "Somewhat Negative", "Somewhat Negative", "Somewhat Negative", "Somewhat Positive", "Somewhat Positive", "Somewhat Positive", "Positive", "Positive", "Positive"],
  // Attitude 0 (Neutral)
  ["Somewhat Negative", "Somewhat Negative", "Somewhat Negative", "Somewhat Positive", "Somewhat Positive", "Somewhat Positive", "Positive", "Positive", "Positive", "Positive"],
  // Attitude +1 (Friendly)
  ["Somewhat Negative", "Somewhat Negative", "Somewhat Positive", "Somewhat Positive", "Somewhat Positive", "Positive", "Positive", "Positive", "Positive", "Positive"],
  // Attitude +2 (Very Friendly)
  ["Somewhat Positive", "Somewhat Positive", "Somewhat Positive", "Positive", "Positive", "Positive", "Positive", "Positive", "Positive", "Positive"]
];

// NPC Reaction Table (Tone x Outcome)
// Example: { "Friendly": ["Happy", "Neutral", "Disagreement", "Hostile"] }
export const NPC_REACTION_TABLE: Record<string, string[]> = {
  Friendly: ["Happy", "Neutral", "Disagreement", "Hostile"],
  Neutral: ["Neutral", "Neutral", "Disagreement", "Hostile"],
  Assertive: ["Impressed", "Neutral", "Disagreement", "Hostile"],
  Charming: ["Charmed", "Neutral", "Disagreement", "Hostile"],
  Sarcastic: ["Amused", "Neutral", "Disagreement", "Hostile"],
  Humorous: ["Laughter", "Neutral", "Disagreement", "Hostile"],
  Questioning: ["Insightful", "Neutral", "Disagreement", "Hostile"],
  Flirting: ["Flattered", "Neutral", "Disagreement", "Hostile"],
  Romantic: ["Touched", "Neutral", "Disagreement", "Hostile"]
};
