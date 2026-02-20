import { Badge } from '@/components/ui/badge';
import { FitnessEntityCard } from '@/components/fitness/fitness-entity-card';
import { routes } from '@/lib/routes';
import { Dumbbell } from 'lucide-react';

export function GymExerciseCard({ exercise, className }) {
    const { id, title, body_part, sets, reps, weight, description } = exercise;
    const meta = [sets != null && `${sets} sets`, reps != null && `${reps} reps`, weight != null && `${weight} kg`].filter(Boolean).join(' · ');

    return (
        <FitnessEntityCard
            href={`${routes.fitnessGymExercises}/${id}`}
            icon={<Dumbbell className="size-4 text-primary" />}
            title={title}
            meta={meta}
            description={description}
            badge={body_part ? <Badge variant="secondary" className="text-xs">{body_part}</Badge> : null}
            ariaLabel={`Open exercise: ${title || 'Untitled'}`}
            className={className}
        />
    );
}
