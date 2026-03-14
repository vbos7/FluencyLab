import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { Badge } from "@/app/_components/ui/badge"
import { cn } from "@/app/_lib/utils"
import { type LeaderboardUser, initials } from "@/app/_lib/ranking"

type Props = {
    rows: LeaderboardUser[]
    startIdx: number
}

export function LeaderboardList({ rows, startIdx }: Props) {
    return (
        <div className="flex flex-col gap-1">
            {rows.map((user, i) => {
                const position = startIdx + i + 4 // posição real (1-indexed, após o pódio)

                return (
                    <div
                        key={user.id}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors",
                            user.isCurrentUser
                                ? "bg-blue-50 border-blue-200"
                                : "bg-white border-slate-100 hover:bg-slate-50"
                        )}
                    >
                        <span className="w-7 text-center text-sm font-bold font-mono text-slate-400 shrink-0">
                            {position}
                        </span>

                        <Avatar className="size-10 rounded-2xl shrink-0">
                            <AvatarImage
                                src={`https://github.com/${user.github}.png`}
                                alt={`@${user.github}`}
                            />
                            <AvatarFallback className={cn(
                                "rounded-none text-sm font-semibold",
                                user.isCurrentUser
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600"
                            )}>
                                {initials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <p className={cn(
                                "text-sm font-semibold truncate",
                                user.isCurrentUser ? "text-blue-600" : "text-slate-700"
                            )}>
                                {user.name}
                            </p>
                            <Badge variant="secondary" className="mt-0.5 text-[11px] px-1.5 py-0 h-5 font-medium rounded-md">
                                Nível {user.level}
                            </Badge>
                        </div>

                        <span className="text-[13px] font-bold font-mono text-slate-500 shrink-0">
                            {user.xp.toLocaleString()}
                            <span className="text-[11px] text-slate-400 ml-0.5">XP</span>
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
