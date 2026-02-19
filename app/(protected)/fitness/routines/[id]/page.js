import { notFound } from 'next/navigation';
import { RoutineDetailComponent } from '@/components/fitness/routine-detail-component';
import { getRoutineByIdAction } from '@/actions/database/routine-actions';
import { SetBreadcrumbLabel } from '@/components/application/set-breadcrumb-label';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const routine = await getRoutineByIdAction(id).catch(() => null);
    return {
        title: routine?.name ? `${routine.name} | Routine` : 'Routine',
    };
}

export default async function RoutinePage({ params }) {
    const { id } = await params;
    const routine = await getRoutineByIdAction(id).catch(() => null);
    if (!routine) notFound();

    return (
        <>
            <SetBreadcrumbLabel label={routine.name || 'Routine'} />
            <RoutineDetailComponent routine={routine} />
        </>
    );
}
