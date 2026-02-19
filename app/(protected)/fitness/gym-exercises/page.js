import { GymExercisesComponent } from '@/components/fitness/gym-exercises-component';

export const metadata = {
    title: 'Gym exercises',
    description: 'Your exercise library',
};

export default async function GymExercisesPage({ searchParams }) {
    return <GymExercisesComponent searchParams={searchParams} />;
}
