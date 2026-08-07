"use client"

import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/app/_components/ui/dropdown-menu"
import { UserInfo } from "@/app/_components/admin/user-info"
import { useMobileNavigation } from "@/hooks/use-mobile-navigation"
import { type User } from "@/app/_lib/utils"
import Link from "next/link"
import { Bell, LogOut, Settings, UserIcon } from "lucide-react"

interface UserMenuContentProps {
    user: User
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation()

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href="/admin/profile" onClick={cleanup}>
                        <UserIcon className="mr-2" />
                        Perfil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href="/admin/notificacoes" onClick={cleanup}>
                        <Bell className="mr-2" />
                        Notificações
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" href="/logout" data-test="logout-button">
                    <LogOut className="mr-2" />
                    Sair
                </Link>
            </DropdownMenuItem>
        </>
    )
}
