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
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                        <ListOrdered className="h-7 w-7" />
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
