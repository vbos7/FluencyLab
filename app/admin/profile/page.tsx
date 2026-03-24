"use client"

import AppLayout from '@/app/_layouts/app-layout'
import { type BreadcrumbItem, type User } from '@/app/_lib/utils'
import { AvatarUpload }    from '@/app/_components/admin/profile/avatar-upload'
import { CardContainer }   from '@/app/_components/admin/profile/card-container'
import { CardRow }         from '@/app/_components/admin/profile/card-row'
import { DeleteRow }       from '@/app/_components/admin/profile/delete-dialog'
import { EmailRow }        from '@/app/_components/admin/profile/email-dialog'
import { NameForm }        from '@/app/_components/admin/profile/name-form'
import { PasswordRow }     from '@/app/_components/admin/profile/password-dialog'
import { TwoFactorRow }    from '@/app/_components/admin/profile/two-factor-row'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/app/_components/ui/select'
import { useAppearance, type Appearance } from '@/hooks/use-appearance'
import { Monitor, Moon, Sun } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Perfil',    href: '/admin/profile'   },
]

// Usuário de demonstração — substituir pelo usuário autenticado quando disponível
const MOCK_USER: User = {
    id: 1,
    name: 'Admin',
    email: 'admin@fluencylab.com',
    email_verified_at: null,
    created_at: '',
    updated_at: '',
}

// Opções de tema com ícone e rótulo
const themeOptions: { value: Appearance; icon: React.ElementType; label: string }[] = [
    { value: 'system', icon: Monitor, label: 'Sistema' },
    { value: 'light',  icon: Sun,     label: 'Claro'   },
    { value: 'dark',   icon: Moon,    label: 'Escuro'  },
]

export default function ProfilePage() {
    const user = MOCK_USER
    const { appearance, updateAppearance } = useAppearance()

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-5xl w-full flex flex-col gap-6 p-6 md:p-10">

                {/* Cabeçalho */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Perfil</h1>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Suas informações e preferências pessoais.
                    </p>
                </div>

                {/* Geral */}
                <CardContainer title="Geral">
                    <AvatarUpload user={user} />
                    <NameForm     user={user} />
                    <EmailRow     user={user} />
                </CardContainer>

                {/* Segurança */}
                <CardContainer title="Segurança">
                    <PasswordRow />
                    <TwoFactorRow />
                </CardContainer>

                {/* Preferências */}
                <CardContainer title="Preferências">
                    <CardRow label="Tema" description="Escolha seu tema preferido">
                        <Select
                            value={appearance}
                            onValueChange={v => updateAppearance(v as Appearance)}
                        >
                            <SelectTrigger className="h-9 w-36">
                                <SelectValue>
                                    {(() => {
                                        const opt = themeOptions.find(o => o.value === appearance)
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

            </div>
        </AppLayout>
    )
}
