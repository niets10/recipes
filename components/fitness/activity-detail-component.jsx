'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditActivity } from '@/components/fitness/edit-activity';
import { DeleteActivity } from '@/components/fitness/delete-activity';
import { BackLink } from '@/components/application/back-link';
import { routes } from '@/lib/routes';
import { Activity } from 'lucide-react';

export function ActivityDetailComponent({ activity }) {
    const router = useRouter();
    const refresh = useCallback(() => { router.refresh(); }, [router]);

    if (!activity) {
        return <div className="text-muted-foreground">Activity not found.</div>;
    }

    const meta = [activity.time_minutes != null && `${activity.time_minutes} min`, activity.calories != null && `${activity.calories} kcal`].filter(Boolean).join(' · ');

    return (
        <div className="space-y-6">
            <Card className="border-t-4 fitness-card-border">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-start gap-2">
                        <BackLink href={routes.fitnessActivities} label="Back to activities" />
                        <div className="space-y-1 min-w-0">
                        <CardTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            <Activity className="size-5 text-primary" />
                            {activity.title || 'Untitled'}
                        </CardTitle>
                        {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <EditActivity activity={activity} onSuccess={refresh} />
                        <DeleteActivity activityId={activity.id} activityTitle={activity.title} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    {activity.description && <p>{activity.description}</p>}
                </CardContent>
            </Card>
        </div>
    );
}
