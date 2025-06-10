import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Users page. Content will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
