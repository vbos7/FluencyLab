"use client"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { GROWTH_DATA } from '@/app/_lib/admin'

// Tooltip customizado do gráfico de crescimento
function CustomTooltip({ active, payload, label }: {
    active?: boolean
    payload?: { value: number }[]
    label?: string
}) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-md text-sm">
            <p className="text-slate-500 text-xs mb-0.5">{label}</p>
            <p className="font-bold text-slate-800">{payload[0].value.toLocaleString('pt-BR')} usuários</p>
        </div>
    )
}

export function GrowthChart() {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Crescimento de usuários</h3>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={GROWTH_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="adminUsersGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        domain={['dataMin - 100', 'dataMax + 50']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="url(#adminUsersGradient)"
                        dot={false}
                        activeDot={{ r: 4, fill: '#2563eb' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
