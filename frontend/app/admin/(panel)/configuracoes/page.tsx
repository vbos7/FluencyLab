"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/app/_layouts/app-layout"
import { type BreadcrumbItem } from "@/app/_lib/utils"
import { apiErrorMessage, getSettings, saveSettings } from "@/app/_lib/admin-api"
import { CardContainer } from "@/app/_components/admin/profile/card-container"
import { CardRow } from "@/app/_components/admin/profile/card-row"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { onlyPositiveInt, onlyPositiveDecimal } from "@/app/_lib/masks"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Configurações", href: "/admin/configuracoes" },
]

// Toggle reutilizável nesta página
function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label?: string }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={label}
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${enabled ? "bg-blue-600" : "bg-slate-200"}`}
        >
            <span
                className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`}
            />
        </button>
    )
}

// Campo de texto multi-linha — full-width dentro do CardContainer
function TextAreaRow({
    label,
    description,
    value,
    onChange,
}: {
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
                    <p className="text-xs font-light text-neutral-600 dark:text-neutral-400">
                        {description}
                    </p>
                )}
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
        </div>
    )
}

// "1"/"0" (ou "true"/"false") → boolean; ausente cai no padrão informado.
function toBool(v: string | undefined, fallback: boolean) {
    if (v === undefined) return fallback
    return v === "1" || v === "true"
}

export default function ConfiguracoesPage() {
    const [appName, setAppName] = useState("FluencyLab")
    const [appDesc, setAppDesc] = useState("Plataforma de aprendizado de inglês gamificada.")
    const [xpPerPhrase, setXpPerPhrase] = useState("10")
    const [streakBonus, setStreakBonus] = useState("1.5")
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [newRegistrations, setNewRegistrations] = useState(true)
    const [rankingPublic, setRankingPublic] = useState(true)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    // Carrega os valores atuais do backend (mantém os padrões quando ainda não há registro).
    useEffect(() => {
        getSettings()
            .then((s) => {
                if (s.app_name !== undefined) setAppName(s.app_name)
                if (s.app_description !== undefined) setAppDesc(s.app_description)
                if (s.xp_per_phrase !== undefined) setXpPerPhrase(s.xp_per_phrase)
                if (s.streak_bonus !== undefined) setStreakBonus(s.streak_bonus)
                setMaintenanceMode(toBool(s.maintenance_mode, false))
                setNewRegistrations(toBool(s.new_registrations, true))
                setRankingPublic(toBool(s.ranking_public, true))
            })
            .catch((err) => setError(apiErrorMessage(err, "Não foi possível carregar as configurações.")))
            .finally(() => setLoading(false))
    }, [])

    async function handleSave() {
        setSaving(true)
        setError("")
        try {
            await saveSettings({
                app_name: appName,
                app_description: appDesc,
                xp_per_phrase: xpPerPhrase,
                streak_bonus: streakBonus,
                ranking_public: rankingPublic,
                new_registrations: newRegistrations,
                maintenance_mode: maintenanceMode,
            })
            toast.success("Configurações salvas.")
        } catch (err) {
            setError(apiErrorMessage(err, "Não foi possível salvar as configurações."))
        } finally {
            setSaving(false)
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 md:p-10">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
                        <p className="mt-0.5 text-sm text-slate-400">
                            Gerencie as configurações da plataforma.
                        </p>
                    </div>
                    <Button onClick={handleSave} disabled={saving || loading} className="shrink-0">
                        {saving ? "Salvando…" : "Salvar alterações"}
                    </Button>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Geral */}
                <CardContainer title="Geral">
                    <CardRow label="Nome da plataforma">
                        <Input
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
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
                            onChange={(e) => setXpPerPhrase(onlyPositiveInt(e.target.value))}
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
                            onChange={(e) => setStreakBonus(onlyPositiveDecimal(e.target.value))}
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
