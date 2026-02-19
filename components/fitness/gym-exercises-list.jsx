'use client';

import { useState, useCallback } from 'react';
import { getGymExercisesPageAction } from '@/actions/database/gym-exercise-actions';
import { GymExerciseCard } from '@/components/fitness/gym-exercise-card';
import { Button } from '@/components/ui/button';

export function GymExercisesList({ initialExercises, initialHasMore, query, bodyPart }) {
    const [exercises, setExercises] = useState(initialExercises);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadMore = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getGymExercisesPageAction({ page, query, bodyPart });
            setExercises((prev) => [...prev, ...(result.exercises || [])]);
            setHasMore(result.hasMore ?? false);
            setPage((p) => p + 1);
        } finally {
            setLoading(false);
        }
    }, [page, query, bodyPart]);

    if (exercises.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {exercises.map((ex) => (
                    <GymExerciseCard key={ex.id} exercise={ex} />
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
