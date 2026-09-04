import NavLayout from "@/app/_layouts/nav-layout"
import { WelcomeHeader } from "@/app/_components/home/welcome-header"
import { OnboardingDialog } from "@/app/_components/home/onboarding-dialog"
import { LevelCard } from "@/app/_components/home/level-card"
import { PracticeCard } from "@/app/_components/home/practice-card"
import { RankingTop3 } from "@/app/_components/home/ranking-top3"
import { StatsCards } from "@/app/_components/progress/stats-cards"
import { computeStats, type DashboardData } from "@/app/_lib/progress"
import { getLevel } from "@/app/_lib/ranking"
import { CoursesCard } from "@/app/_components/home/courses-card"
import ProModal from "@/app/_components/pro-modal"
import { fetchFromApi } from "../_lib/server-api"

type Users = { id: number; name: string; email: string; phone: string | null; role: string }

export default async function HomePage() {
    const [user, dashboardData] = await Promise.all([
        fetchFromApi<Users>("/profile.php"),
        fetchFromApi<DashboardData>("/dashboard.php"),
    ])

    const stats = computeStats(dashboardData)

    // Nível/XP derivados do XP total real do banco. Streak também vem pronto
    // do backend (dashboardData.streak) — fonte única, calculada em dashboard.php.
    const { level, currentXp, needed } = getLevel(dashboardData.xp_total)

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
                        streak={dashboardData.streak}
                    />

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
