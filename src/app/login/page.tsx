'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useToast } from '@/hooks/use-toast';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginValues) => {
    startTransition(() => {
      // NOTE: Firebase login logic will be added here later.
      console.log(values);
      toast({
        title: 'Login Submitted (Not Implemented)',
        description: 'This is a placeholder. No actual login has occurred.',
      });
    });
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col items-start text-sm">
            <div className="flex w-full justify-center">
                <p className="text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
