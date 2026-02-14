import { RecipesComponent } from '@/components/recipes/recipes-component';
import { Suspense } from 'react';
export const metadata = {
    title: 'Recipes',
    description: 'Browse and search your recipes',
};

export default async function RecipesPage({ searchParams }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RecipesComponent searchParams={searchParams} />
        </Suspense>
    );
}
