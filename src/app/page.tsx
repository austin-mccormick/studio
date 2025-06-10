
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, user } = useAuth();
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // This effect handles initial loading and redirection
    if (!isLoading) { // Auth context has finished its initial loading
      if (user) {
        router.replace('/dashboard');
      } else {
        setIsPageLoading(false); // Not logged in, okay to show login form
      }
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) { // Prevent multiple submissions while login is in progress
        await login(email, password);
    }
  };

  // This loading state is for the page itself, before we know if user is logged in or not
  // or if auth context is still processing a login attempt.
  if (isPageLoading || (isLoading && !user) ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="large" />
      </div>
    );
  }
  
  // If user is loaded (by AuthContext) and we're still on this page, means redirect is about to happen.
  // This state might be briefly visible if redirect is slow.
  if (user) { 
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
          <CardTitle className="text-3xl font-headline text-primary">Welcome to StructureFlow</CardTitle>
          <CardDescription>Please sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner size="small" className="mr-2" /> : null}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-4">
           <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
