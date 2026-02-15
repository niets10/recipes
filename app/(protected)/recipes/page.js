import { RecipesComponent } from '@/components/recipes/recipes-component';

export const metadata = {
    title: 'Recipes',
    description: 'Browse and search your recipes',
};

export default async function RecipesPage({ searchParams }) {
    return <RecipesComponent searchParams={searchParams} />;
}
