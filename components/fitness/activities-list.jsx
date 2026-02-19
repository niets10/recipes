'use client';

import { useState, useCallback } from 'react';
import { getActivitiesPageAction } from '@/actions/database/activity-actions';
import { ActivityCard } from '@/components/fitness/activity-card';
import { Button } from '@/components/ui/button';

export function ActivitiesList({ initialActivities, initialHasMore, query }) {
    const [activities, setActivities] = useState(initialActivities);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

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
