import { getRecipeByIdAction } from '@/actions/database/recipe-actions';
import { routes } from '@/lib/routes';
import { titleToSlug } from '@/lib/utils';
import { SetBreadcrumbLabel } from '@/components/application/set-breadcrumb-label';
import { BackLink } from '@/components/application/back-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditRecipe } from '@/components/recipes/edit-recipe';
import { DeleteRecipe } from '@/components/recipes/delete-recipe';
import { VideoEmbed } from '@/components/video-embed';
import { EditSocialUrl } from '@/components/recipes/edit-social-url';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { UtensilsCrossed } from 'lucide-react';

export async function RecipeDetailComponent({ params }) {
    const { recipeId } = await params;
    const recipe = await getRecipeByIdAction(recipeId);

    if (!recipe) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <BackLink label="Back to recipes" />
                    <span className="text-muted-foreground">Recipe not found.</span>
                </div>
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
    const recipeVideoUrl = recipe.social_media_url;

    return (
        <div className="space-y-6">
            <SetBreadcrumbLabel label={breadcrumbLabel} />

            <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start ${!recipeVideoUrl ? 'gap-y-0' : ''}`}>
                {/* Left: title + description (activity-detail style) */}
                <div className="space-y-6 lg:row-start-1 lg:col-start-1">
                    <Card className="border-t-4 fitness-card-border">
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div className="flex min-w-0 flex-1 items-start gap-2">
                                <BackLink label="Back to recipes" />
                                <div className="space-y-1 min-w-0">
                                <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                                    <UtensilsCrossed className="size-5 text-primary" />
                                    {recipe.title || 'Untitled'}
                                </CardTitle>
                                {dateLabel && <p className="text-sm text-muted-foreground">{dateLabel}</p>}
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <EditRecipe recipe={recipe} />
                                <DeleteRecipe recipe={recipe} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {recipe.description && (
                                <div>
                                    <MarkdownContent>{recipe.description}</MarkdownContent>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right: video URL + embed */}
                <Card className="min-w-0 mt-0 border-t-4 fitness-card-border self-start lg:row-start-1 lg:col-start-2">
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
