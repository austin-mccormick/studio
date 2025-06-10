import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Welcome to StructureFlow</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamline your project management and daily scrums with our intuitive platform. 
          Achieve clarity, collaboration, and efficiency like never before.
        </p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader>
            <CardTitle className="font-headline">Daily Scrum</CardTitle>
            <CardDescription>Quickly manage and participate in daily stand-ups.</CardDescription>
          </CardHeader>
          <CardContent>
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Daily Scrum illustration" 
              width={600} 
              height={400} 
              className="rounded-md mb-4"
              data-ai-hint="team meeting" 
            />
            <p className="text-sm mb-4">Keep your team aligned with focused daily updates. Track progress, identify blockers, and foster communication.</p>
            <Button className="w-full">Go to Daily Scrum</Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader>
            <CardTitle className="font-headline">Project Management</CardTitle>
            <CardDescription>Organize tasks, track progress, and collaborate effectively.</CardDescription>
          </CardHeader>
          <CardContent>
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Project Management illustration" 
              width={600} 
              height={400} 
              className="rounded-md mb-4"
              data-ai-hint="kanban board"
            />
            <p className="text-sm mb-4">From planning to execution, manage your projects seamlessly. Visualize workflows and hit your deadlines.</p>
            <Button className="w-full">View Projects</Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader>
            <CardTitle className="font-headline">Dashboard Insights</CardTitle>
            <CardDescription>Get a clear overview of your team's performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Dashboard illustration" 
              width={600} 
              height={400} 
              className="rounded-md mb-4"
              data-ai-hint="charts graphs"
            />
            <p className="text-sm mb-4">Make data-driven decisions with comprehensive dashboards. Monitor key metrics and team productivity at a glance.</p>
            <Button className="w-full">Explore Dashboard</Button>
          </CardContent>
        </Card>
      </div>

      <section className="text-center py-10 bg-card rounded-lg shadow-md">
        <h2 className="text-3xl font-bold font-headline mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Join thousands of teams already boosting their productivity with StructureFlow.
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          Sign Up Now
        </Button>
      </section>
    </div>
  );
}
