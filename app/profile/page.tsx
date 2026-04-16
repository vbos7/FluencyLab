import { Star, Trophy, Flame, CircleCheck } from "lucide-react"
import { ProfileHeader } from "@/app/_components/profile/profile-header"
import { StatsGrid } from "@/app/_components/profile/stats-grid"
import { XpProgress } from "@/app/_components/profile/xp-progress"
import { AvatarUpload } from "@/app/_components/profile/avatar-upload"
import { EditProfileDialog } from "@/app/_components/profile/edit-profile-dialog"
import { SettingsDialog } from "@/app/_components/profile/settings-dialog"
import { FavoriteQuestions } from "@/app/_components/profile/favorite-questions"
import { LogoutButton } from "@/app/_components/profile/logout-button"

import NavLayout from "@/app/_layouts/nav-layout"
import PremiumCard from "../_components/pricing/PremiumCard"

const USER = {
    name: "Marcus Vinicius",
    email: "marcus@fluencylab.com",
    avatarSrc: "https://github.com/shadcn.png",
    rankLabel: "#27 no Ranking Geral",
    stats: [
        { icon: Star,         iconColor: "text-amber-500",  iconBg: "bg-amber-50",   value: "1.250", label: "Pontos" },
        { icon: Trophy,       iconColor: "text-blue-600",   iconBg: "bg-blue-50",    value: "#27",   label: "Posição" },
        { icon: Flame,        iconColor: "text-orange-500", iconBg: "bg-orange-50",  value: "64%",   label: "Sequência" },
        { icon: CircleCheck,  iconColor: "text-emerald-600",iconBg: "bg-emerald-50", value: "135",   label: "Concluídos" },
    ],
    xp: { current: 250, max: 300, level: 4, levelLabel: "Expert" },
}

export default function ProfilePage() {
    return (
        <NavLayout>
            <div className="page-enter relative mx-auto mt-10 flex min-h-dvh max-w-5xl flex-col gap-4 bg-white px-4 pb-24 sm:gap-6 sm:px-6 lg:px-8">
                <ProfileHeader
                    name={USER.name}
                    rankLabel={USER.rankLabel}
                    avatarSlot={<AvatarUpload name={USER.name} avatarSrc={USER.avatarSrc} />}
                >
                    <div className="flex items-center gap-2">
                        <EditProfileDialog initialName={USER.name} initialEmail={USER.email} />
                        <SettingsDialog />
                    </div>
                </ProfileHeader>

                <StatsGrid stats={USER.stats} />


                <XpProgress
                    current={USER.xp.current}
                    max={USER.xp.max}
                    level={USER.xp.level}
                    levelLabel={USER.xp.levelLabel}
                />

                <PremiumCard />

                <FavoriteQuestions />

                <LogoutButton />
            </div>
        </NavLayout>
    )
}
