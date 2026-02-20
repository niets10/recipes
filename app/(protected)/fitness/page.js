import Link from 'next/link';
import { routes } from '@/lib/routes';
import { ListOrdered, Dumbbell, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
    title: 'Fitness',
    description: 'Routines, gym exercises, and activities',
};

const links = [
    {
        title: 'Routines',
        href: routes.fitnessRoutines,
        icon: ListOrdered,
        description: 'Manage your workout routines',
    },
    {
        title: 'Gym Exercises',
        href: routes.fitnessGymExercises,
        icon: Dumbbell,
        description: 'Exercise library',
    },
    {
        title: 'Activities',
        href: routes.fitnessActivities,
        icon: Activity,
        description: 'Running, HIIT, and more',
    },
];

export default function FitnessPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Fitness</h1>
                <p className="text-muted-foreground text-base">Manage routines, exercises, and activities.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {links.map((item) => (
                    <Link href={item.href} key={item.title} aria-label={`Go to ${item.title}`}>
                        <Card
                            key={item.title}
                            className="modern-card modern-card-hover overflow-hidden active:scale-[0.99]"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-xl">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">{item.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
