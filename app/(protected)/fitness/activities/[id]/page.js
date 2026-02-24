import { notFound } from 'next/navigation';
import { ActivityDetailComponent } from '@/components/fitness/activity-detail-component';
import { getActivityByIdAction } from '@/actions/database/activity-actions';
import { SetBreadcrumbLabel } from '@/components/application/set-breadcrumb-label';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const activity = await getActivityByIdAction(id).catch(() => null);
    return {
        title: activity?.title ? `${activity.title} | Activity` : 'Activity',
    };
}

export default async function ActivityPage({ params }) {
    const { id } = await params;
    const activity = await getActivityByIdAction(id).catch(() => null);
    if (!activity) notFound();

    return (
        <>
            <SetBreadcrumbLabel label={activity.title || 'Activity'} />
            <ActivityDetailComponent activity={activity} />
        </>
    );
}
