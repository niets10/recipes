'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BackButton({ className, ...props }: React.ComponentProps<typeof Button>) {
    const router = useRouter();

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
