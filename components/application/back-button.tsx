'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface NavigationWithCanGoBack {
    canGoBack: boolean;
    addEventListener(type: 'navigate', listener: () => void): void;
    removeEventListener(type: 'navigate', listener: () => void): void;
}

function getNavigation(): NavigationWithCanGoBack | undefined {
    if (typeof window === 'undefined') return undefined;
    const w = window as Window & { navigation?: NavigationWithCanGoBack };
    return w.navigation;
}

function useCanGoBack() {
    const pathname = usePathname();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        const getCanGoBack = (): boolean => {
            const nav = getNavigation();
            if (nav) return nav.canGoBack;
            if (typeof window !== 'undefined') return window.history.length > 1;
            return false;
        };

        const scheduleUpdate = () => {
            const value = getCanGoBack();
            queueMicrotask(() => setCanGoBack(value));
        };

        scheduleUpdate();
        const nav = getNavigation();
        if (nav) {
            nav.addEventListener('navigate', scheduleUpdate);
            return () => nav.removeEventListener('navigate', scheduleUpdate);
        }
    }, [pathname]);

    return canGoBack;
}

type BackButtonProps = React.ComponentProps<typeof Button>;

export function BackButton({ className, ...props }: BackButtonProps) {
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
