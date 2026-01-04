"use client"

import { type Task } from "@/lib/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
    tasks: Task[];
    onToggleComplete: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
}

export default function TaskList({ tasks, onToggleComplete, onDeleteTask }: TaskListProps) {
    return (
        <div className="space-y-4">
            {tasks.map((task, index) => (
                <TaskItem 
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDeleteTask={onDeleteTask}
                    style={{ animationDelay: `${index * 50}ms` }}
                />
            ))}
        </div>
    );
}
