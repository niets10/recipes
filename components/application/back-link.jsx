'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Button that goes back to the previous page in navigation history.
 * Hidden on mobile (rely on browser/sidebar).
 * Use inside a flex row (e.g. with page title or tabs) for a compact header.
 */
export function BackLink({ label = 'Back', className, ...props }) {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            size="icon"
            type="button"
            className={cn('hidden shrink-0 md:flex', className)}
            aria-label={label}
            onClick={() => router.back()}
            {...props}
        >
            <ChevronLeft className="size-4" />
        </Button>
    );
}
