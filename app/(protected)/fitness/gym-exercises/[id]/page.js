import { notFound } from 'next/navigation';
import { GymExerciseDetailComponent } from '@/components/fitness/gym-exercise-detail-component';
import { getGymExerciseByIdAction } from '@/actions/database/gym-exercise-actions';
import { SetBreadcrumbLabel } from '@/components/application/set-breadcrumb-label';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const exercise = await getGymExerciseByIdAction(id).catch(() => null);
    return {
        title: exercise?.title ? `${exercise.title} | Gym exercise` : 'Gym exercise',
    };
}

export default async function GymExercisePage({ params }) {
    const { id } = await params;
    const exercise = await getGymExerciseByIdAction(id).catch(() => null);
    if (!exercise) notFound();

    return (
        <>
            <SetBreadcrumbLabel label={exercise.title || 'Exercise'} />
            <GymExerciseDetailComponent exercise={exercise} />
        </>
    );
}
