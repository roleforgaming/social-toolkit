'use server';

/**
 * @fileOverview Flow to generate an NPC backstory based on a 1d6 roll from the FIRST IMPRESSIONS & BACKSTORY table.
 *
 * - generateNpcBackstory - A function that returns a backstory snippet from a table based on a dice roll.
 * - GenerateNpcBackstoryInput - The input type for the generateNpcBackstory function.
 * - GenerateNpcBackstoryOutput - The return type for the generateNpcBackstory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNpcBackstoryInputSchema = z.object({
  roll: z
    .number()
    .int()
    .min(1)
    .max(6)
    .describe('A 1d6 roll to determine the backstory snippet.'),
});
export type GenerateNpcBackstoryInput = z.infer<typeof GenerateNpcBackstoryInputSchema>;

const GenerateNpcBackstoryOutputSchema = z.object({
  backstorySnippet: z
    .string()
    .describe('The corresponding text snippet from the FIRST IMPRESSIONS & BACKSTORY table.'),
});
export type GenerateNpcBackstoryOutput = z.infer<typeof GenerateNpcBackstoryOutputSchema>;

export async function generateNpcBackstory(input: GenerateNpcBackstoryInput): Promise<GenerateNpcBackstoryOutput> {
  return generateNpcBackstoryFlow(input);
}

const backstoryTable = {
  1: 'Came from a wealthy family, now disgraced.',
  2: 'Was a soldier in a forgotten war.',
  3: 'Escaped from a cult.',
  4: 'Is searching for a lost artifact.',
  5: 'Used to be a famous performer.',
  6: 'Is haunted by a past mistake.',
};

const prompt = ai.definePrompt({
  name: 'generateNpcBackstoryPrompt',
  input: {schema: GenerateNpcBackstoryInputSchema},
  output: {schema: GenerateNpcBackstoryOutputSchema},
  prompt: `Use the following table to return the backstorySnippet that corresponds to the provided roll.\n\nFIRST IMPRESSIONS & BACKSTORY:\n1: Came from a wealthy family, now disgraced.\n2: Was a soldier in a forgotten war.\n3: Escaped from a cult.\n4: Is searching for a lost artifact.\n5: Used to be a famous performer.\n6: Is haunted by a past mistake.\n\nRoll: {{{roll}}}\nBackstory Snippet: {{(lookup backstoryTable roll)}}`,
  templateHelpers: {
    lookup: (obj: any, key: string | number) => {
      if (Object.hasOwn(obj, key)) {
        return obj[key];
      }
      return null;
    },
  },
});

const generateNpcBackstoryFlow = ai.defineFlow(
  {
    name: 'generateNpcBackstoryFlow',
    inputSchema: GenerateNpcBackstoryInputSchema,
    outputSchema: GenerateNpcBackstoryOutputSchema,
  },
  async input => {
    // Force the roll to be within the valid range.
    const roll = Math.min(6, Math.max(1, input.roll));
    const {output} = await prompt({roll});
    return output!;
  }
);
