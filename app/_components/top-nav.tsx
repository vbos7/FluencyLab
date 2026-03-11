"use client"

import { usePathname, useRouter } from "next/navigation"
import { BarChart2, Calendar, Home, Languages, User } from "lucide-react"

const items = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/progress", icon: Calendar, label: "Progresso" },
  { href: "/ranking", icon: BarChart2, label: "Ranking" },
  { href: "/profile", icon: User, label: "Perfil" },
]

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="hidden md:flex items-center sticky top-0 z-50 w-full bg-white border-b border-slate-100 px-8 h-16 gap-1 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 text-[17px] font-bold text-slate-900 tracking-tight mr-auto">
        <Languages className="text-blue-600" size={20} />
        FluencyLab
      </div>

      {items.map((item) => (
        <button
          key={item.href}
          onClick={() => router.push(item.href)}
          className={[
            "flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium border-0 cursor-pointer transition-all",
            pathname === item.href
              ? "text-blue-600 bg-blue-50"
              : "text-slate-500 bg-transparent hover:bg-slate-50 hover:text-slate-700",
          ].join(" ")}
        >
          <item.icon size={16} />
          {item.label}
        </button>
      ))}

      <button
        onClick={() => router.push("/practice")}
        className={[
          "flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-semibold text-white border-0 cursor-pointer transition-all ml-2",
          pathname === "/practice"
            ? "shadow-[0_2px_20px_rgba(37,99,235,0.4)]"
            : "shadow-[0_2px_10px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)]",
        ].join(" ")}
            style={{ background: "#2B54FF" }}
      >
        <Languages size={16} />
        Praticar
      </button>
    </nav>
  )
}
