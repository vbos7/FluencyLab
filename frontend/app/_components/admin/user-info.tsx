import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { type User } from "@/app/_lib/utils"
import { fallbackAvatarSrc } from "@/app/_lib/fallback-avatar"

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage
                    src={
                        user.avatar
                            ? user.avatar.startsWith("http")
                                ? user.avatar
                                : `/storage/${user.avatar}`
                            : fallbackAvatarSrc(user.id)
                    }
                    alt={user.name}
                />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={fallbackAvatarSrc(user.id)}
                        alt={user.name}
                        className="size-full object-cover"
                    />
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && (
                    <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                )}
            </div>
        </>
    )
}
