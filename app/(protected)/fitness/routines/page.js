import { RoutinesComponent } from '@/components/fitness/routines-component';

export const metadata = {
    title: 'Routines',
    description: 'Workout routines',
};

export default async function RoutinesPage() {
    return <RoutinesComponent />;
}
