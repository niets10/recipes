import { RecipeComponent } from '@/components/recipes/recipe-component';

export default async function RecipePage({ params }) {
    return <RecipeComponent params={params} />;
}
