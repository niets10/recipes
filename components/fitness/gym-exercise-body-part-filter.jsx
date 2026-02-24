'use client';

import { useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { routes } from '@/lib/routes';
import { Combobox } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

const ALL_VALUE = '';
const ALL_LABEL = 'All body parts';

/**
 * Combobox to filter gym exercises by body part. Updates ?body= and preserves ?q=.
 * @param {{ bodyParts: string[], className?: string }} props
 */
export function GymExerciseBodyPartFilter({ bodyParts, className }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentBody = searchParams.get('body') ?? ALL_VALUE;
    const currentQ = searchParams.get('q') ?? '';

    const items = useMemo(
        () => [
            { id: ALL_VALUE, label: ALL_LABEL },
            ...bodyParts.map((part) => ({ id: part, label: part })),
        ],
        [bodyParts]
    );

    function handleValueChange(value) {
        const params = new URLSearchParams();
        if (currentQ) params.set('q', currentQ);
        if (value) params.set('body', value);
        const query = params.toString();
        router.replace(`${routes.fitnessGymExercises}${query ? `?${query}` : ''}`);
    }

    if (pathname !== routes.fitnessGymExercises) return null;

    return (
        <div className={cn(className)}>
            <Combobox
                items={items}
                value={currentBody}
                onValueChange={handleValueChange}
                getItemValue={(item) => item.id}
                getItemLabel={(item) => item.label}
                placeholder={ALL_LABEL}
                emptyMessage="No body parts found."
                id="body-part-filter"
            />
        </div>
    );
}
