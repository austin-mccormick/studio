
'use client';

import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import withAuth from "@/components/layout/withAuth";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Comment {
  id: string;
  commenterId: string;
  commenterName: string;
  commenterAvatarUrl?: string;
  text: string;
  timestamp: Date;
}

interface ScrumEntry {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  timestamp: Date;
  yesterday: string;
  today: string;
  impediments: string;
  comments: Comment[];
}

// Dummy data - in a real app, this would come from an API
const initialScrumEntries: ScrumEntry[] = [
  {
    id: 'entry1',
    userId: 'user1_id',
    userName: 'Alice Wonderland',
    avatarUrl: 'https://placehold.co/40x40/E91E63/white.png?text=AW',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 0.5)), // Half a day ago
    yesterday: 'Deployed the new feature X to staging and ran initial tests. All green so far!',
    today: 'Will work on integrating the payment gateway and address feedback from QA on feature Y.',
    impediments: 'Waiting for updated API documentation for the payment gateway.',
    comments: [
      { id: 'comment1_1', commenterId: 'user2_id', commenterName: 'Bob The Builder', commenterAvatarUrl: 'https://placehold.co/24x24/FFC107/black.png?text=BB', text: 'Great progress, Alice! Let me know if you need help with the payment gateway docs, I looked at them last week.', timestamp: new Date(new Date().setHours(new Date().getHours() - 2)) },
      { id: 'comment1_2', commenterId: 'user1_id', commenterName: 'Alice Wonderland', commenterAvatarUrl: 'https://placehold.co/24x24/E91E63/white.png?text=AW', text: 'Thanks, Bob! I might take you up on that offer if I get stuck.', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)) },
    ],
  },
  {
    id: 'entry2',
    userId: 'user2_id',
    userName: 'Bob The Builder',
    avatarUrl: 'https://placehold.co/40x40/FFC107/black.png?text=BB',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 0.2)), // Few hours ago
    yesterday: 'Finished reviewing all pending pull requests and merged three of them. Also, helped Charlie debug an issue with the CI pipeline.',
    today: 'Planning to start the refactor of the old reporting module. This is a big task.',
    impediments: '',
    comments: [
       { id: 'comment2_1', commenterId: 'user3_id', commenterName: 'Charlie Brown', commenterAvatarUrl: 'https://placehold.co/24x24/4CAF50/white.png?text=CB', text: 'Good luck with the reporting module refactor, Bob! It definitely needs it.', timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 30)) },
    ],
  },
  {
    id: 'entry3',
    userId: 'user3_id',
    userName: 'Charlie Brown',
    avatarUrl: 'https://placehold.co/40x40/4CAF50/white.png?text=CB',
    timestamp: new Date(), // Now
    yesterday: 'Attended the design review meeting for the new dashboard. Provided feedback on UX flows.',
    today: 'Will implement the agreed-upon changes to the dashboard mockups and prepare them for developer handoff.',
    impediments: 'Need final sign-off on the color palette from marketing.',
    comments: [],
  },
].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Ensure chronological order (newest first)


function DailyStandupPageContent() {
  const { user } = useAuth();
  const [scrumEntries, setScrumEntries] = useState<ScrumEntry[]>(initialScrumEntries);
  const [newCommentTexts, setNewCommentTexts] = useState<Record<string, string>>({});

  const handleAddComment = (entryId: string) => {
    if (!user || !newCommentTexts[entryId]?.trim()) return;

    const newComment: Comment = {
      id: `comment_${entryId}_${new Date().getTime()}`, // Simple unique ID
      commenterId: user.id,
      commenterName: user.name || 'Anonymous User',
      commenterAvatarUrl: 'https://placehold.co/24x24/78909C/white.png?text=CU', // Current User placeholder
      text: newCommentTexts[entryId].trim(),
      timestamp: new Date(),
    };

    setScrumEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === entryId
          ? { ...entry, comments: [...entry.comments, newComment].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()) } // Keep comments chronological (oldest first)
          : entry
      )
    );
    setNewCommentTexts(prev => ({ ...prev, [entryId]: '' })); // Clear input
  };

  const handleCommentInputChange = (entryId: string, text: string) => {
    setNewCommentTexts(prev => ({ ...prev, [entryId]: text }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Daily Standup Feed</CardTitle>
          <CardDescription className="text-base">
            Review today&apos;s scrum updates from the team.
            {/* In a real app, you'd filter by date here. */}
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
                  <AvatarImage src={entry.avatarUrl} alt={entry.userName} data-ai-hint="user avatar" />
                  <AvatarFallback className="text-lg">{entry.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold">{entry.userName}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {format(entry.timestamp, "PPP 'at' p")} {/* e.g., June 20, 2024 at 2:30 PM */}
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
                    <ScrollArea className="h-auto max-h-60 pr-3"> {/* Scroll for many comments */}
                      <div className="space-y-3">
                        {entry.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                               <AvatarImage src={comment.commenterAvatarUrl} alt={comment.commenterName} data-ai-hint="commenter avatar" />
                               <AvatarFallback>{comment.commenterName.substring(0,1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-muted/50 p-2.5 rounded-lg">
                              <div className="flex items-center space-x-2 mb-0.5">
                                <span className="text-sm font-medium text-foreground">{comment.commenterName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(comment.timestamp, "MMM d, h:mm a")}
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
                       <AvatarImage src="https://placehold.co/40x40/78909C/white.png?text=ME" alt={user.name || "User"} data-ai-hint="current user avatar" />
                       <AvatarFallback>{user.name?.substring(0,1).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <Input
                      type="text"
                      placeholder="Write a comment..."
                      value={newCommentTexts[entry.id] || ''}
                      onChange={(e) => handleCommentInputChange(entry.id, e.target.value)}
                      className="flex-grow text-base"
                      required
                      aria-label={`Comment on ${entry.userName}'s update`}
                    />
                    <Button type="submit" size="default" className="h-10">Comment</Button>
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
