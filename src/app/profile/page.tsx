
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import withAuth from "@/components/layout/withAuth";
import { useAuth } from "@/contexts/AuthContext";

function ProfilePageContent() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Profile page for {user?.name}. Content will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(ProfilePageContent);
