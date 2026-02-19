import { Suspense } from 'react';
import { Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivitiesList } from '@/components/fitness/activities-list';
import { CreateActivity } from '@/components/fitness/create-activity';
import { getActivitiesPageAction } from '@/actions/database/activity-actions';

export async function ActivitiesComponent({ searchParams }) {
    const params = await searchParams;
    const query = typeof params?.q === 'string' ? params.q.trim() || undefined : undefined;
    const result = await getActivitiesPageAction({ page: 0, query });
    const initialActivities = Array.isArray(result?.activities) ? result.activities : [];
    const initialHasMore = Boolean(result?.hasMore);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Activities</h1>
                    <p className="text-muted-foreground mt-1">Running, HIIT, gym session, etc.</p>
                </div>
                <CreateActivity />
            </div>

            {initialActivities.length === 0 && !initialHasMore ? (
                <div className="rounded-xl border border-dashed border-primary/20 p-12 text-center bg-muted/30">
                    <Activity className="size-8 text-primary/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">No activities yet. Add your first activity.</p>
                </div>
            ) : (
                <ActivitiesList
                    key={query ?? 'all'}
                    initialActivities={initialActivities}
                    initialHasMore={initialHasMore}
                    query={query}
                />
            )}
        </div>
    );
}
