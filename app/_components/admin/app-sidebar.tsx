"use client"

import { NavFooter } from '@/app/_components/admin/nav-footer';
import { NavMain } from '@/app/_components/admin/nav-main';
import { NavUser } from '@/app/_components/admin/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/app/_components/ui/sidebar';
import { type NavItem } from '@/app/_lib/utils';
import Link from 'next/link';
import {
    LayoutGrid,
    MessageSquare,
    Settings2,
    Trophy,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

// Itens principais da plataforma
const mainNavItems: NavItem[] = [
    { title: 'Dashboard',  href: '/admin/dashboard',     icon: LayoutGrid  },
    { title: 'Usuários',   href: '/admin/usuarios',      icon: Users       },
    { title: 'Frases',     href: '/admin/frases',        icon: MessageSquare },
]

// Item de configurações no rodapé
const footerNavItems: NavItem[] = [
    { title: 'Configurações', href: '/admin/configuracoes', icon: Settings2 },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
