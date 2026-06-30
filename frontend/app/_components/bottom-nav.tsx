"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Calendar, Languages, BarChart2, User, BadgeCent } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { cn } from "@/app/_lib/utils"

const items = [
    { href: "/home", icon: Home, label: "Início" },
    { href: "/progress", icon: Calendar, label: "Progresso" },
    { href: "/practice", icon: Languages, label: "Praticar", center: true },
    { href: "/ranking", icon: BarChart2, label: "Ranking" },
    { href: "/profile", icon: User, label: "Perfil" },
    
]

export function BottomNav() {
    const pathname = usePathname()
    const router = useRouter()
    // Derivado diretamente do localStorage — re-calculado a cada navegação
    // porque usePathname() já causa re-render quando a rota muda
    const isGuest =
        typeof window !== "undefined" &&
        localStorage.getItem("fluency-lab:mode") === "guest"

    if (pathname === "/login" || pathname === "/register" || pathname === "/") return null

    /* Modo convidado: dois botões lado a lado */
    if (isGuest) {
        return (
            <nav
                className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 gap-3 border-t border-slate-100 bg-white px-4 pt-3 md:hidden"
                style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
            >
                <a
                    href="/login"
                    className="flex flex-1 h-12 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-[#f0f4ff] text-sm font-bold text-blue-600 transition-all active:scale-[0.98]"
                >
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Entrar
                </a>
                <a
                    href="/register"
                    className="relative flex flex-1 h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-800 text-sm font-bold text-white shadow-md shadow-blue-400/35 transition-all active:scale-[0.98]"
                >
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Criar conta
                    <span className="absolute inset-0 -translate-x-full animate-[shimmer_3s_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </a>
            </nav>
        )
    }

    /* Modo logado: abas normais */
    return (
        <nav
            className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 items-end justify-around rounded-t-2xl border-t border-slate-100 bg-white px-2 pt-2 md:hidden"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
            {items.map((item) =>
                item.center ? (
                    <Button
                        key={item.href}
                        onClick={() => router.push(item.href)}
                        aria-label={item.label}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className={cn(
                            "h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 font-bold text-white shadow-md shadow-blue-400/35 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/45 active:scale-95",
                            pathname === item.href && "shadow-[0_2px_20px_rgba(37,99,235,0.4)]"
                        )}
                    >
                        <item.icon className="size-6" aria-hidden="true" />
                    </Button>
                ) : (
                    <Button
                        key={item.href}
                        variant="ghost"
                        onClick={() => router.push(item.href)}
                        aria-label={item.label}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className={cn(
                            "h-auto flex-col gap-0.5 rounded-xl px-3 py-4 hover:bg-transparent",
                            pathname === item.href
                                ? "text-blue-600 hover:text-blue-600"
                                : "text-slate-400 hover:text-slate-400"
                        )}
                    >
                        <item.icon className="size-6" aria-hidden="true" />
                    </Button>
                )
            )}
        </nav>
    )
}
