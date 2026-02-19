'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditActivityForm } from '@/components/fitness/edit-activity-form';
import { DeleteActivity } from '@/components/fitness/delete-activity';
import { routes } from '@/lib/routes';
import { ChevronLeft, Activity } from 'lucide-react';
import { toastRichSuccess } from '@/lib/toast-library';

export function ActivityDetailComponent({ activity }) {
    const handleSuccess = useCallback(() => {
        toastRichSuccess({ message: 'Activity updated' });
    }, []);

    if (!activity) {
        return <div className="text-muted-foreground">Activity not found.</div>;
    }

    const meta = [activity.time_minutes != null && `${activity.time_minutes} min`, activity.calories != null && `${activity.calories} kcal`].filter(Boolean).join(' · ');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={routes.fitnessActivities}><ChevronLeft className="size-4" /></Link>
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">{activity.title || 'Untitled'}</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-t-4 border-t-primary/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="size-5 text-primary" />
                            Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        {meta && <p className="text-muted-foreground">{meta}</p>}
                        {activity.description && <p>{activity.description}</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Edit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EditActivityForm activity={activity} onSuccess={handleSuccess} />
                        <div className="mt-4 pt-4 border-t">
                            <DeleteActivity activityId={activity.id} activityTitle={activity.title} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
