"use client"

import { usePathname, useRouter } from "next/navigation"
import { BarChart2, Calendar, Home, Languages, User } from "lucide-react"
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

    if (pathname === "/login" || pathname === "/register" || pathname === "/") return null  // ← adiciona essa linha

  return (
      <>
          {/*Dispositivos Móveis*/}
          <nav className="md:hidden flex items-center justify-center sticky top-0 z-50 w-full bg-white border-b border-slate-100 h-16 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[17px] font-bold text-slate-900 tracking-tight">
                  <Languages className="text-blue-600" size={20} />
                  FluencyLab
              </div>
          </nav>
          {/*Dispositivos Desktop*/}
          <nav className="hidden md:flex items-center sticky top-0 z-50 w-full bg-white border-b border-slate-100 px-8 h-16 gap-1 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[17px] font-bold text-slate-900 tracking-tight mr-auto">
                  <Languages className="text-blue-600" size={20} />
                  FluencyLab
              </div>

              {items.map((item) => (
                  <Button
                      key={item.href}
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(item.href)}
                      className={cn(
                          "gap-1.5 rounded-[10px] font-medium hover:bg-slate-50 hover:text-slate-700",
                          pathname === item.href
                              ? "text-blue-600 bg-blue-50 hover:bg-blue-50 hover:text-blue-600"
                              : "text-slate-500",
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
                      "gap-1.5 ml-2 rounded-[10px] font-semibold text-white bg-[#2B54FF] hover:bg-[#2B54FF]/90",
                      pathname === "/practice"
                          ? "shadow-[0_2px_20px_rgba(37,99,235,0.4)]"
                          : "shadow-[0_2px_10px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)]",
                  )}
              >
                  <Languages size={16} />
                  Praticar
              </Button>
          </nav>
      </>
  )
}
