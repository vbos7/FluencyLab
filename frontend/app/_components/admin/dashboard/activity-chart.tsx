"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ACTIVITY_DATA } from "@/app/_lib/admin"

// Tooltip customizado do gráfico de atividade
function CustomTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean
    payload?: { value: number; name: string }[]
    label?: string
}) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm shadow-md">
            <p className="mb-1 text-xs text-slate-500">{label}</p>
            <p className="font-bold text-violet-600">{payload[0].value} sessões</p>
        </div>
    )
}

export function ActivityChart() {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">
                Sessões diárias (últimas 2 semanas)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ACTIVITY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        interval={1}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sessions" fill="#7c3aed" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
