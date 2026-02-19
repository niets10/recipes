import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import { ListOrdered } from 'lucide-react';

export function RoutineCard({ routine, exerciseCount = 0 }) {
    return (
        <Link href={`${routes.fitnessRoutines}/${routine.id}`}>
            <Card
                className={cn(
                    'h-full border-t-4 border-t-primary/40 transition-all hover:border-t-primary hover:shadow-md cursor-pointer',
                )}
            >
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <ListOrdered className="size-4 text-primary" />
                        </div>
                        <h3 className="font-semibold leading-tight truncate">{routine.name || 'Untitled'}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {exerciseCount === 0 ? 'No exercises' : `${exerciseCount} exercise${exerciseCount === 1 ? '' : 's'}`}
                    </p>
                </CardHeader>
            </Card>
        </Link>
    );
}
