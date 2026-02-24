import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Reusable fitness entity card in Gym Exercises style.
 * @param {string} href - Link URL
 * @param {React.ReactNode} icon - Icon element (e.g. <Dumbbell className="size-4 text-primary" />)
 * @param {string} title - Card title
 * @param {string} [meta] - Optional meta line (e.g. "3 sets · 10 reps")
 * @param {string} [description] - Optional description (line-clamp-2)
 * @param {React.ReactNode} [badge] - Optional badge in header (e.g. body part)
 * @param {string} [ariaLabel] - Optional aria-label for the link
 * @param {string} [className] - Optional extra class names
 */
export function FitnessEntityCard({ href, icon, title, meta, description, badge, ariaLabel, className }) {
    return (
        <Link href={href} aria-label={ariaLabel} className="min-w-0 block">
            <Card
                className={cn(
                    'h-full min-w-0 border-t-4 fitness-card-border transition-all hover:shadow-md cursor-pointer overflow-hidden',
                    className
                )}
            >
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                {icon}
                            </div>
                            <h3 className="font-semibold leading-tight truncate">{title || 'Untitled'}</h3>
                        </div>
                        {badge != null && <div className="shrink-0">{badge}</div>}
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
