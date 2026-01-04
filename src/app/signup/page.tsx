'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useUser, useFirestore, initiateEmailSignUp } from '@/firebase';
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
import { FirebaseError } from 'firebase/app';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

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
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: SignUpValues) => {
    startTransition(async () => {
      try {
        const userCredential = await initiateEmailSignUp(auth, values.email, values.password);
        
        if (userCredential && userCredential.user) {
          const userRef = doc(firestore, 'users', userCredential.user.uid);
          setDocumentNonBlocking(userRef, {
            id: userCredential.user.uid,
            email: values.email,
            theme: 'system',
          }, { merge: true });
        }

      } catch (error) {
        let description = 'An unexpected error occurred.';
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              description = 'This email is already associated with an account.';
              break;
            case 'auth/invalid-email':
              description = 'Please enter a valid email address.';
              break;
            case 'auth/weak-password':
              description = 'The password is too weak. Please choose a stronger password.';
              break;
            default:
              description = 'Failed to create an account. Please try again.';
              break;
          }
        }
        toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description,
        });
      }
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
