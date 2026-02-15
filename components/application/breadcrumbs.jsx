'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import { useBreadcrumbLabel } from '@/components/application/breadcrumb-context';

const pathLabels = {
    [routes.home]: 'Home',
    [routes.recipes]: 'Recipes',
};

function getBreadcrumbItems(pathname, pageLabelOverride, useOverride) {
    const segments = pathname.split('/').filter(Boolean);
    const items = [];
    let href = '';

    for (let i = 0; i < segments.length; i++) {
        href += `/${segments[i]}`;
        const isLast = i === segments.length - 1;
        const segmentLabel = pathLabels[href] ?? segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
        const label = isLast && pageLabelOverride && useOverride
            ? pageLabelOverride
            : segmentLabel;
        items.push({ href, label, isLast });
    }

    return items.length > 0 ? items : [{ href: '/', label: 'Home', isLast: true }];
}

export function Breadcrumbs({ className, ...props }) {
    const pathname = usePathname();
    const { pageLabel } = useBreadcrumbLabel();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Use pageLabel only after mount so server and first client render match (avoids hydration error).
    const items = getBreadcrumbItems(pathname, pageLabel, mounted);

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)}
            {...props}
        >
            {items.map((item, index) => (
                <span key={item.href} className="flex items-center gap-1">
                    {index > 0 && (
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" aria-hidden />
                    )}
                    {item.isLast ? (
                        <span className="font-medium text-foreground">{item.label}</span>
                    ) : (
                        <Link
                            href={item.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
}
