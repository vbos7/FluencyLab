import { redirect } from "next/navigation";
import { fetchFromApi } from "@/app/_lib/server-api";
import {
    buildCalendarMapFromApi,
    computeStatsFromApi,
    generateWeeks,
    type CalendarData,
    type StatsData,
    type WeeklyPoint,
} from "@/app/_lib/progress";
import { ConsistencyHeatmap } from "@/app/_components/progress/consistency-heatmap";
import { WeeklyChart } from "@/app/_components/progress/weekly-chart";
import { StatsCards } from "@/app/_components/progress/stats-cards";           // idem
import NavLayout from "@/app/_layouts/nav-layout";

export default async function ProgressPage() {
    let statsData: StatsData;
    let weeklyData: WeeklyPoint[];
    let calendarData: CalendarData[];

    try {
        [statsData, weeklyData, calendarData] = await Promise.all([
            fetchFromApi<StatsData>("/user/stats.php"),
            fetchFromApi<WeeklyPoint[]>("/user/progress-weekly.php"),
            fetchFromApi<CalendarData[]>("/user/calendar.php"),
        ]);
    } catch {
        redirect("/login"); // sem sessão válida, manda pro login
    }

    const stats = computeStatsFromApi(statsData);
    const calendarMap = buildCalendarMapFromApi(calendarData);
    const { weeks, currentWeekIdx } = generateWeeks(calendarMap);

    return (
        <NavLayout>
            <main className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-800">Consistência</h1>
                        <p className="text-sm text-slate-500 mt-1">Seu histórico de atividade</p>
                    </div>

                    <ConsistencyHeatmap weeks={weeks} currentWeekIdx={currentWeekIdx} />
                    <StatsCards stats={stats} />
                    <WeeklyChart data={weeklyData} />
                </div>
            </main>
        </NavLayout>
    );
}
