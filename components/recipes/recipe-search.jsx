'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';

const DEBOUNCE_MS = 400;

export function RecipeSearch({ className, placeholder = 'Search recipes…', ...props }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const urlQuery = searchParams.get('q') ?? '';

    const [queryValue, setQueryValue] = useState(urlQuery);
    const lastPushedQueryRef = useRef(urlQuery);
    const debouncedApplyRef = useRef(null);
    const applyQueryRef = useRef(null);

    // Empty search when navigating to another route (pathname change)
    useEffect(() => {
        debouncedApplyRef.current?.cancel();
        lastPushedQueryRef.current = '';
        setQueryValue('');
        router.replace(routes.recipes);
    }, [pathname]);

    useEffect(() => {
        const userHasDiverged = queryValue !== lastPushedQueryRef.current;
        if (userHasDiverged) return;
        lastPushedQueryRef.current = urlQuery;
        debouncedApplyRef.current?.cancel();
        setQueryValue(urlQuery);
    }, [urlQuery, queryValue]);

    useEffect(() => {
        function applyQuery(q) {
            const trimmed = q && String(q).trim() ? String(q).trim() : '';
            lastPushedQueryRef.current = trimmed;
            const params = new URLSearchParams();
            if (trimmed) params.set('q', trimmed);
            const path = `${routes.recipes}${params.size ? `?${params.toString()}` : ''}`;
            router.replace(path);
        }
        const debouncedApply = debounce(applyQuery, DEBOUNCE_MS);
        debouncedApplyRef.current = debouncedApply;
        applyQueryRef.current = applyQuery;
        return () => debouncedApply.cancel();
    }, [router]);

    useEffect(() => {
        if (queryValue === urlQuery) return;
        debouncedApplyRef.current?.(queryValue);
    }, [queryValue, urlQuery]);

    function onSubmit(e) {
        e.preventDefault();
        debouncedApplyRef.current?.cancel();
        applyQueryRef.current?.(queryValue);
    }

    return (
        <form onSubmit={onSubmit} className={cn('relative', className)} {...props}>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
                type="search"
                placeholder={placeholder}
                className="pl-9"
                aria-label="Search recipes"
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
            />
        </form>
    );
}
