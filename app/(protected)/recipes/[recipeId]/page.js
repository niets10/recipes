import { Suspense } from 'react';
import { RecipeComponent } from '@/components/recipes/recipe-component';

export default async function RecipePage({ params }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RecipeComponent params={params} />
        </Suspense>
    );
}
