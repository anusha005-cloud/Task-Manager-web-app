export type TaskDifficulty = "easy" | "medium" | "hard";
export type TaskCategory = "work" | "home";

export type Task = {
  id: string;
  userId: string;
  description: string;
  dueDate: Date | null;
  difficulty: TaskDifficulty;
  category: TaskCategory;
  completed: boolean;
  smartReminder?: {
    reminderDate: string;
    reasoning: string;
  };
};
