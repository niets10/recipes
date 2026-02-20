import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Link back to a list/parent page. Hidden on mobile (rely on browser/sidebar).
 * Use inside a flex row (e.g. with page title or tabs) for a compact header.
 */
export function BackLink({ href, label = 'Back', className, ...props }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn('hidden shrink-0 md:flex', className)}
            aria-label={label}
            {...props}
        >
            <Link href={href}>
                <ChevronLeft className="size-4" />
            </Link>
        </Button>
    );
}
