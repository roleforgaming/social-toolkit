'use server';

/**
 * @fileOverview Flow to generate an NPC backstory based on a 1d6 roll from the FIRST IMPRESSIONS & BACKSTORY table.
 *
 * - generateNpcBackstory - A function that returns a backstory snippet from a table based on a dice roll.
 * - GenerateNpcBackstoryInput - The input type for the generateNpcBackstory function.
 * - GenerateNpcBackstoryOutput - The return type for the generateNpcBackstory function.
 */

const BACKSTORY_TABLE: Record<number, string> = {
  1: 'Came from a wealthy family, now disgraced.',
  2: 'Was a soldier in a forgotten war.',
  3: 'Escaped from a cult.',
  4: 'Is searching for a lost artifact.',
  5: 'Used to be a famous performer.',
  6: 'Is haunted by a past mistake.',
};

export type GenerateNpcBackstoryInput = { roll: number };
export type GenerateNpcBackstoryOutput = { backstorySnippet: string };

export async function generateNpcBackstory(input: GenerateNpcBackstoryInput): Promise<GenerateNpcBackstoryOutput> {
  // Clamp roll to 1-6
  const roll = Math.min(6, Math.max(1, input.roll));
  return { backstorySnippet: BACKSTORY_TABLE[roll] };
}
