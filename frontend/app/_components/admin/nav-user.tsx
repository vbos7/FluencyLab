"use client"

import { useEffect, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/app/_components/ui/sidebar"
import { UserInfo } from "@/app/_components/admin/user-info"
import { UserMenuContent } from "@/app/_components/admin/user-menu-content"
import { useIsMobile } from "@/hooks/use-mobile"
import { type User } from "@/app/_lib/utils"
import { getProfile } from "@/app/_lib/admin-api"
import { ChevronsUpDown } from "lucide-react"

export function NavUser() {
    const { state } = useSidebar()
    const isMobile = useIsMobile()
    const [user, setUser] = useState<User | null>(null)

    // Busca o admin autenticado (mesmo /profile.php usado na página de perfil).
    useEffect(() => {
        getProfile()
            .then((p) =>
                setUser({
                    id: p.id,
                    name: p.name,
                    email: p.email,
                    avatar: p.avatar ?? undefined,
                    email_verified_at: null,
                    created_at: p.created_at,
                    updated_at: "",
                })
            )
            .catch(() => {})
    }, [])

    // Enquanto carrega, mostra um esqueleto simples no rodapé da sidebar.
    if (!user) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" disabled>
                        <div className="size-8 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
                        <div className="ml-1 h-3 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

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
                        side={isMobile ? "bottom" : state === "collapsed" ? "left" : "bottom"}
                    >
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
