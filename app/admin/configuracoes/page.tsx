"use client"

import { useState } from 'react'
import AppLayout from '@/app/_layouts/app-layout'
import { type BreadcrumbItem } from '@/app/_lib/utils'
import { CardContainer } from '@/app/_components/admin/profile/card-container'
import { CardRow }       from '@/app/_components/admin/profile/card-row'
import { Button }        from '@/app/_components/ui/button'
import { Input }         from '@/app/_components/ui/input'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard',     href: '/admin/dashboard'    },
    { title: 'Configurações', href: '/admin/configuracoes' },
]

// Toggle reutilizável nesta página
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
        >
            <span className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
        </button>
    )
}

// Campo de texto multi-linha — full-width dentro do CardContainer
function TextAreaRow({ label, description, value, onChange }: {
    label: string
    description?: string
    value: string
    onChange: (v: string) => void
}) {
    return (
        <div className="flex flex-col gap-2 py-3 pr-2.5 pl-4">
            <div className="space-y-0.5">
                <h3 className="text-sm leading-tight">{label}</h3>
                {description && (
                    <p className="text-xs font-light text-neutral-600 dark:text-neutral-400">{description}</p>
                )}
            </div>
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            />
        </div>
    )
}

export default function ConfiguracoesPage() {
    const [appName,          setAppName]          = useState('FluencyLab')
    const [appDesc,          setAppDesc]           = useState('Plataforma de aprendizado de inglês gamificada.')
    const [xpPerPhrase,      setXpPerPhrase]       = useState('10')
    const [streakBonus,      setStreakBonus]        = useState('1.5')
    const [maintenanceMode,  setMaintenanceMode]   = useState(false)
    const [newRegistrations, setNewRegistrations]  = useState(true)
    const [rankingPublic,    setRankingPublic]      = useState(true)
    const [saving,           setSaving]            = useState(false)
    const [saved,            setSaved]             = useState(false)

    async function handleSave() {
        setSaving(true)
        // TODO: PATCH /api/admin/settings
        await new Promise(r => setTimeout(r, 800))
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-5xl w-full flex flex-col gap-6 p-6 md:p-10">

                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
                        <p className="text-sm text-slate-400 mt-0.5">Gerencie as configurações da plataforma.</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="shrink-0">
                        {saving ? 'Salvando…' : saved ? 'Salvo!' : 'Salvar alterações'}
                    </Button>
                </div>

                {/* Geral */}
                <CardContainer title="Geral">
                    <CardRow label="Nome da plataforma">
                        <Input
                            value={appName}
                            onChange={e => setAppName(e.target.value)}
                            className="h-9 w-full max-w-[220px]"
                        />
                    </CardRow>
                    <TextAreaRow
                        label="Descrição"
                        description="Texto apresentado na página inicial da plataforma"
                        value={appDesc}
                        onChange={setAppDesc}
                    />
                </CardContainer>

                {/* Gamificação */}
                <CardContainer title="Gamificação">
                    <CardRow
                        label="XP por frase correta"
                        description="Quantidade base de XP concedida por acerto"
                    >
                        <Input
                            type="number"
                            value={xpPerPhrase}
                            onChange={e => setXpPerPhrase(e.target.value)}
                            min={1}
                            max={100}
                            className="h-9 w-28 text-right"
                        />
                    </CardRow>
                    <CardRow
                        label="Multiplicador de sequência"
                        description="Bônus de XP aplicado a dias consecutivos de prática"
                    >
                        <Input
                            type="number"
                            value={streakBonus}
                            onChange={e => setStreakBonus(e.target.value)}
                            min={1}
                            step={0.1}
                            max={5}
                            className="h-9 w-28 text-right"
                        />
                    </CardRow>
                    <CardRow
                        label="Ranking público"
                        description="Exibir classificação geral para todos os usuários"
                    >
                        <Toggle enabled={rankingPublic} onChange={setRankingPublic} />
                    </CardRow>
                </CardContainer>

                {/* Acesso */}
                <CardContainer title="Acesso">
                    <CardRow
                        label="Novos cadastros"
                        description="Permitir que novos usuários criem uma conta"
                    >
                        <Toggle enabled={newRegistrations} onChange={setNewRegistrations} />
                    </CardRow>
                    <CardRow
                        label="Modo de manutenção"
                        description="Desativa o acesso para todos os usuários não-administradores"
                    >
                        <Toggle enabled={maintenanceMode} onChange={setMaintenanceMode} />
                    </CardRow>
                </CardContainer>

            </div>
        </AppLayout>
    )
}
