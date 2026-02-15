import Link from 'next/link';
import { getRecipeByIdAction } from '@/actions/database/recipe-actions';
import { routes } from '@/lib/routes';
import { titleToSlug } from '@/lib/utils';
import { SetBreadcrumbLabel } from '@/components/application/set-breadcrumb-label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditRecipe } from '@/components/recipes/edit-recipe';
import { DeleteRecipe } from '@/components/recipes/delete-recipe';
import { BackButton } from '@/components/application/back-button';
import { VideoEmbed } from '@/components/video-embed';

export async function RecipeComponent({ params }) {
    const { recipeId } = await params;
    const recipe = await getRecipeByIdAction({ id: recipeId });

    // TODO: Get link from database
    if (!recipe) {
        return (
            <div className="space-y-4">
                <p className="text-muted-foreground">Recipe not found.</p>
                <Link
                    href={routes.recipes}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Back to recipes
                </Link>
            </div>
        );
    }

    const dateLabel = recipe.createdAt
        ? new Date(recipe.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : null;

    const breadcrumbLabel = titleToSlug(recipe.title);

    const recipeVideoUrl = process.env.NEXT_PUBLIC_INSTAGRAM_RECIPE_VIDEO_URL;

    return (
        <div className="space-y-6">
            <SetBreadcrumbLabel label={breadcrumbLabel} />

            <div
                className={
                    recipeVideoUrl
                        ? 'grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start'
                        : 'space-y-6'
                }
            >
                {/* Left column: Title + Description */}
                <div className="space-y-6">
                    <Card
                        className="border-t-2 border-t-primary/40"
                        style={{ boxShadow: 'var(--shadow-soft)' }}
                    >
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-semibold tracking-tight">
                                    {recipe.title}
                                </CardTitle>
                                {dateLabel && (
                                    <p className="text-sm text-muted-foreground">{dateLabel}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <EditRecipe recipe={recipe} />
                                <DeleteRecipe recipe={recipe} />
                            </div>
                        </CardHeader>
                    </Card>

                    {recipe.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {recipe.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right column: Video */}
                {recipeVideoUrl && (
                    <section className="min-w-0 rounded-xl border bg-card p-4 lg:sticky lg:top-4">
                        <VideoEmbed url={recipeVideoUrl} className="w-full" />
                    </section>
                )}
            </div>
        </div>
    );
}
