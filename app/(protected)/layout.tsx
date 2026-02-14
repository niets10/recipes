import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { Suspense } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Suspense fallback={null}>
                <AppSidebar />
            </Suspense>
            <SidebarInset>
                <Suspense fallback={null}>
                    <AppHeader />
                </Suspense>
                <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
