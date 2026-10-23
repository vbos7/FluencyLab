"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/app/_lib/api"
import { apiErrorMessage } from "@/app/_lib/admin-api"
import {
    billingLabel,
    formatPrice,
    type CheckoutSession,
    type Feature,
    type Plan,
} from "@/app/_lib/plans"

// Mesma página de volta usada pelo login (?next=) quando um visitante quer assinar.
const LOGIN_PARA_ASSINAR = "/login?next=/planos"

function FeatureItem({ f }: { f: Feature }) {
    return (
        <li className="flex items-start gap-2 text-sm">
            <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    f.included
                        ? f.highlight
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                }`}
                aria-hidden="true"
            >
                {f.included ? (f.highlight ? "★" : "✓") : "–"}
            </span>
            <span className={f.included ? "text-gray-800" : "text-gray-400"}>
                {f.label}
                {!f.included && <span className="sr-only"> (não incluso)</span>}
            </span>
        </li>
    )
}

type Props = {
    freePlan: Plan | null
    proPlan: Plan | null
    isLoggedIn: boolean
    isPro: boolean
    checkoutCanceled: boolean
}

export default function PlanosContent({
    freePlan,
    proPlan,
    isLoggedIn,
    isPro,
    checkoutCanceled,
}: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleAssinar() {
        if (!proPlan) return
        setLoading(true)
        setError("")
        try {
            const res = await apiClient.post<CheckoutSession>(
                "/stripe/create-checkout-session.php",
                {
                    plan_id: proPlan.id,
                }
            )
            window.location.href = res.data.url
        } catch (err) {
            const status = (err as { response?: { status?: number } })?.response?.status
            // Sessão expirou entre abrir a página e clicar: entra e volta pra cá.
            if (status === 401) {
                router.push(LOGIN_PARA_ASSINAR)
                return
            }
            setError(apiErrorMessage(err, "Não foi possível iniciar o checkout. Tente novamente."))
            setLoading(false)
        }
    }

    const ctaClass =
        "mt-2 block w-full rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"

    return (
        <div className="relative grid min-h-screen place-items-center overflow-hidden p-7">
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }}
            />

            <section className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] sm:p-6">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-semibold text-gray-900">Escolha seu plano</h1>
                    <p className="mt-2 text-gray-500">Comece grátis. Evolua quando quiser.</p>
                </div>

                {checkoutCanceled && (
                    <p
                        role="status"
                        className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800"
                    >
                        Pagamento cancelado. Nada foi cobrado.
                    </p>
                )}

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Card Free */}
                    {freePlan && (
                        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-6">
                            <div>
                                <span className="text-sm font-medium text-gray-500">
                                    {freePlan.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-4xl font-semibold text-gray-900">
                                    {formatPrice(freePlan.price)}
                                </span>
                                <span className="ml-1 text-sm text-gray-400">/ sempre</span>
                            </div>
                            <p className="border-b border-gray-100 pb-4 text-sm text-gray-500">
                                Para quem quer começar sem compromisso.
                            </p>
                            <ul className="flex flex-1 flex-col gap-2">
                                {freePlan.features.map((f) => (
                                    <FeatureItem key={f.label} f={f} />
                                ))}
                            </ul>
                            {!isLoggedIn ? (
                                <Link
                                    href="/register"
                                    className="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                    Criar conta grátis
                                </Link>
                            ) : (
                                !isPro && (
                                    <p className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-500">
                                        Seu plano atual
                                    </p>
                                )
                            )}
                        </div>
                    )}

                    {/* Card Pro */}
                    {proPlan && (
                        <div className="flex flex-col gap-4 rounded-2xl border-2 border-blue-500 p-6 shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    {proPlan.name}
                                </span>
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                    ✦ Premium
                                </span>
                            </div>
                            <div>
                                <span className="text-4xl font-semibold text-gray-900">
                                    {formatPrice(proPlan.price)}
                                </span>
                                <span className="ml-1 text-sm text-gray-400">
                                    / {billingLabel(proPlan)}
                                </span>
                            </div>
                            <p className="border-b border-gray-100 pb-4 text-sm text-gray-500">
                                {proPlan.description ??
                                    "Evolua o jeito de praticar com recursos exclusivos."}
                            </p>
                            <ul className="flex flex-1 flex-col gap-2">
                                {proPlan.features.map((f) => (
                                    <FeatureItem key={f.label} f={f} />
                                ))}
                            </ul>
                            {isPro ? (
                                <p className="mt-2 w-full rounded-xl bg-green-50 px-4 py-2.5 text-center text-sm font-semibold text-green-700">
                                    ✓ Você já é {proPlan.name}
                                </p>
                            ) : !isLoggedIn ? (
                                <Link href={LOGIN_PARA_ASSINAR} className={ctaClass}>
                                    Entrar para assinar
                                </Link>
                            ) : (
                                <button
                                    onClick={handleAssinar}
                                    disabled={loading}
                                    className={ctaClass}
                                >
                                    {loading ? "Redirecionando..." : `Assinar ${proPlan.name}`}
                                </button>
                            )}
                            {error && (
                                <p role="alert" className="text-center text-xs text-red-600">
                                    {error}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    Pagamento processado com segurança pela Stripe. Pagamento único, sem
                    renovação automática.
                </p>
            </section>
        </div>
    )
}
