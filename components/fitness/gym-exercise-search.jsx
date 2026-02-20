'use client';

import { EntitySearch } from '@/components/fitness/entity-search';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

export function GymExerciseSearch({ className, ...props }) {
    return (
        <EntitySearch
            basePath={routes.fitnessGymExercises}
            placeholder="Search exercises…"
            ariaLabel="Search exercises"
            preserveParamKeys={['body']}
            className={cn(className)}
            {...props}
        />
    );
}
