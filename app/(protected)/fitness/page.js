import Link from 'next/link';
import { routes } from '@/lib/routes';
import { ListOrdered, Dumbbell, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Fitness',
    description: 'Routines, gym exercises, and activities',
};

const links = [
    { title: 'Routines', href: routes.fitnessRoutines, icon: ListOrdered, description: 'Manage your workout routines' },
    { title: 'Gym Exercises', href: routes.fitnessGymExercises, icon: Dumbbell, description: 'Exercise library' },
    { title: 'Activities', href: routes.fitnessActivities, icon: Activity, description: 'Running, HIIT, and more' },
];

export default function FitnessPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Fitness</h1>
                <p className="text-muted-foreground">Manage routines, exercises, and activities.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {links.map((item) => (
                    <Card key={item.title} className="overflow-hidden transition-colors hover:border-primary/50">
                        <CardHeader className="pb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="secondary" size="sm">
                                <Link href={item.href}>Open</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
