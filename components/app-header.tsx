import { Suspense } from 'react';
import { AuthButton } from '@/components/auth-button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumbs } from '@/components/application/breadcrumbs';
import { BackButton } from '@/components/application/back-button';
import { cn } from '@/lib/utils';

export function AppHeader({
    className,
    ...props
}: React.ComponentProps<'header'>) {
    return (
        <header
            className={cn(
                'flex h-14 shrink-0 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6',
                className
            )}
            {...props}
        >
            <SidebarTrigger />
            <BackButton />
            <Breadcrumbs className="min-w-0 hidden md:flex" />
            <div className="flex-1" />
            <ThemeSwitcher />
            <Suspense>
                <AuthButton />
            </Suspense>
        </header>
    );
}
