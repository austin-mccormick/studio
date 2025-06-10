
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import withAuth from "@/components/layout/withAuth";
import { useAuth } from "@/contexts/AuthContext";

function DailyScrumPageContent() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Daily Scrum</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Daily Scrum page for {user?.name}. Content will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(DailyScrumPageContent);
