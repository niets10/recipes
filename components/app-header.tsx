import { Suspense } from 'react';
import { AuthButton } from '@/components/auth-button';
import { Separator } from '@/components/ui/separator';

export function AppHeader({ children }: { children?: React.ReactNode }) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            {children}
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center justify-end">
                <Suspense>
                    <AuthButton />
                </Suspense>
            </div>
        </header>
    );
}
