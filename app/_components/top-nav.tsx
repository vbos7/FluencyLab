"use client"

import { usePathname, useRouter } from "next/navigation"
import { BarChart2, Calendar, Home, Languages, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/app/_components/ui/button"
import { cn } from "@/app/_lib/utils"

const items = [
    { href: "/home", icon: Home, label: "Início" },
    { href: "/progress", icon: Calendar, label: "Progresso" },
    { href: "/ranking", icon: BarChart2, label: "Ranking" },
    { href: "/profile", icon: User, label: "Perfil" },
]

export function TopNav() {
    const pathname = usePathname()
    const router = useRouter()

    const isGuest =
        typeof window !== "undefined" &&
        localStorage.getItem("fluency-lab:mode") === "guest"

    if (pathname === "/login" || pathname === "/register" || pathname === "/") return null

    return (
        <>
            {/* Dispositivos Móveis */}
            <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-center border-b border-slate-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] md:hidden">
                <Link href="/" className="flex items-center gap-2 text-[17px] font-bold tracking-tight text-slate-900">
                    <Languages className="text-blue-600" size={20} />
                    FluencyLab
                </Link>
            </nav>

            {/* Dispositivos Desktop */}
            <nav className="sticky top-0 z-50 hidden h-16 w-full items-center gap-1 border-b border-slate-100 bg-white px-8 shadow-[0_1px_4px_rgba(0,0,0,0.04)] md:flex">
                <Link href="/" className="mr-auto flex items-center gap-2 text-[17px] font-bold tracking-tight text-slate-900">
                    <Languages className="text-blue-600" size={20} />
                    FluencyLab
                </Link>

                {isGuest ? (
                    /* Modo convidado: apenas botões de login e registro */
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/login")}
                            className="gap-1.5 rounded-[10px] border border-blue-200 font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-600"
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
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => router.push("/register")}
                            className="gap-1.5 rounded-[10px] bg-[#2B54FF] font-semibold text-white hover:bg-[#2B54FF]/90 shadow-[0_2px_10px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)]"
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
                        </Button>
                    </div>
                ) : (
                    /* Modo logado: abas de navegação */
                    <>
                        {items.map((item) => (
                            <Button
                                key={item.href}
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    "gap-1.5 rounded-[10px] font-medium hover:bg-slate-50 hover:text-slate-700",
                                    pathname === item.href
                                        ? "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                                        : "text-slate-500"
                                )}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </Button>
                        ))}

                        <Button
                            size="sm"
                            onClick={() => router.push("/practice")}
                            className={cn(
                                "ml-2 gap-1.5 rounded-[10px] bg-[#2B54FF] font-semibold text-white hover:bg-[#2B54FF]/90",
                                pathname === "/practice"
                                    ? "shadow-[0_2px_20px_rgba(37,99,235,0.4)]"
                                    : "shadow-[0_2px_10px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)]"
                            )}
                        >
                            <Languages size={16} />
                            Praticar
                        </Button>
                    </>
                )}
            </nav>
        </>
    )
}
