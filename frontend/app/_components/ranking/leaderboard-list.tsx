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
                            "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors",
                            user.isCurrentUser
                                ? "border-blue-200 bg-blue-50"
                                : "border-slate-100 bg-white hover:bg-slate-50"
                        )}
                    >
                        <span className="w-7 shrink-0 text-center font-mono text-sm font-bold text-slate-400">
                            {position}
                        </span>

                        <Avatar className="size-10 shrink-0 rounded-2xl">
                            <AvatarImage
                                src={`https://github.com/${user.github}.png`}
                                alt={`@${user.github}`}
                            />
                            <AvatarFallback
                                className={cn(
                                    "rounded-none text-sm font-semibold",
                                    user.isCurrentUser
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-600"
                                )}
                            >
                                {initials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                            <p
                                className={cn(
                                    "truncate text-sm font-semibold",
                                    user.isCurrentUser ? "text-blue-600" : "text-slate-700"
                                )}
                            >
                                {user.name}
                            </p>
                            <Badge
                                variant="secondary"
                                className="mt-0.5 h-5 rounded-md px-1.5 py-0 text-[11px] font-medium"
                            >
                                Nível {user.level}
                            </Badge>
                        </div>

                        <span className="shrink-0 font-mono text-[13px] font-bold text-slate-500">
                            {user.xp.toLocaleString()}
                            <span className="ml-0.5 text-[11px] text-slate-400">XP</span>
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
