"use client"

import { useState } from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { type WeeklyPoint } from "@/app/_lib/progress"
import { cn } from "@/app/_lib/utils"

type Props = {
    // Pontos semanais gerados em _lib/progress.ts
    data: WeeklyPoint[]
}

// Métricas disponíveis para alternar no gráfico
type Metric = "xp" | "treinos"

// Configuração visual de cada métrica
const METRICS: Record<Metric, { label: string; color: string; unit: string }> = {
    xp:      { label: "XP",      color: "#2563eb", unit: " XP"   },
    treinos: { label: "Treinos", color: "#7c3aed", unit: " treinos" },
}

// Tooltip customizado para exibir valor + unidade formatados
function CustomTooltip({ active, payload, label, metric }: {
    active?: boolean
    payload?: { value: number }[]
    label?: string
    metric: Metric
}) {
    if (!active || !payload?.length) return null
    const { unit } = METRICS[metric]
    return (
        <div className="bg-white border border-slate-100 rounded-2xl px-3.5 py-2.5 shadow-lg text-sm">
            <p className="text-slate-400 text-[11px] mb-0.5">{label}</p>
            <p className="font-bold text-slate-800 font-mono">
                {payload[0].value}{unit}
            </p>
        </div>
    )
}

export function WeeklyChart({ data }: Props) {
    // Métrica atualmente selecionada para exibir no gráfico
    const [metric, setMetric] = useState<Metric>("xp")

    const { color } = METRICS[metric]

    return (
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col gap-4">

            {/* Cabeçalho com título e alternador de métrica */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-700">Evolução semanal</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Últimas 12 semanas</p>
                </div>

                {/* Tabs de alternância XP / Treinos */}
                <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
                    {(Object.keys(METRICS) as Metric[]).map(m => (
                        <button
                            key={m}
                            onClick={() => setMetric(m)}
                            className={cn(
                                "px-3 py-1 rounded-[10px] text-xs font-semibold transition-colors",
                                metric === m
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {METRICS[m].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gráfico de área */}
            <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <defs>
                        {/* Gradiente vertical para a área preenchida */}
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%"   stopColor={color} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={color} stopOpacity={0}   />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        vertical={false}
                        stroke="#f1f5f9"
                        strokeDasharray="4 4"
                    />
                    <XAxis
                        dataKey="week"
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        interval={1}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        content={<CustomTooltip metric={metric} />}
                        cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }}
                    />
                    <Area
                        type="monotone"
                        dataKey={metric}
                        stroke={color}
                        strokeWidth={2}
                        fill="url(#areaGradient)"
                        dot={{ r: 3, fill: color, strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
