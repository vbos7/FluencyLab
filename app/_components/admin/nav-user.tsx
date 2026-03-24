"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/app/_components/ui/sidebar';
import { UserInfo } from '@/app/_components/admin/user-info';
import { UserMenuContent } from '@/app/_components/admin/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type User } from '@/app/_lib/utils';
import { ChevronsUpDown } from 'lucide-react';

// Usuário de demonstração — substituir pelo usuário autenticado quando disponível
const MOCK_USER: User = {
    id: 1,
    name: 'Admin',
    email: 'admin@fluencylab.com',
    email_verified_at: null,
    created_at: '',
    updated_at: '',
};

export function NavUser() {
    const user = MOCK_USER;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                    ? 'left'
                                    : 'bottom'
                        }
                    >
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
