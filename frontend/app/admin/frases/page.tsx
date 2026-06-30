"use client"

import AppLayout from "@/app/_layouts/app-layout"
import { type BreadcrumbItem } from "@/app/_lib/utils"
import { ADMIN_PHRASES } from "@/app/_lib/admin"
import { cn } from "@/app/_lib/utils"
import { CardContainer } from "@/app/_components/admin/profile/card-container"
import { Button } from "@/app/_components/ui/button"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Frases", href: "/admin/frases" },
]

const difficultyStyle: Record<string, string> = {
    "f\u00e1cil": "bg-emerald-50 text-emerald-700",
    "m\u00e9dio": "bg-amber-50 text-amber-700",
    "dif\u00edcil": "bg-red-50 text-red-600",
}

const categoryStyle: Record<string, string> = {
    Cotidiano: "bg-blue-50 text-blue-700",
    Viagens: "bg-violet-50 text-violet-700",
    "Neg\u00f3cios": "bg-slate-100 text-slate-700",
    "Gram\u00e1tica": "bg-teal-50 text-teal-700",
    "Express\u00f5es": "bg-orange-50 text-orange-700",
}

export default function FrasesPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 md:p-10">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Frases</h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            {ADMIN_PHRASES.length} frases cadastradas
                        </p>
                    </div>
                    <Button className="shrink-0">+ Nova frase</Button>
                </div>

                {/* Tabela */}
                <CardContainer title="Todas as frases">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 bg-slate-50 text-xs tracking-wide text-slate-600 uppercase dark:border-white/8 dark:bg-white/3">
                                    <th className="w-8 px-5 py-3 text-left">#</th>
                                    <th className="px-5 py-3 text-left">Inglês</th>
                                    <th className="px-5 py-3 text-left">Português</th>
                                    <th className="px-5 py-3 text-left">Dificuldade</th>
                                    <th className="px-5 py-3 text-left">Categoria</th>
                                    <th className="px-5 py-3 text-right">Praticada</th>
                                    <th className="px-5 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ADMIN_PHRASES.map((phrase, i) => (
                                    <tr
                                        key={phrase.id}
                                        className={cn(
                                            "border-b border-neutral-100 transition-colors hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/3",
                                            i === ADMIN_PHRASES.length - 1 && "border-b-0"
                                        )}
                                    >
                                        <td className="px-5 py-3 font-mono text-xs text-slate-500">
                                            {phrase.id}
                                        </td>

                                        <td className="max-w-xs px-5 py-3">
                                            <p className="truncate font-medium text-slate-800">
                                                {phrase.english}
                                            </p>
                                        </td>

                                        <td className="max-w-xs px-5 py-3">
                                            <p className="truncate text-slate-600">
                                                {phrase.portuguese}
                                            </p>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span
                                                className={cn(
                                                    "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                                                    difficultyStyle[phrase.difficulty]
                                                )}
                                            >
                                                {phrase.difficulty}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span
                                                className={cn(
                                                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                                    categoryStyle[phrase.category] ??
                                                        "bg-slate-100 text-slate-600"
                                                )}
                                            >
                                                {phrase.category}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-right font-mono font-semibold text-slate-700">
                                            {phrase.timePracticed.toLocaleString("pt-BR")}×
                                        </td>

                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="rounded-lg px-2.5 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50">
                                                    Editar
                                                </button>
                                                <button className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
                                                    Remover
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContainer>
            </div>
        </AppLayout>
    )
}
