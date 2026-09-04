"use client"

import { useState } from "react"
import CheckoutModal from "@/app/_components/checkout-modal"

export type Feature = { label: string; included: boolean; highlight?: boolean }

export type Plan = {
    id: number
    name: string
    price: number | string
    description: string
    features: Feature[]
    billing_period: "monthly" | "lifetime"
}

function FeatureItem({ feature }: { feature: Feature }) {
    return (
        <li className="flex items-start gap-2 text-sm">
            <span
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] ${feature.included ? (feature.highlight ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-700") : "bg-gray-100 text-gray-400"}`}
            >
                {feature.included ? (feature.highlight ? "★" : "✓") : "–"}
            </span>
            <span className={feature.included ? "text-gray-800" : "text-gray-400"}>
                {feature.label}
            </span>
        </li>
    )
}

function formatPrice(price: Plan["price"]) {
    return Number(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function PlanCards({ plans }: { plans: Plan[] }) {
    const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null)

    if (plans.length === 0) {
        return <p className="py-10 text-center text-sm text-gray-500">Nenhum plano disponível.</p>
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {plans.map((plan) => {
                    const isPaid = Number(plan.price) > 0
                    return (
                        <section
                            key={plan.id}
                            className={`flex flex-col gap-4 rounded-2xl p-6 ${isPaid ? "border-2 border-blue-500 shadow-md" : "border border-gray-200"}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    {plan.name}
                                </span>
                                {isPaid && (
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                        ✦ Premium
                                    </span>
                                )}
                            </div>
                            <div>
                                <span className="text-4xl font-semibold text-gray-900">
                                    {formatPrice(plan.price)}
                                </span>
                                <span className="ml-1 text-sm text-gray-400">
                                    / {plan.billing_period === "lifetime" ? "vitalício" : "mês"}
                                </span>
                            </div>
                            <p className="border-b border-gray-100 pb-4 text-sm text-gray-500">
                                {plan.description}
                            </p>
                            <ul className="flex flex-1 flex-col gap-2">
                                {(plan.features ?? []).map((feature) => (
                                    <FeatureItem key={feature.label} feature={feature} />
                                ))}
                            </ul>
                            <button
                                type="button"
                                disabled={!isPaid}
                                onClick={() => isPaid && setCheckoutPlan(plan)}
                                className={`mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition ${isPaid ? "bg-blue-600 text-white hover:bg-blue-700" : "cursor-default border border-gray-200 text-gray-700"}`}
                            >
                                {isPaid ? `Assinar ${plan.name}` : "Plano gratuito"}
                            </button>
                        </section>
                    )
                })}
            </div>

            {checkoutPlan && (
                <CheckoutModal
                    planId={checkoutPlan.id}
                    planName={checkoutPlan.name}
                    price={Number(checkoutPlan.price)}
                    billingPeriod={checkoutPlan.billing_period}
                    onClose={() => setCheckoutPlan(null)}
                />
            )}
        </>
    )
}
