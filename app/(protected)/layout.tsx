import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { BreadcrumbProvider } from '@/components/application/breadcrumb-context';
import { Suspense } from 'react';
import { LoadingLogo } from '@/components/ui/loading-logo';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Suspense fallback={<LoadingLogo className="text-muted-foreground" size={48} />}>
                <AppSidebar />
            </Suspense>
            <SidebarInset>
                <BreadcrumbProvider>
                    <Suspense fallback={<LoadingLogo className="text-muted-foreground" size={48} />}>
                        <AppHeader />
                    </Suspense>
                    <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
                </BreadcrumbProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}
