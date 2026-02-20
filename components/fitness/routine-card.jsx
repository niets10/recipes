import { FitnessEntityCard } from '@/components/fitness/fitness-entity-card';
import { routes } from '@/lib/routes';
import { ListOrdered } from 'lucide-react';

export function RoutineCard({ routine, exerciseCount = 0 }) {
    const description =
        exerciseCount === 0 ? 'No exercises' : `${exerciseCount} exercise${exerciseCount === 1 ? '' : 's'}`;

    return (
        <FitnessEntityCard
            href={`${routes.fitnessRoutines}/${routine.id}`}
            icon={<ListOrdered className="size-4 text-primary" />}
            title={routine.name}
            meta={description}
            ariaLabel={`Open routine: ${routine.name || 'Untitled'}`}
        />
    );
}
