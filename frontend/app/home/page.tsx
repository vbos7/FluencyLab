import NavLayout from "@/app/_layouts/nav-layout"
import { WelcomeHeader } from "@/app/_components/home/welcome-header"
import { OnboardingDialog } from "@/app/_components/home/onboarding-dialog"
import { LevelCard } from "@/app/_components/home/level-card"
import { PracticeCard } from "@/app/_components/home/practice-card"
import { RankingTop3 } from "@/app/_components/home/ranking-top3"
import { StatsCards } from "@/app/_components/progress/stats-cards"
import { computeStats, computeStreak, type DashboardData } from "@/app/_lib/progress"
import { getLevel } from "@/app/_lib/ranking"
import { type UserProfile } from "@/app/_lib/user"
import { CoursesCard } from "@/app/_components/home/courses-card";
import ProModal from "@/app/_components/pro-modal";
import { fetchFromApi } from "../_lib/server-api"

export default async function HomePage() {

    const user = await fetchFromApi<UserProfile>("/profile.php")
    const dashboardData = await fetchFromApi<DashboardData>("/dashboard.php")
    const stats = computeStats(dashboardData)

    // Nível/XP e streak derivados do XP e da consistência reais do banco.
    const { level, currentXp, needed } = getLevel(dashboardData.xp_total)
    const streak = computeStreak(dashboardData.consistencia)

    return (
        <NavLayout>
            <ProModal />
            <OnboardingDialog />
            <div className="page-enter relative mx-auto min-h-dvh max-w-5xl bg-white px-4 pb-24 sm:px-6 lg:px-8">
                <WelcomeHeader name={user.name} />

                <div className="m-5 flex flex-col">
                    <LevelCard
                        level={level}
                        xp={currentXp}
                        xpNeeded={needed}
                        streak={streak}
                    />

                    {/* Estatísticas */}
                    <div className="mt-[8%] mb-[5%] w-full">
                        <a href="/progress" className="cursor-default">
                            <StatsCards stats={stats} limit={2} />
                        </a>
                    </div>

                    <CoursesCard />

                    <PracticeCard xp={currentXp} xpNeeded={needed} level={level} />

                    <RankingTop3 />
                </div>
            </div>
        </NavLayout>
    )
}