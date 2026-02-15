import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { BreadcrumbProvider } from '@/components/application/breadcrumb-context';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <BreadcrumbProvider>
                    <AppHeader />
                    <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
                </BreadcrumbProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}
