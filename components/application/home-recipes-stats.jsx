import { StatCard } from '@/components/application/stat-card';
import { BookOpen, ChefHat } from 'lucide-react';

export function HomeRecipesStats({ totalRecipes }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <ChefHat className="size-5 text-primary" />
                <h2 className="font-medium">Recipes at a glance</h2>
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
        </div>
    );
}
