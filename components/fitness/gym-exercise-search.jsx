'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';

const DEBOUNCE_MS = 400;

export function GymExerciseSearch({ className, ...props }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlQuery = searchParams.get('q') ?? '';
    const urlBody = searchParams.get('body') ?? '';

    const [queryValue, setQueryValue] = useState(urlQuery);
    const lastPushedRef = useRef({ q: urlQuery, body: urlBody });
    const debouncedApplyRef = useRef(null);
    const applyRef = useRef(null);

    useEffect(() => {
        if (queryValue !== lastPushedRef.current.q || urlBody !== lastPushedRef.current.body) return;
        lastPushedRef.current = { q: urlQuery, body: urlBody };
        debouncedApplyRef.current?.cancel();
        setQueryValue(urlQuery);
    }, [urlQuery, urlBody, queryValue]);

    useEffect(() => {
        function apply(q) {
            const trimmed = q && String(q).trim() ? String(q).trim() : '';
            lastPushedRef.current = { ...lastPushedRef.current, q: trimmed };
            const params = new URLSearchParams();
            if (trimmed) params.set('q', trimmed);
            if (urlBody) params.set('body', urlBody);
            router.replace(`${routes.fitnessGymExercises}${params.size ? `?${params.toString()}` : ''}`);
        }
        const debouncedApply = debounce(apply, DEBOUNCE_MS);
        debouncedApplyRef.current = debouncedApply;
        applyRef.current = apply;
        return () => debouncedApply.cancel();
    }, [router, urlBody]);

    useEffect(() => {
        if (queryValue === urlQuery) return;
        debouncedApplyRef.current?.(queryValue);
    }, [queryValue, urlQuery]);

    function onSubmit(e) {
        e.preventDefault();
        debouncedApplyRef.current?.cancel();
        applyRef.current?.(queryValue);
    }

    return (
        <form onSubmit={onSubmit} className={cn('relative', className)} {...props}>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
                type="search"
                placeholder="Search exercises…"
                className="pl-9"
                aria-label="Search exercises"
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
            />
        </form>
    );
}
