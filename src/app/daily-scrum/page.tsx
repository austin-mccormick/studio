import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DailyScrumPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Daily Scrum</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Daily Scrum page. Content will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
