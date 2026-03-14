import { USERS_LEADERBOARD, getLevel } from "@/app/_lib/ranking"
import { Podium } from "@/app/_components/ranking/podium"
import { LeaderboardList } from "@/app/_components/ranking/leaderboard-list"
import { PositionFooter } from "@/app/_components/ranking/position-footer"

// Quantidade de linhas exibidas na lista abaixo do pódio
const LIST_SIZE = 10
// Quantas posições acima do usuário a janela começa (centraliza o usuário na lista)
const OFFSET = 4

export default function RankingPage() {
    // Recalcula o nível do usuário atual com base no XP e ordena do maior para o menor
    const leaderboard = [...USERS_LEADERBOARD]
        .map(u => u.isCurrentUser ? { ...u, level: getLevel(u.xp).level } : u)
        .sort((a, b) => b.xp - a.xp)

    // Posição real do usuário atual no ranking (1-indexed)
    const myPosition = leaderboard.findIndex(u => u.isCurrentUser) + 1
    // Total de itens na lista abaixo do pódio (posições 4+)
    const totalList = leaderboard.length - 3

    // Índice inicial da janela dentro de leaderboard.slice(3)
    let startIdx = 0
    if (myPosition > 3) {
        const userIdxInList = myPosition - 4
        startIdx = Math.max(0, userIdxInList - OFFSET)
        // Impede que a janela ultrapasse o fim da lista
        if (startIdx + LIST_SIZE > totalList) {
            startIdx = Math.max(0, totalList - LIST_SIZE)
        }
    }

    // Os 3 primeiros para o pódio
    const top3 = leaderboard.slice(0, 3)
    // Fatia visível da lista (máximo LIST_SIZE itens)
    const visibleRows = leaderboard.slice(3).slice(startIdx, startIdx + LIST_SIZE)

    return (
        <main className="mx-auto px-4 pt-8 pb-25 flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ranking</h1>
                <p className="text-sm text-slate-400 mt-1">Veja como você se compara com outros</p>
            </div>

            <Podium top3={top3} />
            <LeaderboardList rows={visibleRows} startIdx={startIdx} />
            <PositionFooter position={myPosition} />
        </main>
    )
}
