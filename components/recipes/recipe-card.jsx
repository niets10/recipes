import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';

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
        <Link href={`${routes.recipes}/${id}`}>
            <Card
                className={cn(
                    'h-full border-t-2 border-t-primary/30 transition-all hover:border-t-primary/70 hover:shadow-warm-effect cursor-pointer',
                    className
                )}
                {...props}
            >
                <CardHeader className="pb-2">
                    <h3 className="font-semibold leading-tight line-clamp-2">
                        {title || 'Untitled'}
                    </h3>
                    {dateLabel && (
                        <p className="text-xs text-muted-foreground">
                            {dateLabel}
                        </p>
                    )}
                </CardHeader>
                {description && (
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">
                            {description}
                        </p>
                    </CardContent>
                )}
            </Card>
        </Link>
    );
}
