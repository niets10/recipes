import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({ title, value, description, icon: Icon, className, ...props }) {
    return (
        <Card
            className={cn(
                'border-t-4 fitness-card-border transition-all',
                className
            )}
            {...props}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="text-sm font-medium text-muted-foreground">
                    {title}
                </span>
                {Icon && <Icon className="size-4 text-primary/70" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
