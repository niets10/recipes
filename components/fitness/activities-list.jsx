'use client';

import { useState, useCallback, useEffect } from 'react';
import { getActivitiesPageAction } from '@/actions/database/activity-actions';
import { ActivityCard } from '@/components/fitness/activity-card';
import { Button } from '@/components/ui/button';

export function ActivitiesList({ initialActivities, initialHasMore, query }) {
    const [activities, setActivities] = useState(initialActivities);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // When showing search results, refetch via the server action so we get the same data
    // shape as "all" (action return value). On client-side navigation, RSC payload
    // serialization can drop numeric fields (e.g. time_minutes, calories), so search
    // results would render with missing meta. Refetching avoids that.
    useEffect(() => {
        if (query === undefined) return;
        let cancelled = false;
        getActivitiesPageAction({ page: 0, query }).then((result) => {
            if (cancelled) return;
            const list = Array.isArray(result?.activities) ? result.activities : [];
            setActivities(list);
            setHasMore(Boolean(result?.hasMore));
            setPage(list.length > 0 ? 1 : 0);
        });
        return () => { cancelled = true; };
    }, [query]);

    // Sync with server data when not searching (initial load, or router.refresh())
    useEffect(() => {
        if (query !== undefined) return;
        setActivities(initialActivities);
        setHasMore(initialHasMore);
        setPage(initialActivities.length > 0 ? 1 : 0);
    }, [query, initialActivities, initialHasMore]);

    const loadMore = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getActivitiesPageAction({ page, query });
            setActivities((prev) => [...prev, ...(result.activities || [])]);
            setHasMore(result.hasMore ?? false);
            setPage((p) => p + 1);
        } finally {
            setLoading(false);
        }
    }, [page, query]);

    if (activities.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activities.map((a) => (
                    <ActivityCard key={a.id} activity={a} />
                ))}
            </div>
            {hasMore && (
                <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={loadMore} disabled={loading}>
                        {loading ? 'Loading…' : 'Load more'}
                    </Button>
                </div>
            )}
        </div>
    );
}
