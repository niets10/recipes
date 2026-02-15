import Link from 'next/link';
import { getRecipeByIdAction } from '@/actions/database/recipe-actions';
import { routes } from '@/lib/routes';
import { titleToSlug } from '@/lib/utils';
import { SetBreadcrumbLabel } from '@/components/application/set-breadcrumb-label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditRecipe } from '@/components/recipes/edit-recipe';
import { DeleteRecipe } from '@/components/recipes/delete-recipe';
import { VideoEmbed } from '@/components/video-embed';
import { EditSocialUrl } from '@/components/recipes/edit-social-url';
import { MarkdownContent } from '@/components/ui/markdown-content';

export async function RecipeComponent({ params }) {
    const { recipeId } = await params;
    const recipe = await getRecipeByIdAction(recipeId);
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

    const recipeVideoUrl = recipe["social_media_url"];

    return (
        <div className="space-y-6">
            <SetBreadcrumbLabel label={breadcrumbLabel} />

            <div
                className={`grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start ${!recipeVideoUrl ? 'gap-y-0' : ''}`}
            >
                {/* Left column: Title + Description */}
                <div className="space-y-6 lg:row-start-1 lg:col-start-1">
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
                                <MarkdownContent>{recipe.description}</MarkdownContent>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right column: Social URL + Video */}
                <Card
                    className="min-w-0 mt-0 border-t-2 border-t-primary/40 self-start lg:row-start-1 lg:col-start-2"
                    style={{ boxShadow: 'var(--shadow-soft)' }}
                >
                    <CardContent className="pt-6 space-y-4">
                        <EditSocialUrl recipeId={recipe.id} initialUrl={recipe.social_media_url ?? ''} />
                        {recipeVideoUrl && (
                            <VideoEmbed url={recipeVideoUrl} className="w-full" />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
