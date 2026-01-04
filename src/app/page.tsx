import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { ArrowRight, CheckCircle, Lightbulb, ListTodo, UserPlus, LogIn } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center gap-2">
            <Logo />
            <h1 className="text-xl font-bold font-headline">TaskFlow</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center sm:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl md:text-6xl">
              The Smart To-Do List for Modern Achievers
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              TaskFlow combines a simple and beautiful task manager with AI-powered smart reminders to help you stay organized and achieve your goals.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-secondary/50 dark:bg-card">
          <div className="container mx-auto px-4 py-16 sm:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
                Features to Supercharge Your Productivity
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Discover the tools that will help you manage your tasks more effectively than ever before.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-sm">
                <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">
                  <ListTodo className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Effortless Task Management</h3>
                <p className="text-muted-foreground">
                  Organize your tasks by category, set due dates, and track your progress with a clean and intuitive interface.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-sm">
                <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">
                  <Lightbulb className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Smart Reminders</h3>
                <p className="text-muted-foreground">
                  Our intelligent system analyzes task difficulty and due dates to suggest the optimal time for a reminder. Never miss a deadline again.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-sm">
                <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Your Accomplishments</h3>
                <p className="text-muted-foreground">
                  See your completed tasks and get a clear overview of your productivity. Stay motivated by seeing how much you've achieved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center sm:py-24">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
              Ready to Take Control of Your Tasks?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop letting things slip through the cracks. Start organizing your life with TaskFlow today.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Go to Your Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
