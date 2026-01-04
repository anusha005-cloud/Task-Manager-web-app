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

const SignUpSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type SignUpValues = z.infer<typeof SignUpSchema>;

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: SignUpValues) => {
    startTransition(() => {
      // NOTE: Firebase sign-up logic will be added here later.
      console.log(values);
      toast({
        title: 'Sign Up Submitted (Not Implemented)',
        description: 'This is a placeholder. Your account has not been created.',
      });
    });
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Enter your details below to create your account.
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
            <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Login
                </Link>
            </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
