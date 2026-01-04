"use server";

import { z } from "zod";
import { generateSmartReminder, type SmartReminderInput } from "@/ai/flows/smart-reminder-generation";
import { type Task } from "@/lib/types";

const CreateTaskSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters.").max(200),
  category: z.enum(["work", "home"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  dueDate: z.date().nullable(),
});

type CreateTaskValues = z.infer<typeof CreateTaskSchema>;

export async function createTaskAction(values: CreateTaskValues): Promise<{ success: true; data: Omit<Task, 'id' | 'userId'> } | { success: false; error: string }> {
  const validatedFields = CreateTaskSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid input provided.",
    };
  }
  
  const { description, difficulty, dueDate, category } = validatedFields.data;

  try {
    const newTask: Omit<Task, 'id' | 'userId'> = {
      description,
      difficulty,
      dueDate,
      category,
      completed: false,
    };
    
    if (dueDate) {
      const reminderInput: SmartReminderInput = {
        taskDescription: description,
        taskDifficulty: difficulty,
        dueDate: dueDate.toISOString(),
      };
      
      const smartReminder = await generateSmartReminder(reminderInput);
      newTask.smartReminder = smartReminder;
    }

    return { success: true, data: newTask };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      success: false,
      error: "Failed to create task. The AI service may be unavailable.",
    };
  }
}
