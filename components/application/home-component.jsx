import { getRecipeCountAction } from '@/actions/database/recipe-actions';
import { getHomeFitnessSummaryAction } from '@/actions/database/daily-statistic-actions';
import { HomeFitnessStats } from '@/components/application/home-fitness-stats';
import { HomeRecipesStats } from '@/components/application/home-recipes-stats';

export async function HomeComponent() {
    const [totalRecipes, homeFitness] = await Promise.all([
        getRecipeCountAction(),
        getHomeFitnessSummaryAction().catch(() => ({ error: true })),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Overview of your recipe collection and fitness.
                </p>
            </div>
            <HomeRecipesStats totalRecipes={totalRecipes} />

            <HomeFitnessStats data={homeFitness} />
        </div>
    );
}
