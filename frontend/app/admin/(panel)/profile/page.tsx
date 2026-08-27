"use client"

import { useCallback, useEffect, useState } from "react"
import AppLayout from "@/app/_layouts/app-layout"
import { type BreadcrumbItem, type User } from "@/app/_lib/utils"
import { apiErrorMessage, getProfile, type Profile } from "@/app/_lib/admin-api"
import { AvatarUpload } from "@/app/_components/admin/profile/avatar-upload"
import { CardContainer } from "@/app/_components/admin/profile/card-container"
import { CardRow } from "@/app/_components/admin/profile/card-row"
import { DeleteRow } from "@/app/_components/admin/profile/delete-dialog"
import { EmailRow } from "@/app/_components/admin/profile/email-dialog"
import { NameForm } from "@/app/_components/admin/profile/name-form"
import { PasswordRow } from "@/app/_components/admin/profile/password-dialog"
import { PasskeysRow } from "@/app/_components/admin/profile/passkeys-row"
import { TwoFactorRow } from "@/app/_components/admin/profile/two-factor-row"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import { useAppearance, type Appearance } from "@/hooks/use-appearance"
import { Monitor, Moon, Sun } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Perfil", href: "/admin/profile" },
]

// Adapta o Profile da API para o formato User usado pelos componentes de perfil.
function toUser(p: Profile): User {
    return {
        id: p.id,
        name: p.name,
        email: p.email,
        avatar: p.avatar ?? undefined,
        email_verified_at: null,
        created_at: p.created_at,
        updated_at: "",
    }
}

// Opções de tema com ícone e rótulo
const themeOptions: { value: Appearance; icon: React.ElementType; label: string }[] = [
    { value: "system", icon: Monitor, label: "Sistema" },
    { value: "light", icon: Sun, label: "Claro" },
    { value: "dark", icon: Moon, label: "Escuro" },
]

export default function ProfilePage() {
    const { appearance, updateAppearance } = useAppearance()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            setProfile(await getProfile())
        } catch (err) {
            setError(apiErrorMessage(err, "Não foi possível carregar o perfil."))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const user = profile ? toUser(profile) : null

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 md:p-10">
                {/* Cabeçalho */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Perfil</h1>
                    <p className="mt-0.5 text-sm text-slate-400">
                        Suas informações e preferências pessoais.
                    </p>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading || !user ? (
                    loading && <p className="text-sm text-slate-400">Carregando…</p>
                ) : (
                    <>
                        {/* Geral */}
                        <CardContainer title="Geral">
                            <AvatarUpload user={user} onUpdated={load} />
                            <NameForm user={user} onUpdated={load} />
                            <EmailRow user={user} onUpdated={load} />
                        </CardContainer>

                        {/* Segurança */}
                        <CardContainer title="Segurança">
                            <PasswordRow user={user} />
                            <TwoFactorRow />
                            <PasskeysRow />
                        </CardContainer>

                        {/* Preferências */}
                        <CardContainer title="Preferências">
                            <CardRow label="Tema" description="Escolha seu tema preferido">
                                <Select
                                    value={appearance}
                                    onValueChange={(v) => updateAppearance(v as Appearance)}
                                >
                                    <SelectTrigger className="h-9 w-36">
                                        <SelectValue>
                                            {(() => {
                                                const opt = themeOptions.find(
                                                    (o) => o.value === appearance
                                                )
                                                if (!opt) return null
                                                const Icon = opt.icon
                                                return (
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="size-3 shrink-0" />
                                                        {opt.label}
                                                    </div>
                                                )
                                            })()}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {themeOptions.map(({ value, icon: Icon, label }) => (
                                            <SelectItem key={value} value={value}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="size-3 shrink-0" />
                                                    {label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardRow>
                        </CardContainer>

                        {/* Zona de Perigo */}
                        <CardContainer title="Zona de Perigo">
                            <DeleteRow />
                        </CardContainer>
                    </>
                )}
            </div>
        </AppLayout>
    )
}
