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
                    <div key={user.id} className="flex flex-1 flex-col items-center">
                        <Avatar
                            className={cn(
                                "border-2",
                                isFirst
                                    ? "size-16 rounded-4xl border-blue-300 shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
                                    : "size-13 rounded-[14px] border-slate-200"
                            )}
                        >
                            <AvatarImage
                                src={`https://github.com/${user.github}.png`}
                                alt={`@${user.github}`}
                            />
                            <AvatarFallback
                                className={cn(
                                    "rounded-none text-sm font-semibold",
                                    isFirst
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-600"
                                )}
                            >
                                {initials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <p
                            className={cn(
                                "mt-2 text-center text-[13px] leading-tight font-semibold",
                                user.isCurrentUser ? "text-blue-600" : "text-slate-700"
                            )}
                        >
                            {user.name}
                        </p>

                        <p className="font-mono text-[12px] font-bold text-slate-400">
                            {user.xp.toLocaleString()} XP
                        </p>

                        <div
                            style={{ height: PODIUM_HEIGHTS[idx] }}
                            className={cn(
                                "mt-2 flex w-full items-center justify-center rounded-t-xl border border-b-0 font-mono font-bold",
                                isFirst
                                    ? "border-blue-200 bg-linear-to-b from-blue-100 to-blue-50 text-xl text-blue-600"
                                    : "border-slate-200 bg-slate-50 text-base text-slate-400"
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
