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
import { getLevel, levelLabel, type LeaderboardUser } from "@/app/_lib/ranking"
import { type DashboardData } from "@/app/_lib/progress"

import NavLayout from "@/app/_layouts/nav-layout"
import PremiumCard from "../_components/pricing/PremiumCard"

type User = { id: number; name: string; email: string; phone: string | null; role: string }

export default async function ProfilePage() {
    const [user, dashboardData, leaderboard] = await Promise.all([
        fetchFromApi<User>("/profile.php"),
        fetchFromApi<DashboardData>("/dashboard.php"),
        fetchFromApi<LeaderboardUser[]>("/ranking.php"),
    ])

    const { level, currentXp, needed } = getLevel(dashboardData.xp_total)
    const levelLabelText = levelLabel(level) // em vez de getLevelLabel(level)

    // Posição do usuário atual dentro do leaderboard (1-indexed)
    const posicao = leaderboard.findIndex((u) => u.id === user.id) + 1

    const stats = [
        { icon: Star, iconColor: "text-amber-500", iconBg: "bg-amber-50", value: dashboardData.xp_total.toLocaleString(), label: "Pontos" },
        { icon: Trophy, iconColor: "text-blue-600", iconBg: "bg-blue-50", value: posicao > 0 ? `#${posicao}` : "—", label: "Posição" },
        { icon: Flame, iconColor: "text-orange-500", iconBg: "bg-orange-50", value: `${dashboardData.streak}`, label: "Sequência" },
        { icon: CircleCheck, iconColor: "text-emerald-600", iconBg: "bg-emerald-50", value: `${dashboardData.total_treinos}`, label: "Concluídos" },
    ]

    return (
        <NavLayout>
            <div className="page-enter relative mx-auto mt-10 flex min-h-dvh max-w-5xl flex-col gap-4 bg-white px-4 pb-24 sm:gap-6 sm:px-6 lg:px-8">
                <ProfileHeader
                    name={user.name}
                    rankLabel={posicao > 0 ? `#${posicao} no Ranking Geral` : "Ainda sem posição"}
                    avatarSlot={<AvatarUpload name={user.name} avatarSrc="https://github.com/shadcn.png" />}
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
                    levelLabel={levelLabelText}
                />

                <PremiumCard />

                <FavoriteQuestions />

                <LogoutButton />
            </div>
        </NavLayout>
    )
}