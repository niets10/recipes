import { RoutinesComponent } from '@/components/fitness/routines-component';

export const metadata = {
    title: 'Routines',
    description: 'Workout routines',
};

export default async function RoutinesPage({ searchParams }) {
    return <RoutinesComponent searchParams={searchParams} />;
}
