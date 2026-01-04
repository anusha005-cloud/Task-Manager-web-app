import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
                <Logo />
                <h1 className="text-2xl font-bold font-headline">TaskFlow</h1>
            </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
