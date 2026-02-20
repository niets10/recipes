import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/lib/routes';
import { ListOrdered } from 'lucide-react';

export function RoutineCard({ routine, exerciseCount = 0 }) {
    const description =
        exerciseCount === 0 ? 'No exercises' : `${exerciseCount} exercise${exerciseCount === 1 ? '' : 's'}`;

    return (
        <Link href={`${routes.fitnessRoutines}/${routine.id}`} aria-label={`Open routine: ${routine.name || 'Untitled'}`}>
            <Card className="modern-card modern-card-hover overflow-hidden active:scale-[0.99]">
                <CardHeader className="pb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <ListOrdered className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">{routine.name || 'Untitled'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-base">{description}</CardDescription>
                </CardContent>
            </Card>
        </Link>
    );
}
