
'use client';

import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import withAuth from "@/components/layout/withAuth";
import { useAuth } from "@/contexts/AuthContext";
import type { UserForClient } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from "@/hooks/use-toast";


interface CommentData {
  id: string;
  text: string;
  createdAt: string; // ISO Date string
  user: Pick<UserForClient, 'id' | 'name' | 'email'> & { avatarUrl?: string }; // User who made the comment
}

interface ScrumEntryData {
  id: string;
  userId: string;
  user: Pick<UserForClient, 'id' | 'name' | 'email'> & { avatarUrl?: string }; // User who made the entry
  date: string; // ISO Date string
  yesterday: string;
  today: string;
  impediments?: string;
  createdAt: string; // ISO Date string
  comments: CommentData[];
}

function DailyStandupPageContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scrumEntries, setScrumEntries] = useState<ScrumEntryData[]>([]);
  const [newCommentTexts, setNewCommentTexts] = useState<Record<string, string>>({});
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});


  useEffect(() => {
    const fetchTodaysScrums = async () => {
      setIsLoadingEntries(true);
      try {
        const response = await fetch('/api/daily-scrum/today');
        if (response.ok) {
          const data = await response.json();
          setScrumEntries(data.logs || []);
        } else {
          console.error("Failed to fetch today's scrum entries");
          toast({ title: "Error", description: "Failed to load scrum entries.", variant: "destructive" });
          setScrumEntries([]);
        }
      } catch (error) {
        console.error("Error fetching today's scrum entries:", error);
        toast({ title: "Error", description: "Could not connect to server.", variant: "destructive" });
        setScrumEntries([]);
      } finally {
        setIsLoadingEntries(false);
      }
    };

    fetchTodaysScrums();
  }, [toast]);

  const handleAddComment = async (entryId: string) => {
    if (!user || !newCommentTexts[entryId]?.trim()) return;

    setIsSubmittingComment(prev => ({ ...prev, [entryId]: true }));

    try {
      const response = await fetch(`/api/daily-scrum/${entryId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newCommentTexts[entryId].trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        const newComment: CommentData = data.comment;
        setScrumEntries(prevEntries =>
          prevEntries.map(entry =>
            entry.id === entryId
              ? { ...entry, comments: [...entry.comments, newComment].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) }
              : entry
          )
        );
        setNewCommentTexts(prev => ({ ...prev, [entryId]: '' })); // Clear input
        toast({ title: "Success", description: "Comment added." });
      } else {
        toast({ title: "Error", description: data.error || "Failed to add comment.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({ title: "Error", description: "Could not connect to server.", variant: "destructive" });
    } finally {
      setIsSubmittingComment(prev => ({ ...prev, [entryId]: false }));
    }
  };

  const handleCommentInputChange = (entryId: string, text: string) => {
    setNewCommentTexts(prev => ({ ...prev, [entryId]: text }));
  };

  if (isLoadingEntries) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.32))] items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Daily Standup Feed</CardTitle>
          <CardDescription className="text-base">
            Review today&apos;s scrum updates from the team.
          </CardDescription>
        </CardHeader>
      </Card>

      {scrumEntries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No scrum entries for today yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {scrumEntries.map((entry) => (
            <Card key={entry.id} className="shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row items-start space-x-4 p-4 bg-card">
                <Avatar className="h-12 w-12 border-2 border-primary/50">
                  <AvatarImage src={entry.user.avatarUrl || `https://placehold.co/40x40/E91E63/white.png?text=${entry.user.name?.substring(0,2).toUpperCase()}`} alt={entry.user.name || 'User'} data-ai-hint="user avatar" />
                  <AvatarFallback className="text-lg">{entry.user.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold">{entry.user.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {format(new Date(entry.createdAt), "PPP 'at' p")}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="bg-muted/30 p-3 rounded-md">
                  <h4 className="font-semibold text-base mb-1 text-primary">Yesterday:</h4>
                  <p className="text-base text-foreground whitespace-pre-wrap">{entry.yesterday}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-md">
                  <h4 className="font-semibold text-base mb-1 text-primary">Today:</h4>
                  <p className="text-base text-foreground whitespace-pre-wrap">{entry.today}</p>
                </div>
                {entry.impediments && (
                  <div className="bg-destructive/10 p-3 rounded-md">
                    <h4 className="font-semibold text-base mb-1 text-destructive">Impediments:</h4>
                    <p className="text-base text-destructive-foreground whitespace-pre-wrap">{entry.impediments}</p>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="space-y-3">
                  <h5 className="text-md font-semibold text-foreground">Comments ({entry.comments.length})</h5>
                  {entry.comments.length > 0 && (
                    <ScrollArea className="h-auto max-h-60 pr-3">
                      <div className="space-y-3">
                        {entry.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                               <AvatarImage src={comment.user.avatarUrl || `https://placehold.co/24x24/78909C/white.png?text=${comment.user.name?.substring(0,1).toUpperCase()}`} alt={comment.user.name || 'User'} data-ai-hint="commenter avatar" />
                               <AvatarFallback>{comment.user.name?.substring(0,1).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-muted/50 p-2.5 rounded-lg">
                              <div className="flex items-center space-x-2 mb-0.5">
                                <span className="text-sm font-medium text-foreground">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                                </span>
                              </div>
                              <p className="text-sm text-foreground/90">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                  {entry.comments.length === 0 && (
                    <p className="text-sm text-muted-foreground pl-1">No comments yet. Be the first to comment!</p>
                  )}
                </div>

                {user && (
                  <form
                    onSubmit={(e: FormEvent) => {
                      e.preventDefault();
                      handleAddComment(entry.id);
                    }}
                    className="flex items-start space-x-3 pt-3 border-t border-border mt-4"
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0 mt-0.5">
                       <AvatarImage src={ (user as any).avatarUrl || `https://placehold.co/40x40/78909C/white.png?text=${user.name?.substring(0,1).toUpperCase()}`} alt={user.name || "User"} data-ai-hint="current user avatar" />
                       <AvatarFallback>{user.name?.substring(0,1).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <Input
                      type="text"
                      placeholder="Write a comment..."
                      value={newCommentTexts[entry.id] || ''}
                      onChange={(e) => handleCommentInputChange(entry.id, e.target.value)}
                      className="flex-grow text-base"
                      required
                      disabled={isSubmittingComment[entry.id]}
                      aria-label={`Comment on ${entry.user.name}'s update`}
                    />
                    <Button type="submit" size="default" className="h-10" disabled={isSubmittingComment[entry.id]}>
                      {isSubmittingComment[entry.id] ? <Spinner size="small" className="mr-1" /> : null}
                      Comment
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(DailyStandupPageContent);
