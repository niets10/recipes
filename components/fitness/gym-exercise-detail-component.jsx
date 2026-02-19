'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditGymExerciseForm } from '@/components/fitness/edit-gym-exercise-form';
import { DeleteGymExercise } from '@/components/fitness/delete-gym-exercise';
import { routes } from '@/lib/routes';
import { ChevronLeft, Dumbbell } from 'lucide-react';
import { toastRichSuccess } from '@/lib/toast-library';

export function GymExerciseDetailComponent({ exercise }) {
    const handleSuccess = useCallback(() => {
        toastRichSuccess({ message: 'Exercise updated' });
    }, []);

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
                <h1 className="text-2xl font-semibold tracking-tight">{exercise.title || 'Untitled'}</h1>
                {exercise.body_part && <Badge variant="secondary">{exercise.body_part}</Badge>}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-t-4 border-t-primary/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Dumbbell className="size-5 text-primary" />
                            Details
                        </CardTitle>
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

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Edit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EditGymExerciseForm
                            exercise={exercise}
                            onSuccess={handleSuccess}
                            renderActions={({ isSubmitting }) => (
                                <div className="flex justify-end gap-2">
                                    <DeleteGymExercise exerciseId={exercise.id} exerciseTitle={exercise.title} />
                                    <Button type="submit" size="default" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving…' : 'Save'}
                                    </Button>
                                </div>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
