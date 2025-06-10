import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Dashboard page. Content will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
