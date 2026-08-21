import NavLayout from "@/app/_layouts/nav-layout"
import { WelcomeHeader } from "@/app/_components/home/welcome-header"
import { OnboardingDialog } from "@/app/_components/home/onboarding-dialog"
import { LevelCard } from "@/app/_components/home/level-card"
import { PracticeCard } from "@/app/_components/home/practice-card"
import { RankingTop3 } from "@/app/_components/home/ranking-top3"
import { StatsCards } from "@/app/_components/progress/stats-cards"
import { computeStats, type DashboardData } from "@/app/_lib/progress"
import { CoursesCard } from "@/app/_components/home/courses-card";
import CursosPage from "../cursos/page"
import ProModal from "@/app/_components/pro-modal";
import { User } from "../_lib/utils"
import { fetchFromApi } from "../_lib/server-api"


const USER = {
    name: "Marcus Vinicius",
    level: 4,
    xp: 980,
    xpNeeded: 1500,
    streak: 7,
}

type Users = { id: number; name: string; email: string; phone: string | null; role: string }

export default async function HomePage() {

    const user = await fetchFromApi<Users>("/profile.php")
    const dashboardData = await fetchFromApi<DashboardData>("/dashboard.php")
    const stats = computeStats(dashboardData)

    return (
        <NavLayout>
            <ProModal />
            <OnboardingDialog />
            <div className="page-enter relative mx-auto min-h-dvh max-w-5xl bg-white px-4 pb-24 sm:px-6 lg:px-8">
                <WelcomeHeader name={user.name} />

                <div className="m-5 flex flex-col">
                    <LevelCard
                        level={USER.level}
                        xp={USER.xp}
                        xpNeeded={USER.xpNeeded}
                        streak={USER.streak}
                    />

                    {/* Estatísticas */}
                    <div className="mt-[8%] mb-[5%] w-full">
                        <a href="/progress" className="cursor-default">
                            <StatsCards stats={stats} limit={2} />
                        </a>
                    </div>

                    <CoursesCard />

                    <PracticeCard xp={USER.xp} xpNeeded={USER.xpNeeded} level={USER.level} />

                    <RankingTop3 />
                </div>
            </div>
        </NavLayout>
    )
}