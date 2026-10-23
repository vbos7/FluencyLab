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
    description: string | null
    billing_period: "monthly" | "lifetime"
    features: Feature[]
}

// Plano Pro selecionado para o checkout (null quando não há Pro disponível).
export type ProPlan = Plan | null

// Resposta de POST /stripe/create-checkout-session.php: URL da Checkout Session
// hospedada pela própria Stripe, pra onde o navegador é redirecionado.
export type CheckoutSession = { url: string }

// Resposta de GET /stripe/confirm-session.php.
export type ConfirmedCheckout = { success: boolean; plan?: string }

// "4.99" → "R$ 4,99"
export function formatPrice(price: string): string {
    return Number(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function billingLabel(plan: Plan): string {
    return plan.billing_period === "lifetime" ? "pagamento único" : "por mês"
}
