import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { BreadcrumbProvider } from '@/components/application/breadcrumb-context';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function SidebarFallback() {
    return (
        <div className="flex h-full min-h-svh w-52 shrink-0 flex-col gap-2 bg-sidebar p-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-9 w-full" />
            ))}
        </div>
    );
}

function HeaderFallback() {
    return (
        <header className="flex h-14 shrink-0 items-center gap-4 bg-sidebar px-4 md:px-6">
            <Skeleton className="h-9 w-9 shrink-0" />
            <Skeleton className="hidden h-8 flex-1 md:block" />
            <Skeleton className="h-9 w-9 shrink-0" />
        </header>
    );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Suspense fallback={<SidebarFallback />}>
                <AppSidebar />
            </Suspense>
            <SidebarInset className="bg-sidebar">
                <BreadcrumbProvider>
                    <Suspense fallback={<HeaderFallback />}>
                        <AppHeader />
                    </Suspense>
                    <main className="flex-1 bg-background md:rounded-tl-3xl p-4 md:p-6">
                        {children}
                    </main>
                </BreadcrumbProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}
