'use client';

import { useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { routes } from '@/lib/routes';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

/** URL param value for "all" (no filter). */
const ALL_VALUE = '';
/** Non-empty value for Radix Select "All" option (Select.Item cannot use empty string). */
const ALL_SELECT_VALUE = '__all__';
const ALL_LABEL = 'All body parts';

/**
 * Select to filter gym exercises by body part. Updates ?body= and preserves ?q=.
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
            { id: ALL_SELECT_VALUE, label: ALL_LABEL },
            ...bodyParts.map((part) => ({ id: part, label: part })),
        ],
        [bodyParts]
    );

    function handleValueChange(value) {
        const bodyParam = value === ALL_SELECT_VALUE ? ALL_VALUE : value;
        const params = new URLSearchParams();
        if (currentQ) params.set('q', currentQ);
        if (bodyParam) params.set('body', bodyParam);
        const query = params.toString();
        router.replace(`${routes.fitnessGymExercises}${query ? `?${query}` : ''}`);
    }

    if (pathname !== routes.fitnessGymExercises) return null;

    return (
        <div className={cn(className)}>
            <Select
                value={currentBody === ALL_VALUE ? ALL_SELECT_VALUE : currentBody || undefined}
                onValueChange={(v) => handleValueChange(v === ALL_SELECT_VALUE ? ALL_VALUE : (v ?? ''))}
            >
                <SelectTrigger id="body-part-filter" className="w-full min-w-0">
                    <SelectValue placeholder={ALL_LABEL} />
                </SelectTrigger>
                <SelectContent>
                    {items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
