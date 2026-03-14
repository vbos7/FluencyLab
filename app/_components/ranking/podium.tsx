import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { cn } from "@/app/_lib/utils"
import { type LeaderboardUser, initials } from "@/app/_lib/ranking"

type Props = {
    top3: LeaderboardUser[]
}

// Ordem visual do pódio: 2° à esquerda, 1° no centro, 3° à direita
const PODIUM_ORDER = [1, 0, 2]
// Altura em px das barras do pódio para cada posição (1°, 2°, 3°)
const PODIUM_HEIGHTS = [80, 56, 40]

export function Podium({ top3 }: Props) {
    return (
        <div className="flex items-end justify-center gap-3 pt-2">
            {PODIUM_ORDER.map((idx) => {
                const user = top3[idx]
                if (!user) return null
                const isFirst = idx === 0
                const position = idx + 1

                return (
                    <div key={user.id} className="flex flex-col items-center flex-1">
                        <Avatar className={cn(
                            "border-2",
                            isFirst
                                ? "size-16 rounded-4xl border-blue-300 shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
                                : "size-13 rounded-[14px] border-slate-200"
                        )}>
                            <AvatarImage
                                src={`https://github.com/${user.github}.png`}
                                alt={`@${user.github}`}
                            />
                            <AvatarFallback className={cn(
                                "rounded-none font-semibold text-sm",
                                isFirst ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                            )}>
                                {initials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <p className={cn(
                            "text-[13px] font-semibold mt-2 text-center leading-tight",
                            user.isCurrentUser ? "text-blue-600" : "text-slate-700"
                        )}>
                            {user.name}
                        </p>

                        <p className="text-[12px] font-bold text-slate-400 font-mono">
                            {user.xp.toLocaleString()} XP
                        </p>

                        <div
                            style={{ height: PODIUM_HEIGHTS[idx] }}
                            className={cn(
                                "w-full mt-2 rounded-t-xl flex items-center justify-center font-mono font-bold border border-b-0",
                                isFirst
                                    ? "bg-linear-to-b from-blue-100 to-blue-50 border-blue-200 text-blue-600 text-xl"
                                    : "bg-slate-50 border-slate-200 text-slate-400 text-base"
                            )}
                        >
                            {position}°
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
