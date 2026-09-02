import { Star, Trophy, Flame, CircleCheck } from "lucide-react"
import { ProfileHeader } from "@/app/_components/profile/profile-header"
import { StatsGrid } from "@/app/_components/profile/stats-grid"
import { XpProgress } from "@/app/_components/profile/xp-progress"
import { AvatarUpload } from "@/app/_components/profile/avatar-upload"
import { EditProfileDialog } from "@/app/_components/profile/edit-profile-dialog"
import { SettingsDialog } from "@/app/_components/profile/settings-dialog"
import { FavoriteQuestions } from "@/app/_components/profile/favorite-questions"
import { LogoutButton } from "@/app/_components/profile/logout-button"
import { fetchFromApi } from "@/app/_lib/server-api"
import { computeStreak, type DashboardData } from "@/app/_lib/progress"
import { getLevel, levelLabel, type LeaderboardUser } from "@/app/_lib/ranking"
import { type UserProfile } from "@/app/_lib/user"

import NavLayout from "@/app/_layouts/nav-layout"
import PremiumCard from "../_components/pricing/PremiumCard"

export default async function ProfilePage() {
    // Tudo vem do banco: perfil, estatísticas e ranking.
    const [user, dashboard, leaderboard] = await Promise.all([
        fetchFromApi<UserProfile>("/profile.php"),
        fetchFromApi<DashboardData>("/dashboard.php"),
        fetchFromApi<LeaderboardUser[]>("/ranking.php"),
    ])

    const xpTotal = dashboard.xp_total
    const { level, currentXp, needed } = getLevel(xpTotal)
    const streak = computeStreak(dashboard.consistencia)
    // Posição real no ranking (1-indexed); 0 se, por algum motivo, não constar.
    const position = leaderboard.findIndex((u) => u.isCurrentUser) + 1
    const rankLabel = position > 0 ? `#${position} no Ranking Geral` : "Sem posição ainda"

    const stats = [
        { icon: Star,        iconColor: "text-amber-500",   iconBg: "bg-amber-50",   value: xpTotal.toLocaleString("pt-BR"), label: "Pontos" },
        { icon: Trophy,      iconColor: "text-blue-600",    iconBg: "bg-blue-50",    value: position > 0 ? `#${position}` : "—", label: "Posição" },
        { icon: Flame,       iconColor: "text-orange-500",  iconBg: "bg-orange-50",  value: `${streak}`, label: "Sequência" },
        { icon: CircleCheck, iconColor: "text-emerald-600", iconBg: "bg-emerald-50", value: `${dashboard.total_treinos}`, label: "Concluídos" },
    ]

    return (
        <NavLayout>
            <div className="page-enter relative mx-auto mt-10 flex min-h-dvh max-w-5xl flex-col gap-4 bg-white px-4 pb-24 sm:gap-6 sm:px-6 lg:px-8">
                <ProfileHeader
                    name={user.name}
                    rankLabel={rankLabel}
                    avatarSlot={<AvatarUpload name={user.name} avatarSrc={user.avatar ?? undefined} />}
                >
                    <div className="flex items-center gap-2">
                        <EditProfileDialog
                            initialName={user.name}
                            initialEmail={user.email}
                            initialPhone={user.phone ?? ""}
                        />
                        <SettingsDialog />
                    </div>
                </ProfileHeader>

                <StatsGrid stats={stats} />


                <XpProgress
                    current={currentXp}
                    max={needed}
                    level={level}
                    levelLabel={levelLabel(level)}
                />

                <PremiumCard />

                <FavoriteQuestions />

                <LogoutButton />
            </div>
        </NavLayout>
    )
}
