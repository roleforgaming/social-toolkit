// SummarizeRelationshipChanges.ts
'use server';

/**
 * @fileOverview Summarizes significant relationship changes between NPCs after an update.
 *
 * - summarizeRelationshipChanges - A function that takes the previous and current relationship states and returns a summary of changes.
 * - RelationshipChangesInput - The input type for the summarizeRelationshipChanges function.
 * - RelationshipChangesOutput - The return type for the summarizeRelationshipChanges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RelationshipStateSchema = z.object({
  npcId: z.string().describe('The unique identifier of the NPC.'),
  relationshipStage: z.string().describe('The current relationship stage (e.g., Acquaintance, Friend, Lover).'),
  attitudeLevel: z.number().describe('The current attitude level (e.g., -10 to 10).'),
  bondStatus: z.string().describe('The current bond status (e.g., Bonded, Not Bonded).'),
});

export type RelationshipState = z.infer<typeof RelationshipStateSchema>;

const RelationshipChangesInputSchema = z.object({
  previousRelationships: z.array(RelationshipStateSchema).describe('The relationship states before the update.'),
  currentRelationships: z.array(RelationshipStateSchema).describe('The relationship states after the update.'),
});

export type RelationshipChangesInput = z.infer<typeof RelationshipChangesInputSchema>;

const RelationshipChangesOutputSchema = z.object({
  summary: z.string().describe('A summary of the significant relationship changes that occurred.'),
});

export type RelationshipChangesOutput = z.infer<typeof RelationshipChangesOutputSchema>;

export async function summarizeRelationshipChanges(input: RelationshipChangesInput): Promise<RelationshipChangesOutput> {
  return summarizeRelationshipChangesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRelationshipChangesPrompt',
  input: {schema: RelationshipChangesInputSchema},
  output: {schema: RelationshipChangesOutputSchema},
  prompt: `You are a storyteller summarizing changes in NPC relationships.

  Given the previous and current states of NPC relationships, identify and summarize the significant changes that occurred. Highlight NPCs with positive, negative, or neutral shifts in their relationship stage, attitude level, or bond status. Focus on changes that represent meaningful shifts in the overall narrative.

  Previous Relationships:
  {{#each previousRelationships}}
  - NPC ID: {{npcId}}, Relationship Stage: {{relationshipStage}}, Attitude Level: {{attitudeLevel}}, Bond Status: {{bondStatus}}
  {{/each}}

  Current Relationships:
  {{#each currentRelationships}}
  - NPC ID: {{npcId}}, Relationship Stage: {{relationshipStage}}, Attitude Level: {{attitudeLevel}}, Bond Status: {{bondStatus}}
  {{/each}}

  Summary:`,
});

const summarizeRelationshipChangesFlow = ai.defineFlow(
  {
    name: 'summarizeRelationshipChangesFlow',
    inputSchema: RelationshipChangesInputSchema,
    outputSchema: RelationshipChangesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
