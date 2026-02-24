import { RecipeDetailComponent } from '@/components/recipes/recipe-detail-component';

export default async function RecipePage({ params }) {
    return <RecipeDetailComponent params={params} />;
}
