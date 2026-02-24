import { Suspense } from 'react';
import { Dumbbell } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { GymExerciseSearch } from '@/components/fitness/gym-exercise-search';
import { GymExerciseBodyPartFilter } from '@/components/fitness/gym-exercise-body-part-filter';
import { GymExercisesList } from '@/components/fitness/gym-exercises-list';
import { CreateGymExercise } from '@/components/fitness/create-gym-exercise';
import {
    getGymExercisesPageAction,
    getDistinctBodyPartsAction,
} from '@/actions/database/gym-exercise-actions';

export async function GymExercisesComponent({ searchParams }) {
    const params = await searchParams;
    const query = typeof params?.q === 'string' ? params.q.trim() || undefined : undefined;
    const bodyPart = typeof params?.body === 'string' ? params.body.trim() || undefined : undefined;

    const [result, bodyParts] = await Promise.all([
        getGymExercisesPageAction({ page: 0, query, bodyPart }),
        getDistinctBodyPartsAction(),
    ]);
    const initialExercises = Array.isArray(result?.exercises) ? result.exercises : [];
    const initialHasMore = Boolean(result?.hasMore);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Gym exercises</h1>
                    <p className="text-muted-foreground mt-1">
                        {query
                            ? `Results for "${query}"`
                            : bodyPart
                              ? `${bodyPart} exercises`
                              : 'Your exercise library'}
                    </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:flex-initial">
                    <div>
                        <GymExerciseBodyPartFilter bodyParts={bodyParts} />
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                        <div className="min-w-0 flex-1 sm:w-72">
                            <Suspense fallback={<Skeleton className="h-9 w-full" />}>
                                <GymExerciseSearch />
                            </Suspense>
                        </div>
                        <CreateGymExercise />
                    </div>
                </div>
            </div>

            {initialExercises.length === 0 && !initialHasMore ? (
                <div className="rounded-xl border border-dashed border-primary/20 p-12 text-center bg-muted/30">
                    <Dumbbell className="size-8 text-primary/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                        {query || bodyPart
                            ? 'No exercises match your search or filter.'
                            : 'No exercises yet. Add your first exercise.'}
                    </p>
                </div>
            ) : (
                <GymExercisesList
                    key={[query, bodyPart].filter(Boolean).join('-') || 'all'}
                    initialExercises={initialExercises}
                    initialHasMore={initialHasMore}
                    query={query}
                    bodyPart={bodyPart}
                />
            )}
        </div>
    );
}
