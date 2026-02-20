'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditGymExercise } from '@/components/fitness/edit-gym-exercise';
import { DeleteGymExercise } from '@/components/fitness/delete-gym-exercise';
import { routes } from '@/lib/routes';
import { ChevronLeft, Dumbbell } from 'lucide-react';

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
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={routes.fitnessGymExercises}><ChevronLeft className="size-4" /></Link>
                </Button>
            </div>

            <Card className="border-t-4 fitness-card-border">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Dumbbell className="size-5 text-primary" />
                            {exercise.title || 'Untitled'}
                        </CardTitle>
                        {exercise.body_part && (
                            <p className="text-sm text-muted-foreground">
                                <Badge variant="secondary">{exercise.body_part}</Badge>
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
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
