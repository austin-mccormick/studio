import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Settings page. Content will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
