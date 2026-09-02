// Contratos de plano compartilhados. O backend (/plans.php) devolve o preço como
// string (DECIMAL do MySQL). As features vêm da tabela normalizada plan_features.

export type Feature = {
    label: string
    included: boolean
    highlight?: boolean
}

// Plano como vem de GET /plans.php (usado na página de planos e no checkout).
export type Plan = {
    id: number
    name: string
    price: string
    billing_period: "monthly" | "lifetime"
}

// Plano Pro selecionado para o checkout (null quando não há Pro disponível).
export type ProPlan = Plan | null
