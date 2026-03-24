import NavLayout from "@/app/_layouts/nav-layout"
import { WelcomeHeader } from "@/app/_components/home/welcome-header"
import { LevelCard } from "@/app/_components/home/level-card"
import { PracticeCard } from "@/app/_components/home/practice-card"
import { RankingTop3 } from "@/app/_components/home/ranking-top3"
import { StatsCards } from "@/app/_components/progress/stats-cards"
import { FAKE_STATS, computeStats } from "@/app/_lib/progress"

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
            <div className="mx-auto min-h-dvh relative bg-white pb-24 px-4 sm:px-6 lg:px-8">

                <WelcomeHeader name={USER.name} />

                <div className="flex flex-col m-5">

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

                    <PracticeCard
                        xp={USER.xp}
                        xpNeeded={USER.xpNeeded}
                        level={USER.level}
                    />

                    <RankingTop3 />

                </div>
            </div>
        </NavLayout>
    )
}
