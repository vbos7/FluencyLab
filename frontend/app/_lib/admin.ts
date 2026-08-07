// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AdminUser = {
    id: number
    name: string
    email: string
    github: string
    xp: number
    level: number
    streak: number
    isActive: boolean
    createdAt: string
}

export type AdminPhrase = {
    id: number
    english: string
    portuguese: string
    difficulty: "fácil" | "médio" | "difícil"
    category: string
    timePracticed: number
}

// Ponto do gráfico de crescimento de usuários (mensal)
export type GrowthPoint = { month: string; users: number }

// Ponto do gráfico de atividade diária
export type ActivityPoint = { day: string; sessions: number; xp: number }

// ─── Stats do dashboard ────────────────────────────────────────────────────────

export const DASHBOARD_STATS = {
    totalUsers: 1247,
    totalPhrases: 3842,
    activeToday: 89,
    totalXP: 124680,
    newThisMonth: 43,
    avgCompletionRate: 68,
}

// ─── Crescimento de usuários (12 meses) ───────────────────────────────────────

export const GROWTH_DATA: GrowthPoint[] = [
    { month: "Jan", users: 820 },
    { month: "Fev", users: 890 },
    { month: "Mar", users: 950 },
    { month: "Abr", users: 1020 },
    { month: "Mai", users: 1080 },
    { month: "Jun", users: 1120 },
    { month: "Jul", users: 1150 },
    { month: "Ago", users: 1180 },
    { month: "Set", users: 1200 },
    { month: "Out", users: 1220 },
    { month: "Nov", users: 1235 },
    { month: "Dez", users: 1247 },
]

// ─── Atividade diária (últimas 2 semanas) ─────────────────────────────────────

export const ACTIVITY_DATA: ActivityPoint[] = [
    { day: "04/03", sessions: 98, xp: 2940 },
    { day: "05/03", sessions: 124, xp: 3720 },
    { day: "06/03", sessions: 89, xp: 2670 },
    { day: "07/03", sessions: 143, xp: 4290 },
    { day: "08/03", sessions: 110, xp: 3300 },
    { day: "09/03", sessions: 76, xp: 2280 },
    { day: "10/03", sessions: 61, xp: 1830 },
    { day: "11/03", sessions: 132, xp: 3960 },
    { day: "12/03", sessions: 158, xp: 4740 },
    { day: "13/03", sessions: 119, xp: 3570 },
    { day: "14/03", sessions: 167, xp: 5010 },
    { day: "15/03", sessions: 145, xp: 4350 },
    { day: "16/03", sessions: 93, xp: 2790 },
    { day: "17/03", sessions: 89, xp: 2670 },
]

// ─── Usuários fake ─────────────────────────────────────────────────────────────

export const ADMIN_USERS: AdminUser[] = [
    {
        id: 1,
        name: "Vinicius Chagas",
        email: "vinicius@fluencylab.com",
        github: "ViniiCh4g4s",
        xp: 8420,
        level: 18,
        streak: 42,
        isActive: true,
        createdAt: "2025-01-03",
    },
    {
        id: 2,
        name: "Ana Beatriz",
        email: "ana.beatriz@email.com",
        github: "anabeatriz",
        xp: 7310,
        level: 16,
        streak: 31,
        isActive: true,
        createdAt: "2025-01-10",
    },
    {
        id: 3,
        name: "Carlos Mendes",
        email: "c.mendes@email.com",
        github: "cmendes",
        xp: 6890,
        level: 15,
        streak: 28,
        isActive: true,
        createdAt: "2025-01-14",
    },
    {
        id: 4,
        name: "Fernanda Rocha",
        email: "fernanda.r@email.com",
        github: "fernandarocha",
        xp: 6240,
        level: 14,
        streak: 19,
        isActive: false,
        createdAt: "2025-01-20",
    },
    {
        id: 5,
        name: "Gabriel Oliveira",
        email: "gabriel.o@email.com",
        github: "gabrielo",
        xp: 5970,
        level: 14,
        streak: 24,
        isActive: true,
        createdAt: "2025-01-25",
    },
    {
        id: 6,
        name: "Isabela Santos",
        email: "isabela.s@email.com",
        github: "isabelas",
        xp: 5530,
        level: 13,
        streak: 15,
        isActive: true,
        createdAt: "2025-02-01",
    },
    {
        id: 7,
        name: "João Pedro Lima",
        email: "joaop.lima@email.com",
        github: "joaoplima",
        xp: 5210,
        level: 12,
        streak: 22,
        isActive: false,
        createdAt: "2025-02-08",
    },
    {
        id: 8,
        name: "Larissa Costa",
        email: "larissa.c@email.com",
        github: "larissac",
        xp: 4880,
        level: 12,
        streak: 9,
        isActive: true,
        createdAt: "2025-02-14",
    },
    {
        id: 9,
        name: "Matheus Ferreira",
        email: "matheus.f@email.com",
        github: "matheusf",
        xp: 4560,
        level: 11,
        streak: 17,
        isActive: true,
        createdAt: "2025-02-20",
    },
    {
        id: 10,
        name: "Natália Alves",
        email: "natalia.a@email.com",
        github: "nataliaa",
        xp: 4230,
        level: 11,
        streak: 12,
        isActive: false,
        createdAt: "2025-02-25",
    },
    {
        id: 11,
        name: "Pedro Henrique",
        email: "pedro.h@email.com",
        github: "pedroh",
        xp: 3910,
        level: 10,
        streak: 7,
        isActive: true,
        createdAt: "2025-03-02",
    },
    {
        id: 12,
        name: "Rafaela Torres",
        email: "rafaela.t@email.com",
        github: "rafaelat",
        xp: 3580,
        level: 9,
        streak: 14,
        isActive: true,
        createdAt: "2025-03-05",
    },
    {
        id: 13,
        name: "Rodrigo Nascimento",
        email: "rodrigo.n@email.com",
        github: "rodrigon",
        xp: 3240,
        level: 9,
        streak: 5,
        isActive: false,
        createdAt: "2025-03-08",
    },
    {
        id: 14,
        name: "Sophia Cardoso",
        email: "sophia.c@email.com",
        github: "sophiac",
        xp: 2980,
        level: 8,
        streak: 20,
        isActive: true,
        createdAt: "2025-03-11",
    },
    {
        id: 15,
        name: "Thiago Barbosa",
        email: "thiago.b@email.com",
        github: "thiagob",
        xp: 2670,
        level: 7,
        streak: 3,
        isActive: true,
        createdAt: "2025-03-14",
    },
]

