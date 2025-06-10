
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import withAuth from "@/components/layout/withAuth";
import { useAuth } from "@/contexts/AuthContext";

function DashboardPageContent() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your Dashboard, {user?.name || 'User'}!</p>
          <p>This is protected content.</p>
        </CardContent>
      </Card>
    </div>
  );
}
export default withAuth(DashboardPageContent);
