import { fetchFromApi } from "@/app/_lib/server-api"
import { type WeeklyPoint } from "@/app/_lib/progress"
import { WeeklyChart } from "@/app/_components/progress/weekly-chart"

type DetailedWeek = WeeklyPoint & { inicio: string; acertos: number; segundos: number }

export async function WeeklyReport() {
    let weeks: DetailedWeek[]
    try {
        weeks = await fetchFromApi<DetailedWeek[]>("/user/progress-weekly.php?detailed=1")
    } catch {
        return (
            <p role="status" className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
                Não foi possível carregar o relatório Pro. Recarregue a página para tentar
                novamente.
            </p>
        )
    }
    const total = weeks.reduce((sum, week) => sum + week.treinos, 0)
    return (
        <section aria-label="Relatório semanal Pro" className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Seu relatório semanal · Pro</h2>
            <WeeklyChart data={weeks} />
            {total === 0 && (
                <p className="text-sm text-slate-500">
                    Comece a praticar para acompanhar sua evolução aqui.
                </p>
            )}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 p-4">
                <table className="w-full text-left text-sm">
                    <caption className="mb-3 text-left text-slate-500">
                        Últimas 12 semanas · a semana atual ainda está em andamento
                    </caption>
                    <thead>
                        <tr>
                            {["Semana de", "XP", "Treinos", "Acertos", "Tempo"].map((label) => (
                                <th key={label} scope="col" className="px-2 py-3">
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {weeks.map((week) => (
                            <tr key={week.inicio} className="border-t border-slate-100">
                                <th scope="row" className="px-2 py-3 font-medium whitespace-nowrap">
                                    {week.inicio.split("-").reverse().join("/")}
                                </th>
                                <td className="px-2 py-3">{week.xp}</td>
                                <td className="px-2 py-3">{week.treinos}</td>
                                <td className="px-2 py-3">
                                    {week.treinos
                                        ? `${week.acertos}/${week.treinos} (${Math.round((week.acertos / week.treinos) * 100)}%)`
                                        : "—"}
                                </td>
                                <td className="px-2 py-3 whitespace-nowrap">
                                    {Math.floor(week.segundos / 60)} min {week.segundos % 60} s
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
