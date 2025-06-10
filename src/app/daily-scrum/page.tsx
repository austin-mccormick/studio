
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import withAuth from "@/components/layout/withAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Spinner } from '@/components/ui/spinner';

interface DailyScrumLog {
  id: string;
  userId: string;
  date: string; // ISO string
  yesterday: string;
  today: string;
  impediments?: string;
  createdAt: string; // ISO string
}

function DailyScrumPageContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [impediments, setImpediments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean | null>(null); // null = loading, true/false = status

  useEffect(() => {
    if (!user) return;

    const fetchTodaysScrum = async () => {
      try {
        const response = await fetch('/api/daily-scrum/me/today');
        if (response.ok) {
          const data = await response.json();
          if (data.log) {
            setAlreadySubmitted(true);
            setYesterday(data.log.yesterday);
            setToday(data.log.today);
            setImpediments(data.log.impediments || '');
            toast({
              title: "Already Submitted",
              description: "You've already submitted your scrum for today. Redirecting to dashboard...",
            });
            setTimeout(() => router.push('/dashboard'), 2000);
          } else {
            setAlreadySubmitted(false);
          }
        } else {
          setAlreadySubmitted(false); // Assume not submitted if error fetching
          // console.error('Failed to fetch today\'s scrum status');
        }
      } catch (error) {
        console.error('Error fetching today\'s scrum:', error);
        setAlreadySubmitted(false);
      }
    };

    fetchTodaysScrum();
  }, [user, router, toast]);


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
    if (alreadySubmitted === true) {
      toast({
        title: "Already Submitted",
        description: "You've already submitted your scrum for today.",
        variant: "default"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/daily-scrum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yesterday, today, impediments }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your daily scrum has been submitted.",
        });
        setAlreadySubmitted(true); // Mark as submitted
        router.push('/dashboard');
      } else {
        toast({
          title: "Submission Failed",
          description: data.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting daily scrum:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || alreadySubmitted === null) {
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
        {alreadySubmitted === true ? (
            <CardContent>
                <p className="text-center text-lg text-green-600">You have already submitted your daily scrum for today.</p>
                <p className="text-center text-sm text-muted-foreground mt-2">Yesterday: {yesterday}</p>
                <p className="text-center text-sm text-muted-foreground">Today: {today}</p>
                {impediments && <p className="text-center text-sm text-muted-foreground">Impediments: {impediments}</p>}
            </CardContent>
        ) : (
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
                  disabled={isSubmitting || alreadySubmitted === true}
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
                  disabled={isSubmitting || alreadySubmitted === true}
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
                  disabled={isSubmitting || alreadySubmitted === true}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting || authLoading || alreadySubmitted === true}>
                {isSubmitting ? <Spinner size="small" className="mr-2" /> : null}
                Submit Daily Scrum
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}

export default withAuth(DailyScrumPageContent);
