import { ADMIN_USERS } from "@/app/_lib/admin"
import { cn } from "@/app/_lib/utils"

// Exibe os 5 usuários com maior XP
export function TopUsers() {
    // Os 5 primeiros já estão ordenados por XP desc no fake data
    const top5 = ADMIN_USERS.slice(0, 5)

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">Top 5 usuários</h3>
            <div className="flex flex-col gap-3">
                {top5.map((user, i) => (
                    <div key={user.id} className="flex items-center gap-3">
                        {/* Posição */}
                        <span
                            className={cn(
                                "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                                i === 0
                                    ? "bg-amber-100 text-amber-600"
                                    : i === 1
                                      ? "bg-slate-100 text-slate-600"
                                      : i === 2
                                        ? "bg-orange-100 text-orange-600"
                                        : "bg-slate-100 text-slate-600"
                            )}
                        >
                            {i + 1}
                        </span>

                        {/* Avatar com iniciais */}
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-600">
                            {user.name
                                .split(" ")
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join("")}
                        </div>

                        {/* Nome e email */}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">
                                {user.name}
                            </p>
                            <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                        </div>

                        {/* XP */}
                        <span className="shrink-0 font-mono text-sm font-bold text-slate-700">
                            {user.xp.toLocaleString("pt-BR")}
                            <span className="ml-0.5 text-[10px] font-normal text-slate-500">
                                xp
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
