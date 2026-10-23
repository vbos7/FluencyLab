import { type RankingPageData } from "@/app/_lib/ranking"
import { fetchFromApi } from "@/app/_lib/server-api"
import { Podium } from "@/app/_components/ranking/podium"
import { LeaderboardList } from "@/app/_components/ranking/leaderboard-list"
import { PositionFooter } from "@/app/_components/ranking/position-footer"
import NavLayout from "@/app/_layouts/nav-layout"

export default async function RankingPage() {
    // O backend já devolve o pódio e a janela de 10 linhas em volta do aluno
    // (antes vinha a lista inteira de usuários e a página recortava aqui).
    const { top3, rows: visibleRows, startIdx, myPosition } =
        await fetchFromApi<RankingPageData>("/ranking.php")

    return (
        <NavLayout>
            <div className="page-enter mx-auto flex max-w-5xl flex-col gap-6 px-4 pt-8 pb-25">
                <div className="mb-8 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-600"></span>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Desempenho da comunidade
                        </h1>

                        <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    </div>

                    <p className="text-sm font-medium text-slate-500">
                        Veja quem está se destacando nos estudos.
                    </p>
                </div>

                {top3.length === 0 ? (
                    <p className="py-16 text-center text-sm text-slate-400">
                        O ranking não está disponível no momento.
                    </p>
                ) : (
                    <>
                        <Podium top3={top3} />
                        <LeaderboardList rows={visibleRows} startIdx={startIdx} />
                        <PositionFooter position={myPosition} />
                    </>
                )}
            </div>
        </NavLayout>
    )
}
