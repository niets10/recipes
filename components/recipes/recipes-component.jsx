'use server';

import { Suspense } from 'react';
import { ChefHat } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeSearch } from '@/components/recipes/recipe-search';
import { RecipesList } from '@/components/recipes/recipes-list';
import { CreateRecipe } from '@/components/recipes/create-recipe';
// import { getRecipesPageAction } from '@/actions/database/recipe-actions';
import { getMockRecipes } from '@/data/mock-recipes';

export async function RecipesComponent({ searchParams }) {
    const params = await searchParams;
    const query = typeof params?.q === 'string' ? params.q.trim() || undefined : undefined;

    // const result = await getRecipesPageAction({ page: 0, query });
    // const initialRecipes = Array.isArray(result?.recipes) ? result.recipes : [];
    // const initialHasMore = Boolean(result?.hasMore);

    const initialRecipes = getMockRecipes({ query });
    const initialHasMore = false;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Recipes</h1>
                    <p className="text-muted-foreground mt-1">
                        {query ? `Search results for "${query}"` : 'Your recipe collection'}
                    </p>
                </div>
                <div className="flex w-full flex-1 items-center gap-2 sm:w-auto sm:flex-initial">
                    <div className="min-w-0 flex-1 sm:w-72">
                        <Suspense fallback={<Skeleton className="h-9 w-full" />}>
                            <RecipeSearch />
                        </Suspense>
                    </div>
                    <CreateRecipe />
                </div>
            </div>

            {initialRecipes.length === 0 && !initialHasMore ? (
                <div
                    className="rounded-xl border border-dashed border-primary/20 p-12 text-center"
                    style={{ background: 'var(--gradient-surface)' }}
                >
                    <ChefHat className="size-8 text-primary/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                        {query
                            ? 'No recipes match your search. Try a different term.'
                            : 'No recipes yet. Add your first recipe to get started.'}
                    </p>
                </div>
            ) : (
                <RecipesList
                    key={query ?? 'all'}
                    initialRecipes={initialRecipes}
                    initialHasMore={initialHasMore}
                    query={query}
                />
            )}
        </div>
    );
}
