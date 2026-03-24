import {AppContent} from '@/app/_components/admin/app-content';
import {AppShell} from '@/app/_components/admin/app-shell';
import {AppSidebar} from '@/app/_components/admin/app-sidebar';
import {AppSidebarHeader} from '@/app/_components/admin/app-sidebar-header';
import FlashToast from '@/app/_components/admin/flash-toast';
import {type BreadcrumbItem} from '@/app/_lib/utils';
import {type PropsWithChildren} from 'react';
import {Toaster} from 'sonner';

export default function AppSidebarLayout({
                                             children,
                                             breadcrumbs = [],
                                         }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
            <AppShell variant="sidebar">
                <Toaster position="top-center" richColors />
                <FlashToast />
                <AppSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </AppContent>
            </AppShell>
    );
}
