
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Plus, ListTodo, CheckCircle2, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskForm } from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
import { type Task, type TaskCategory } from "@/lib/types";
import { initialTasks } from "@/lib/initial-tasks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useUser, useAuth, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { signOut } from 'firebase/auth';
import { setDocumentNonBlocking, deleteDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase/non-blocking-updates";


type FilterType = TaskCategory | "all";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const tasksCollection = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'tasks');
  }, [firestore, user]);

  const { data: tasks, isLoading: areTasksLoading } = useCollection<Task>(tasksCollection);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  
  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
  }

  const handleTaskCreated = (newTask: Omit<Task, 'id' | 'userId'>) => {
    if (!user || !tasksCollection) return;
    const taskWithUser: Omit<Task, 'id'> = { ...newTask, userId: user.uid };
    const newDocRef = doc(tasksCollection);
    addDocumentNonBlocking(tasksCollection, { ...taskWithUser, id: newDocRef.id });
    setIsFormOpen(false);
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    if (!user) return;
    const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
    setDocumentNonBlocking(taskRef, { completed: !completed }, { merge: true });
  };

  const handleDeleteTask = (taskId: string) => {
    if (!user) return;
    const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
    deleteDocumentNonBlocking(taskRef);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const sortedTasks = useMemo(() => tasks ? sortTasks(tasks) : [], [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "all") {
      return sortedTasks;
    }
    return sortedTasks.filter((task) => task.category === filter);
  }, [sortedTasks, filter]);
  
  const completedTasksCount = useMemo(() => tasks?.filter(t => t.completed).length ?? 0, [tasks]);

  if (isUserLoading || areTasksLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-2xl">Loading...</div>
        </div>
    )
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 flex items-center gap-2">
              <Logo />
              <h1 className="text-xl font-bold font-headline">TaskFlow</h1>
            </div>
             <nav className="flex items-center space-x-4 lg:space-x-6 mr-auto">
                 <Button variant="ghost" size="sm" asChild>
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Home
                    </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </nav>
            <div className="flex flex-1 items-center justify-end space-x-2">
              <ThemeToggle />
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Task
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Your Tasks</h2>
                 <div className="flex items-center text-muted-foreground space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>{completedTasksCount} / {tasks?.length ?? 0} completed</span>
                </div>
            </div>
            <Tabs
              defaultValue="all"
              onValueChange={(value) => setFilter(value as FilterType)}
            >
              <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="work">Work</TabsTrigger>
                <TabsTrigger value="home">Home</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <TaskList
                  tasks={filteredTasks}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                />
              </TabsContent>
              <TabsContent value="work">
                <TaskList
                  tasks={filteredTasks}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                />
              </TabsContent>
              <TabsContent value="home">
                <TaskList
                  tasks={filteredTasks}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                />
              </TabsContent>
            </Tabs>

            {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                    <ListTodo className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold text-muted-foreground">No tasks here!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Click "New Task" to get started.
                    </p>
                </div>
            )}
          </div>
        </main>
      </div>
      <TaskForm onTaskCreated={handleTaskCreated} />
    </Dialog>
  );
}
