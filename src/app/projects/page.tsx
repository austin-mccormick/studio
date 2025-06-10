import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Projects page. Content will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
