import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import { Dumbbell } from 'lucide-react';

export function GymExerciseCard({ exercise, className }) {
    const { id, title, body_part, sets, reps, weight, description } = exercise;
    const meta = [sets != null && `${sets} sets`, reps != null && `${reps} reps`, weight != null && `${weight} kg`].filter(Boolean).join(' · ');

    return (
        <Link href={`${routes.fitnessGymExercises}/${id}`}>
            <Card
                className={cn(
                    'h-full border-t-4 border-t-primary/40 transition-all hover:border-t-primary hover:shadow-md cursor-pointer',
                    className
                )}
            >
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Dumbbell className="size-4 text-primary" />
                            </div>
                            <h3 className="font-semibold leading-tight truncate">{title || 'Untitled'}</h3>
                        </div>
                        {body_part && (
                            <Badge variant="secondary" className="shrink-0 text-xs">{body_part}</Badge>
                        )}
                    </div>
                    {meta && <p className="text-xs text-muted-foreground mt-1">{meta}</p>}
                </CardHeader>
                {description && (
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                    </CardContent>
                )}
            </Card>
        </Link>
    );
}
