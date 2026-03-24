import { ADMIN_USERS } from '@/app/_lib/admin'
import { cn } from '@/app/_lib/utils'

// Exibe os 5 usuários com maior XP
export function TopUsers() {
    // Os 5 primeiros já estão ordenados por XP desc no fake data
    const top5 = ADMIN_USERS.slice(0, 5)

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Top 5 usuários</h3>
            <div className="flex flex-col gap-3">
                {top5.map((user, i) => (
                    <div key={user.id} className="flex items-center gap-3">
                        {/* Posição */}
                        <span className={cn(
                            'size-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold',
                            i === 0 ? 'bg-amber-100 text-amber-600' :
                            i === 1 ? 'bg-slate-100 text-slate-600' :
                            i === 2 ? 'bg-orange-100 text-orange-600' :
                                      'bg-slate-50 text-slate-400'
                        )}>
                            {i + 1}
                        </span>

                        {/* Avatar com iniciais */}
                        <div className="size-8 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-600">
                            {user.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                        </div>

                        {/* Nome e email */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>

                        {/* XP */}
                        <span className="text-sm font-bold font-mono text-slate-700 shrink-0">
                            {user.xp.toLocaleString('pt-BR')}
                            <span className="text-[10px] font-normal text-slate-400 ml-0.5">xp</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
