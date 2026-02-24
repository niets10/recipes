import { FitnessEntityCard } from '@/components/fitness/fitness-entity-card';
import { routes } from '@/lib/routes';
import { Activity } from 'lucide-react';

export function ActivityCard({ activity, className }) {
    const { id, title, time_minutes, calories, description } = activity ?? {};
    const hasTime = time_minutes != null && time_minutes !== '';
    const hasCalories = calories != null && calories !== '';
    const metaParts = [hasTime && `${Number(time_minutes)} min`, hasCalories && `${Number(calories)} kcal`].filter(Boolean);
    const meta = metaParts.length > 0 ? metaParts.join(' · ') : undefined;

    return (
        <FitnessEntityCard
            href={`${routes.fitnessActivities}/${id}`}
            icon={<Activity className="size-4" />}
            title={title}
            meta={meta}
            description={description}
            ariaLabel={`Open activity: ${title || 'Untitled'}`}
            className={className}
        />
    );
}