// ─── Frases fake ──────────────────────────────────────────────────────────────

export const ADMIN_PHRASES: AdminPhrase[] = [
    {
        id: 1,
        english: "Can I have the check, please?",
        portuguese: "Pode trazer a conta, por favor?",
        difficulty: "fácil",
        category: "Cotidiano",
        timePracticed: 412,
    },
    {
        id: 2,
        english: "What time does the store close?",
        portuguese: "A que horas a loja fecha?",
        difficulty: "fácil",
        category: "Cotidiano",
        timePracticed: 389,
    },
    {
        id: 3,
        english: "I'm not feeling well today.",
        portuguese: "Não estou me sentindo bem hoje.",
        difficulty: "fácil",
        category: "Cotidiano",
        timePracticed: 356,
    },
    {
        id: 4,
        english: "Could you turn down the music?",
        portuguese: "Você pode baixar o volume da música?",
        difficulty: "médio",
        category: "Cotidiano",
        timePracticed: 301,
    },
    {
        id: 5,
        english: "Where is the nearest bus stop?",
        portuguese: "Onde fica o ponto de ônibus mais próximo?",
        difficulty: "fácil",
        category: "Viagens",
        timePracticed: 478,
    },
    {
        id: 6,
        english: "I'd like to book a room for two nights.",
        portuguese: "Gostaria de reservar um quarto por duas noites.",
        difficulty: "médio",
        category: "Viagens",
        timePracticed: 334,
    },
    {
        id: 7,
        english: "My flight has been delayed.",
        portuguese: "Meu voo está atrasado.",
        difficulty: "médio",
        category: "Viagens",
        timePracticed: 298,
    },
    {
        id: 8,
        english: "Let's schedule a meeting for next week.",
        portuguese: "Vamos agendar uma reunião para a próxima semana.",
        difficulty: "médio",
        category: "Negócios",
        timePracticed: 267,
    },
    {
        id: 9,
        english: "Please send me the report by Monday.",
        portuguese: "Por favor, me envie o relatório até segunda-feira.",
        difficulty: "médio",
        category: "Negócios",
        timePracticed: 243,
    },
    {
        id: 10,
        english: "I need to reschedule our appointment.",
        portuguese: "Preciso remarcar nosso compromisso.",
        difficulty: "difícil",
        category: "Negócios",
        timePracticed: 198,
    },
    {
        id: 11,
        english: "She has been working here since 2020.",
        portuguese: "Ela trabalha aqui desde 2020.",
        difficulty: "difícil",
        category: "Gramática",
        timePracticed: 187,
    },
    {
        id: 12,
        english: "If I were you, I would study harder.",
        portuguese: "Se eu fosse você, estudaria mais.",
        difficulty: "difícil",
        category: "Gramática",
        timePracticed: 164,
    },
    {
        id: 13,
        english: "It's raining cats and dogs.",
        portuguese: "Está chovendo muito.",
        difficulty: "fácil",
        category: "Expressões",
        timePracticed: 521,
    },
    {
        id: 14,
        english: "Break a leg!",
        portuguese: "Boa sorte!",
        difficulty: "fácil",
        category: "Expressões",
        timePracticed: 493,
    },
    {
        id: 15,
        english: "The ball is in your court.",
        portuguese: "A decisão é sua.",
        difficulty: "médio",
        category: "Expressões",
        timePracticed: 276,
    },
]
