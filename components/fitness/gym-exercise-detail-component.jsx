'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditGymExercise } from '@/components/fitness/edit-gym-exercise';
import { DeleteGymExercise } from '@/components/fitness/delete-gym-exercise';
import { BackLink } from '@/components/application/back-link';
import { routes } from '@/lib/routes';
import { Dumbbell } from 'lucide-react';

export function GymExerciseDetailComponent({ exercise }) {
    const router = useRouter();
    const refresh = useCallback(() => { router.refresh(); }, [router]);

    if (!exercise) {
        return (
            <div className="text-muted-foreground">Exercise not found.</div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="border-t-4 fitness-card-border">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-start gap-2">
                        <BackLink href={routes.fitnessGymExercises} label="Back to gym exercises" />
                        <div className="space-y-1 min-w-0">
                        <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Dumbbell className="size-5 text-primary" />
                            {exercise.title || 'Untitled'}
                        </CardTitle>
                        {exercise.body_part && (
                            <div className="text-sm text-muted-foreground">
                                <Badge variant="secondary">{exercise.body_part}</Badge>
                            </div>
                        )}
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <EditGymExercise exercise={exercise} onSuccess={refresh} />
                        <DeleteGymExercise exerciseId={exercise.id} exerciseTitle={exercise.title} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    {(exercise.sets != null || exercise.reps != null || exercise.weight != null) && (
                        <p className="text-muted-foreground">
                            {[exercise.sets != null && `${exercise.sets} sets`, exercise.reps != null && `${exercise.reps} reps`, exercise.weight != null && `${exercise.weight} kg`].filter(Boolean).join(' · ')}
                        </p>
                    )}
                    {exercise.description && <p>{exercise.description}</p>}
                    {exercise.comments && <p className="text-muted-foreground italic">{exercise.comments}</p>}
                </CardContent>
            </Card>
        </div>
    );
}
