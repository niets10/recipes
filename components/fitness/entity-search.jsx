'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const DEBOUNCE_MS = 400;

/**
 * Reusable URL-based search input. Syncs with ?q= and optional extra params.
 * @param {string} basePath - Base path (e.g. routes.fitnessGymExercises)
 * @param {string} [placeholder] - Input placeholder
 * @param {string} [ariaLabel] - Aria label for the input
 * @param {string[]} [preserveParamKeys] - Query keys to preserve when updating URL (e.g. ['body'])
 * @param {string} [className] - Optional class name
 */
export function EntitySearch({ basePath, placeholder = 'Search…', ariaLabel = 'Search', preserveParamKeys = [], className, ...props }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlQuery = searchParams.get('q') ?? '';
    const [queryValue, setQueryValue] = useState(urlQuery);
    const searchParamsRef = useRef(searchParams);
    searchParamsRef.current = searchParams;
    const lastPushedRef = useRef({ q: urlQuery });
    const debouncedApplyRef = useRef(null);
    const applyRef = useRef(null);
    useEffect(() => {
        const keys = preserveParamKeys || [];
        const nextPreserved = Object.fromEntries(keys.map((k) => [k, searchParams.get(k) ?? '']));
        if (queryValue !== lastPushedRef.current.q || keys.some((k) => lastPushedRef.current[k] !== nextPreserved[k])) return;
        lastPushedRef.current = { q: urlQuery, ...nextPreserved };
        debouncedApplyRef.current?.cancel();
        setQueryValue(urlQuery);
    }, [urlQuery, queryValue, searchParams, preserveParamKeys]);

    useEffect(() => {
        const keys = preserveParamKeys || [];
        function apply(q) {
            const trimmed = q && String(q).trim() ? String(q).trim() : '';
            lastPushedRef.current = { ...lastPushedRef.current, q: trimmed };
            const params = new URLSearchParams();
            if (trimmed) params.set('q', trimmed);
            keys.forEach((key) => {
                const value = searchParamsRef.current.get(key) ?? '';
                if (value) params.set(key, value);
            });
            router.replace(`${basePath}${params.size ? `?${params.toString()}` : ''}`);
        }
        const debouncedApply = debounce(apply, DEBOUNCE_MS);
        debouncedApplyRef.current = debouncedApply;
        applyRef.current = apply;
        return () => debouncedApply.cancel();
    }, [router, basePath, preserveParamKeys]);

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
                placeholder={placeholder}
                className="pl-9"
                aria-label={ariaLabel}
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
            />
        </form>
    );
}
