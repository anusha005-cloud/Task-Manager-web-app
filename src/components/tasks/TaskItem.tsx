"use client"

import { format, formatDistanceToNow, isPast } from "date-fns";
import { Calendar, Trash2, Lightbulb, AlertCircle } from "lucide-react";
import { type Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import * as React from 'react';

interface TaskItemProps extends React.HTMLAttributes<HTMLDivElement> {
    task: Task;
    onToggleComplete: (taskId: string, completed: boolean) => void;
    onDeleteTask: (taskId: string) => void;
}

export default function TaskItem({ task, onToggleComplete, onDeleteTask, className, ...props }: TaskItemProps) {

    const dueDateText = task.dueDate ? formatDistanceToNow(task.dueDate, { addSuffix: true }) : 'No due date';
    const isOverdue = task.dueDate ? isPast(new Date(task.dueDate)) && !task.completed : false;

    return (
        <Card
            className={cn(
                "w-full transition-all duration-300 ease-in-out hover:shadow-md",
                task.completed ? "bg-card/50" : "bg-card",
                "animate-in fade-in-0 zoom-in-95",
                className
            )}
            {...props}
        >
            <CardContent className="p-4 flex items-start gap-4">
                <div className="flex-shrink-0 pt-1">
                    <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => onToggleComplete(task.id, task.completed)}
                        aria-label={`Mark task as ${task.completed ? 'incomplete' : 'complete'}`}
                    />
                </div>
                <div className="flex-grow grid gap-2">
                    <label
                        htmlFor={`task-${task.id}`}
                        className={cn(
                            "font-medium leading-none cursor-pointer transition-colors",
                            task.completed && "line-through text-muted-foreground"
                        )}
                    >
                        {task.description}
                    </label>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span className={cn(isOverdue && "text-destructive font-medium")}>
                                {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No date"}
                            </span>
                        </div>
                        <Badge
                            variant={task.category === "work" ? "default" : "secondary"}
                            className={cn(task.category === "work" && "bg-blue-600/80 text-white dark:bg-blue-800/80 dark:text-blue-100")}
                        >
                            {task.category}
                        </Badge>
                         <Badge
                            variant="outline"
                             className={cn({
                                "border-green-500/50 text-green-600 dark:text-green-400": task.difficulty === "easy",
                                "border-yellow-500/50 text-yellow-600 dark:text-yellow-400": task.difficulty === "medium",
                                "border-red-500/50 text-red-600 dark:text-red-400": task.difficulty === "hard",
                            })}
                        >
                            {task.difficulty}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {task.smartReminder && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-amber-500">
                                        <Lightbulb className="h-4 w-4" />
                                        <span className="sr-only">View Smart Reminder</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                    <p className="font-bold mb-1">AI Reminder</p>
                                    <p className="text-xs">
                                        {task.smartReminder.reasoning} <br/>
                                        <span className="font-semibold">On: {format(new Date(task.smartReminder.reminderDate), "MMM d 'at' h:mm a")}</span>
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    <AlertDialog>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                     <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete task</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Delete task</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this task.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDeleteTask(task.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
