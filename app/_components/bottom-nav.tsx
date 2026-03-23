"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Calendar, Languages, BarChart2, User } from "lucide-react"
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
  if (pathname === "/login" || pathname === "/register" || pathname === "/") return null  // ← adiciona essa linha

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white border-t border-slate-100 rounded-t-2xl flex items-end justify-around px-2 pt-2 z-50 md:hidden"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      {items.map((item) =>
        item.center ? (
          <Button
            key={item.href}
            onClick={() => router.push(item.href)}
            aria-label={item.label}
            className={cn(
              "w-14 h-14 rounded-full font-bold bg-gradient-to-br from-blue-500 to-blue-800 shadow-md shadow-blue-400/35 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/45 active:scale-95 transition-all text-white",
              pathname === item.href && "shadow-[0_2px_20px_rgba(37,99,235,0.4)]",
            )}
          >
            <item.icon className="size-6" />
          </Button>
        ) : (
          <Button
            key={item.href}
            variant="ghost"
            onClick={() => router.push(item.href)}
            className={cn(
              "flex-col h-auto px-3 py-4 rounded-xl gap-0.5 hover:bg-transparent",
              pathname === item.href ? "text-blue-600 hover:text-blue-600" : "text-slate-400 hover:text-slate-400",
            )}
          >
            <item.icon className="size-6" />
          </Button>
        )
      )}
    </nav>
  )
}
