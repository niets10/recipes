import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import { Activity } from 'lucide-react';

export function ActivityCard({ activity, className }) {
    const { id, title, time_minutes, calories, description } = activity;
    const meta = [time_minutes != null && `${time_minutes} min`, calories != null && `${calories} kcal`].filter(Boolean).join(' · ');

    return (
        <Link href={`${routes.fitnessActivities}/${id}`}>
            <Card
                className={cn(
                    'h-full border-t-4 border-t-primary/40 transition-all hover:border-t-primary hover:shadow-md cursor-pointer',
                    className
                )}
            >
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Activity className="size-4 text-primary" />
                        </div>
                        <h3 className="font-semibold leading-tight truncate">{title || 'Untitled'}</h3>
                    </div>
                    {meta && <p className="text-xs text-muted-foreground mt-1">{meta}</p>}
                </CardHeader>
                {description && (
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                    </CardContent>
                )}
            </Card>
        </Link>
    );
}
