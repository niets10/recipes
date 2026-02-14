'use client';

import { useEffect } from 'react';
import { useBreadcrumbLabel } from '@/components/application/breadcrumb-context';

/**
 * Sets the current page label in breadcrumb context (e.g. dashed recipe name).
 * Clears the label on unmount.
 */
export function SetBreadcrumbLabel ({ label }) {
    const { setPageLabel } = useBreadcrumbLabel();

    useEffect(() => {
        setPageLabel(label ?? null);
        return () => setPageLabel(null);
    }, [label, setPageLabel]);

    return null;
}
