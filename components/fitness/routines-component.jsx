import { ListOrdered } from 'lucide-react';
import { RoutineCard } from '@/components/fitness/routine-card';
import { CreateRoutine } from '@/components/fitness/create-routine';
import { getRoutinesWithCountsAction } from '@/actions/database/routine-actions';

export async function RoutinesComponent() {
    const routinesWithCounts = await getRoutinesWithCountsAction();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Routines</h1>
                    <p className="text-muted-foreground mt-1">Workout routines (collections of exercises)</p>
                </div>
                <CreateRoutine />
            </div>

            {routinesWithCounts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-primary/20 p-12 text-center bg-muted/30">
                    <ListOrdered className="size-8 text-primary/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">No routines yet. Create your first routine.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {routinesWithCounts.map((r) => (
                        <RoutineCard key={r.id} routine={r} exerciseCount={r.exerciseCount} />
                    ))}
                </div>
            )}
        </div>
    );
}
