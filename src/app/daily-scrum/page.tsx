
'use client';

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import withAuth from "@/components/layout/withAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Spinner } from '@/components/ui/spinner';

function DailyScrumPageContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [impediments, setImpediments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    // Simulate API call
    console.log({
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      yesterday,
      today,
      impediments,
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store submission flag in localStorage
    const currentDate = new Date().toISOString().split('T')[0];
    localStorage.setItem(`dailyScrumSubmitted_${currentDate}_${user.id}`, 'true');

    setIsSubmitting(false);
    toast({
      title: "Success!",
      description: "Your daily scrum has been submitted.",
    });
    router.push('/dashboard');
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Daily Scrum Update</CardTitle>
          <CardDescription>Let your team know what you're working on.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="yesterday" className="text-base font-medium">
                What did I do yesterday to help the team meet the Sprint Goal?
              </Label>
              <Textarea
                id="yesterday"
                value={yesterday}
                onChange={(e) => setYesterday(e.target.value)}
                placeholder="E.g., Completed the user authentication feature..."
                required
                rows={4}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="today" className="text-base font-medium">
                What will I do today to help the team meet the Sprint Goal?
              </Label>
              <Textarea
                id="today"
                value={today}
                onChange={(e) => setToday(e.target.value)}
                placeholder="E.g., Start working on the profile page UI..."
                required
                rows={4}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="impediments" className="text-base font-medium">
                Are there any impediments blocking me or the team?
              </Label>
              <Textarea
                id="impediments"
                value={impediments}
                onChange={(e) => setImpediments(e.target.value)}
                placeholder="E.g., Waiting for API documentation from the backend team..."
                rows={3}
                className="text-base"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
              {isSubmitting ? <Spinner size="small" className="mr-2" /> : null}
              Submit Daily Scrum
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default withAuth(DailyScrumPageContent);
