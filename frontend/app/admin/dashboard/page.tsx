import AppLayout from "@/app/_layouts/app-layout"
import { type BreadcrumbItem } from "@/app/_lib/utils"
import { StatsOverview } from "@/app/_components/admin/dashboard/stats-overview"
import { GrowthChart } from "@/app/_components/admin/dashboard/growth-chart"
import { ActivityChart } from "@/app/_components/admin/dashboard/activity-chart"
import { TopUsers } from "@/app/_components/admin/dashboard/top-users"

const breadcrumbs: BreadcrumbItem[] = [{ title: "Dashboard", href: "/admin/dashboard" }]

export default function Dashboard() {
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
                <StatsOverview />

                {/* Gráfico de crescimento (largura total) */}
                <GrowthChart />

                {/* Atividade diária + Top usuários lado a lado */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <ActivityChart />
                    </div>
                    <div>
                        <TopUsers />
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
