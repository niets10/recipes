import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import { ChefHat } from 'lucide-react';

export function RecipeCard({ recipe, className, ...props }) {
    const { id, title, description, createdAt } = recipe;
    const dateLabel = createdAt
        ? new Date(createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : null;

    return (
        <Link href={`${routes.recipes}/${id}`} aria-label={`Open recipe: ${title || 'Untitled'}`}>
            <Card
                className={cn(
                    'h-full border-t-4 fitness-card-border transition-all hover:shadow-md cursor-pointer',
                    className
                )}
                {...props}
            >
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <ChefHat className="size-4 text-primary" />
                            </div>
                            <h3 className="font-semibold leading-tight truncate">{title || 'Untitled'}</h3>
                        </div>
                    </div>
                    {dateLabel && <p className="text-xs text-muted-foreground mt-1">{dateLabel}</p>}
                </CardHeader>
                {description && (
                    <CardContent className="pt-0">
                        <MarkdownContent className="text-sm text-muted-foreground line-clamp-2">
                            {description}
                        </MarkdownContent>
                    </CardContent>
                )}
            </Card>
        </Link>
    );
}
