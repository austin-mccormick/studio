
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function RegisterPage() {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!authIsLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        setIsPageLoading(false);
      }
    }
  }, [user, authIsLoading, router]);

  if (isPageLoading || authIsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Create an Account</CardTitle>
          <CardDescription>Join StructureFlow today!</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required className="text-base"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required className="text-base"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required className="text-base"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" placeholder="••••••••" required className="text-base"/>
            </div>
            <Button type="submit" className="w-full" disabled> {/* Add actual registration logic later */}
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
