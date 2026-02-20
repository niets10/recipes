import { Suspense } from 'react';
import { ListOrdered } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EntitySearch } from '@/components/fitness/entity-search';
import { RoutinesList } from '@/components/fitness/routines-list';
import { CreateRoutine } from '@/components/fitness/create-routine';
import { getRoutinesPageAction } from '@/actions/database/routine-actions';
import { routes } from '@/lib/routes';

export async function RoutinesComponent({ searchParams }) {
    const params = await searchParams;
    const query = typeof params?.q === 'string' ? params.q.trim() || undefined : undefined;
    const result = await getRoutinesPageAction({ page: 0, query });
    const initialRoutines = Array.isArray(result?.routines) ? result.routines : [];
    const initialHasMore = Boolean(result?.hasMore);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Routines</h1>
                    <p className="text-muted-foreground mt-1">
                        {query ? `Results for "${query}"` : 'Workout routines (collections of exercises)'}
                    </p>
                </div>
                <div className="flex w-full flex-1 items-center gap-2 sm:w-auto sm:flex-initial">
                    <div className="min-w-0 flex-1 sm:w-72">
                        <Suspense fallback={<Skeleton className="h-9 w-full" />}>
                            <EntitySearch
                                basePath={routes.fitnessRoutines}
                                placeholder="Search routines…"
                                ariaLabel="Search routines"
                            />
                        </Suspense>
                    </div>
                    <CreateRoutine />
                </div>
            </div>

            {initialRoutines.length === 0 && !initialHasMore ? (
                <div className="rounded-xl border border-dashed border-primary/20 p-12 text-center bg-muted/30">
                    <ListOrdered className="size-8 text-primary/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                        {query ? 'No routines match your search.' : 'No routines yet. Create your first routine.'}
                    </p>
                </div>
            ) : (
                <RoutinesList
                    key={query ?? 'all'}
                    initialRoutines={initialRoutines}
                    initialHasMore={initialHasMore}
                    query={query}
                />
            )}
        </div>
    );
}
