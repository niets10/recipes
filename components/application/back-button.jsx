'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

function useCanGoBack() {
    const pathname = usePathname();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        const getCanGoBack = () => {
            if (typeof window === 'undefined') return false;
            if ('navigation' in window && window.navigation) {
                return window.navigation.canGoBack;
            }
            return window.history.length > 1;
        };

        const scheduleUpdate = () => {
            const value = getCanGoBack();
            queueMicrotask(() => setCanGoBack(value));
        };

        scheduleUpdate();
        if (typeof window !== 'undefined' && 'navigation' in window && window.navigation) {
            window.navigation.addEventListener('navigate', scheduleUpdate);
            return () => window.navigation.removeEventListener('navigate', scheduleUpdate);
        }
    }, [pathname]);

    return canGoBack;
}

export function BackButton({ className, ...props }) {
    const router = useRouter();
    const canGoBack = useCanGoBack();

    if (!canGoBack) {
        return null;
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            className={cn('shrink-0 md:hidden', className)}
            onClick={() => router.back()}
            {...props}
        >
            <ArrowLeft className="size-5" aria-hidden />
        </Button>
    );
}
