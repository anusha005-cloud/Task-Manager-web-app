'use server';

/**
 * @fileOverview An AI agent that generates smart reminders for tasks based on task difficulty and due date.
 *
 * - generateSmartReminder - A function that generates a smart reminder for a task.
 * - SmartReminderInput - The input type for the generateSmartReminder function.
 * - SmartReminderOutput - The return type for the generateSmartReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartReminderInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
  taskDifficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty of the task.'),
  dueDate: z.string().describe('The due date of the task in ISO format.'),
});

export type SmartReminderInput = z.infer<typeof SmartReminderInputSchema>;

const SmartReminderOutputSchema = z.object({
  reminderDate: z.string().describe('The date and time to send the reminder in ISO format.'),
  reasoning: z.string().describe('The reasoning behind the reminder date.'),
});

export type SmartReminderOutput = z.infer<typeof SmartReminderOutputSchema>;

export async function generateSmartReminder(input: SmartReminderInput): Promise<SmartReminderOutput> {
  return smartReminderFlow(input);
}

const smartReminderPrompt = ai.definePrompt({
  name: 'smartReminderPrompt',
  input: {schema: SmartReminderInputSchema},
  output: {schema: SmartReminderOutputSchema},
  prompt: `You are a smart reminder assistant. You will receive a task description, its difficulty, and its due date.

  Your goal is to determine the optimal time to send a reminder to the user so that they complete the task on time, taking into account the task's difficulty.

  Task description: {{{taskDescription}}}
  Task difficulty: {{{taskDifficulty}}}
  Due date: {{{dueDate}}}

  Consider these factors:
  - Hard tasks require more advance reminders.
  - Easy tasks can be reminded closer to the due date.

  Return the reminder date in ISO format and include your reasoning.
  Example:
  \{
    "reminderDate": "2024-01-02T10:00:00.000Z",
    "reasoning": "The task is hard and requires 3 days to complete."
  \}
  `,
});

const smartReminderFlow = ai.defineFlow(
  {
    name: 'smartReminderFlow',
    inputSchema: SmartReminderInputSchema,
    outputSchema: SmartReminderOutputSchema,
  },
  async input => {
    const {output} = await smartReminderPrompt(input);
    return output!;
  }
);
