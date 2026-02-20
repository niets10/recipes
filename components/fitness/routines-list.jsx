'use client';

import { useState, useCallback, useEffect } from 'react';
import { getRoutinesPageAction } from '@/actions/database/routine-actions';
import { RoutineCard } from '@/components/fitness/routine-card';
import { Button } from '@/components/ui/button';

export function RoutinesList({ initialRoutines, initialHasMore, query }) {
    const [routines, setRoutines] = useState(initialRoutines);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [page, setPage] = useState(initialRoutines.length > 0 ? 1 : 0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setRoutines(initialRoutines);
        setHasMore(initialHasMore);
        setPage(initialRoutines.length > 0 ? 1 : 0);
    }, [initialRoutines, initialHasMore]);

    const loadMore = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getRoutinesPageAction({ page, query });
            setRoutines((prev) => [...prev, ...(result.routines || [])]);
            setHasMore(result.hasMore ?? false);
            setPage((p) => p + 1);
        } finally {
            setLoading(false);
        }
    }, [page, query]);

    if (routines.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {routines.map((r) => (
                    <RoutineCard key={r.id} routine={r} exerciseCount={r.exerciseCount} />
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
