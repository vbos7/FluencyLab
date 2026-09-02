import AppLayout from "@/app/_layouts/app-layout"
import { type BreadcrumbItem } from "@/app/_lib/utils"
import { fetchFromApi } from "@/app/_lib/server-api"
import type { ActivityPoint, DashboardStats, GrowthPoint, TopUser } from "@/app/_lib/admin"
import { StatsOverview } from "@/app/_components/admin/dashboard/stats-overview"
import { GrowthChart } from "@/app/_components/admin/dashboard/growth-chart"
import { ActivityChart } from "@/app/_components/admin/dashboard/activity-chart"
import { TopUsers } from "@/app/_components/admin/dashboard/top-users"

const breadcrumbs: BreadcrumbItem[] = [{ title: "Dashboard", href: "/admin/dashboard" }]

// Server Component: busca tudo do backend em paralelo e injeta nos componentes.
export default async function Dashboard() {
    const [stats, growth, activity, topUsers] = await Promise.all([
        fetchFromApi<DashboardStats>("/admin/stats.php"),
        fetchFromApi<GrowthPoint[]>("/admin/growth.php"),
        fetchFromApi<ActivityPoint[]>("/admin/activity.php"),
        fetchFromApi<TopUser[]>("/admin/top-users.php"),
    ])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Cabeçalho */}
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="mt-0.5 text-sm text-slate-400">
                        Visão geral da plataforma FluencyLab
                    </p>
                </div>

                {/* Cards de estatísticas */}
                <StatsOverview stats={stats} />

                {/* Gráfico de crescimento (largura total) */}
                <GrowthChart data={growth} />

                {/* Atividade diária + Top usuários lado a lado */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <ActivityChart data={activity} />
                    </div>
                    <div>
                        <TopUsers users={topUsers} />
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
