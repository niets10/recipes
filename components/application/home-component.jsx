import Link from 'next/link';
import { ChefHat, BookOpen, ArrowRight } from 'lucide-react';
import { StatCard } from '@/components/application/stat-card';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';
import { getRecipeCountAction } from '@/actions/database/recipe-actions';

export async function HomeComponent() {
    const totalRecipes = await getRecipeCountAction();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of your recipe collection.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total recipes"
                    value={totalRecipes}
                    description="Recipes in your collection"
                    icon={BookOpen}
                />
                <StatCard
                    title="Quick action"
                    value="Browse"
                    description="Search and view all recipes"
                    icon={ChefHat}
                />
            </div>

            <div
                className="rounded-xl border border-primary/15 p-6"
                style={{ background: 'var(--gradient-surface)' }}
            >
                <div className="flex items-center gap-2 mb-1">
                    <ChefHat className="size-5 text-primary" />
                    <h2 className="font-medium">Get started</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                    View and search your recipes from the Recipes section.
                </p>
                <Button asChild size="sm">
                    <Link href={routes.recipes}>
                        Go to Recipes
                        <ArrowRight className="size-4 ml-1" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
