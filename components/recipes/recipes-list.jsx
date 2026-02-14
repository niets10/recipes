'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecipesPageAction } from '@/actions/database/recipe-actions';

export function RecipesList({ initialRecipes = [], initialHasMore, query }) {
    const [recipes, setRecipes] = useState(initialRecipes);
    const [hasMore, setHasMore] = useState(initialHasMore ?? false);
    const [page, setPage] = useState(initialRecipes.length > 0 ? 1 : 0);
    const [isLoading, setIsLoading] = useState(false);
    const sentinelRef = useRef(null);

    useEffect(() => {
        setRecipes(initialRecipes);
        setHasMore(initialHasMore ?? false);
        setPage(initialRecipes.length > 0 ? 1 : 0);
    }, [initialRecipes, initialHasMore]);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const result = await getRecipesPageAction({ page, query });
            if (result?.error) {
                setHasMore(false);
                return;
            }
            const { recipes: nextRecipes, hasMore: nextHasMore } = result;
            setRecipes((prev) => [...prev, ...(nextRecipes || [])]);
            setHasMore(nextHasMore ?? false);
            setPage((p) => p + 1);
        } finally {
            setIsLoading(false);
        }
    }, [page, query, hasMore, isLoading]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry?.isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { rootMargin: '200px', threshold: 0 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, isLoading, loadMore]);

    if (recipes.length === 0) {
        return null;
    }

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
            <div ref={sentinelRef} className="h-2 min-h-2 w-full" aria-hidden="true" />
            {isLoading && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            )}
        </>
    );
}
