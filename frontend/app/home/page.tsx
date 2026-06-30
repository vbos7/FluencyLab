import NavLayout from "@/app/_layouts/nav-layout"
import { WelcomeHeader } from "@/app/_components/home/welcome-header"
import { OnboardingDialog } from "@/app/_components/home/onboarding-dialog"
import { LevelCard } from "@/app/_components/home/level-card"
import { PracticeCard } from "@/app/_components/home/practice-card"
import { RankingTop3 } from "@/app/_components/home/ranking-top3"
import { StatsCards } from "@/app/_components/progress/stats-cards"
import { FAKE_STATS, computeStats } from "@/app/_lib/progress"
import { CoursesCard } from "@/app/_components/home/courses-card";
import CursosPage from "../cursos/page"
import ProModal from "@/app/_components/pro-modal";


const USER = {
    name: "Marcus Vinicius",
    level: 4,
    xp: 980,
    xpNeeded: 1500,
    streak: 7,
}

export default function HomePage() {
    const stats = computeStats(FAKE_STATS)

    return (
        <NavLayout>
            <ProModal />
            <OnboardingDialog />
            <div className="page-enter relative mx-auto min-h-dvh max-w-5xl bg-white px-4 pb-24 sm:px-6 lg:px-8">
                <WelcomeHeader name={USER.name} />

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
