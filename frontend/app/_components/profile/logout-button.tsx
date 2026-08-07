"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { apiClient } from "@/app/_lib/api"

export function LogoutButton() {
    const router = useRouter()

    async function handleLogout() {
        try {
            await apiClient.post("/auth/logout.php")
        } catch {
            // mesmo se falhar, continuamos o logout local
        }
        // O PHP destruiu a sessão — o browser descartará o cookie PHPSESSID
        router.push("/login")
    }

    return (
        <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-semibold text-red-500 transition-all duration-200 hover:border-red-200 hover:bg-red-100 hover:text-red-600 active:scale-[0.98]"
        >
            <LogOut size={16} />
            Sair da conta
        </button>
    )
}
