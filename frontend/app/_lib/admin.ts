// Tipos do painel admin — todos no formato que o backend realmente devolve.
// Os dados agora vêm da API (ver admin-api.ts); aqui ficam só os contratos,
// para que Server Components e Client Components compartilhem os mesmos tipos.

// ─── Dashboard ─────────────────────────────────────────────────────────────────

// GET /api/admin/stats.php
export type DashboardStats = {
    totalUsers: number
    totalPhrases: number
    activeToday: number
    totalXP: number
    newThisMonth: number
    avgCompletionRate: number
}

// GET /api/admin/growth.php — total acumulado de usuários por mês
export type GrowthPoint = { month: string; users: number }

// GET /api/admin/activity.php — sessões e XP por dia (últimos 14 dias)
export type ActivityPoint = { day: string; sessions: number; xp: number }

// GET /api/admin/top-users.php
export type TopUser = { id: number; name: string; email: string; xp: number; level: number }

// ─── Usuários ──────────────────────────────────────────────────────────────────

// GET /api/admin/users.php
export type AdminUser = {
    id: number
    name: string
    email: string
    role: "student" | "admin"
    createdAt: string
    xp: number
    level: number
    isActive: boolean
}

// ─── Frases ────────────────────────────────────────────────────────────────────

export type Difficulty = "easy" | "medium" | "hard"

// GET /api/admin/phrases.php
export type AdminPhrase = {
    id: number
    pt: string
    en: string
    difficulty: Difficulty
    category: string
    total_attempts: number
}

// Rótulo/estilo por dificuldade — o backend guarda em inglês, a UI mostra em PT.
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
}

export const DIFFICULTY_STYLES: Record<Difficulty, string> = {
    easy: "bg-emerald-50 text-emerald-700",
    medium: "bg-amber-50 text-amber-700",
    hard: "bg-red-50 text-red-600",
}

// ─── Configurações ──────────────────────────────────────────────────────────────

// GET /api/admin/settings.php — mapa { chave: valor } (valores são strings)
export type AdminSettings = Record<string, string>
