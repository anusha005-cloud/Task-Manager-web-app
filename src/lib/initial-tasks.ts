import { Task } from '@/lib/types';

export const initialTasks: Task[] = [
  {
    id: '1',
    description: 'Finalize the Q3 report for the marketing team',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    difficulty: 'medium',
    category: 'work',
    completed: false,
    smartReminder: {
      reminderDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
      reasoning: 'This is a medium difficulty task. Reminding you 2 days before the due date should be sufficient.',
    },
  },
  {
    id: '2',
    description: 'Schedule a dentist appointment',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    difficulty: 'easy',
    category: 'home',
    completed: false,
    smartReminder: {
      reminderDate: new Date(new Date().setDate(new Date().getDate() + 9)).toISOString(),
      reasoning: 'Easy task, a reminder the day before is enough.',
    },
  },
  {
    id: '3',
    description: 'Plan the architecture for the new microservice',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    difficulty: 'hard',
    category: 'work',
    completed: true,
    smartReminder: {
      reminderDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      reasoning: 'This is a hard task, you should start at least a week in advance.',
    },
  },
  {
    id: '4',
    description: 'Buy groceries for the week',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    difficulty: 'easy',
    category: 'home',
    completed: false,
  },
];
