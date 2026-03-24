"use client"

import AppLayout from '@/app/_layouts/app-layout'
import { type BreadcrumbItem } from '@/app/_lib/utils'
import { ADMIN_PHRASES } from '@/app/_lib/admin'
import { cn } from '@/app/_lib/utils'
import { CardContainer } from '@/app/_components/admin/profile/card-container'
import { Button } from '@/app/_components/ui/button'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Frases',    href: '/admin/frases'    },
]

const difficultyStyle: Record<string, string> = {
    'fácil':   'bg-emerald-50 text-emerald-700',
    'médio':   'bg-amber-50 text-amber-700',
    'difícil': 'bg-red-50 text-red-600',
}

const categoryStyle: Record<string, string> = {
    'Cotidiano':  'bg-blue-50 text-blue-700',
    'Viagens':    'bg-violet-50 text-violet-700',
    'Negócios':   'bg-slate-100 text-slate-700',
    'Gramática':  'bg-teal-50 text-teal-700',
    'Expressões': 'bg-orange-50 text-orange-700',
}

export default function FrasesPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-6xl w-full flex flex-col gap-6 p-6 md:p-10">

                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Frases</h1>
                        <p className="text-sm text-slate-400 mt-0.5">{ADMIN_PHRASES.length} frases cadastradas</p>
                    </div>
                    <Button className="shrink-0">+ Nova frase</Button>
                </div>

                {/* Tabela */}
                <CardContainer title="Todas as frases">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide dark:border-white/8 dark:bg-white/3">
                                    <th className="px-5 py-3 text-left w-8">#</th>
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
                                            'border-b border-neutral-100 transition-colors hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/3',
                                            i === ADMIN_PHRASES.length - 1 && 'border-b-0'
                                        )}
                                    >
                                        <td className="px-5 py-3 text-slate-400 font-mono text-xs">{phrase.id}</td>

                                        <td className="px-5 py-3 max-w-xs">
                                            <p className="font-medium text-slate-800 truncate">{phrase.english}</p>
                                        </td>

                                        <td className="px-5 py-3 max-w-xs">
                                            <p className="text-slate-500 truncate">{phrase.portuguese}</p>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span className={cn(
                                                'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
                                                difficultyStyle[phrase.difficulty]
                                            )}>
                                                {phrase.difficulty}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span className={cn(
                                                'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                                                categoryStyle[phrase.category] ?? 'bg-slate-100 text-slate-600'
                                            )}>
                                                {phrase.category}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-right font-mono text-slate-700 font-semibold">
                                            {phrase.timePracticed.toLocaleString('pt-BR')}×
                                        </td>

                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="rounded-lg px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 transition-colors font-medium">
                                                    Editar
                                                </button>
                                                <button className="rounded-lg px-2.5 py-1 text-xs text-red-500 hover:bg-red-50 transition-colors font-medium">
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
