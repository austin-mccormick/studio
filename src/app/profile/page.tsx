import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Profile page. Content will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
