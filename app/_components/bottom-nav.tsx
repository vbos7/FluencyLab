"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Calendar, Languages, BarChart2, User } from "lucide-react"

const items = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/progress", icon: Calendar, label: "Progresso" },
  { href: "/practice", icon: Languages, label: "Praticar", center: true },
  { href: "/ranking", icon: BarChart2, label: "Ranking" },
  { href: "/profile", icon: User, label: "Perfil" },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white border-t border-slate-100 rounded-t-2xl flex items-end justify-around px-2 pt-2 z-50 md:hidden"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      {items.map((item) =>
        item.center ? (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            aria-label={item.label}
            className={[
              "flex items-center justify-center w-14 h-14 rounded-full border-0 cursor-pointer",
              pathname === item.href ? "shadow-[0_2px_20px_rgba(37,99,235,0.4)]" : "",
            ].join(" ")}
            style={{ background: "#2B54FF", color: "white" }}
          >
            <item.icon size={26} />
          </button>
        ) : (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={[
              "flex flex-col items-center gap-0.5 px-3 py-4 rounded-xl border-0 bg-transparent cursor-pointer transition-all",
              pathname === item.href ? "text-blue-600" : "text-slate-400",
            ].join(" ")}
          >
            <item.icon size={25} />
          </button>
        )
      )}
    </nav>
  )
}
