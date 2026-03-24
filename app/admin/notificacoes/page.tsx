"use client"

import { useState } from 'react'
import AppLayout from '@/app/_layouts/app-layout'
import { type BreadcrumbItem } from '@/app/_lib/utils'
import { CardContainer } from '@/app/_components/admin/profile/card-container'
import { CardRow }       from '@/app/_components/admin/profile/card-row'
import { Button }        from '@/app/_components/ui/button'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard',   href: '/admin/dashboard'    },
    { title: 'Notificações', href: '/admin/notificacoes' },
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

export default function NotificacoesPage() {
    // E-mail
    const [emailAtivo,    setEmailAtivo]    = useState(true)
    const [emailBoasVindas, setEmailBoasVindas] = useState(true)
    const [emailStreak,   setEmailStreak]   = useState(true)
    const [emailRanking,  setEmailRanking]  = useState(false)
    const [emailConteudo, setEmailConteudo] = useState(false)

    // Sistema
    const [sysManutencao,   setSysManutencao]   = useState(true)
    const [sysSeguranca,    setSysSeguranca]    = useState(true)
    const [sysNovoUsuario,  setSysNovoUsuario]  = useState(false)

    const [saving, setSaving] = useState(false)
    const [saved,  setSaved]  = useState(false)

    async function handleSave() {
        setSaving(true)
        // TODO: PATCH /api/admin/notifications
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
                        <h1 className="text-2xl font-bold text-slate-900">Notificações</h1>
                        <p className="text-sm text-slate-400 mt-0.5">Controle quais notificações são enviadas pela plataforma.</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="shrink-0">
                        {saving ? 'Salvando…' : saved ? 'Salvo!' : 'Salvar alterações'}
                    </Button>
                </div>

                {/* E-mail */}
                <CardContainer title="E-mail">
                    <CardRow
                        label="Notificações por e-mail"
                        description="Habilitar ou desabilitar todos os envios de e-mail da plataforma"
                    >
                        <Toggle enabled={emailAtivo} onChange={setEmailAtivo} />
                    </CardRow>
                    <CardRow
                        label="Boas-vindas"
                        description="Enviar e-mail de boas-vindas ao novo usuário após o cadastro"
                    >
                        <Toggle enabled={emailBoasVindas} onChange={setEmailBoasVindas} />
                    </CardRow>
                    <CardRow
                        label="Lembrete de sequência"
                        description="Notificar usuários que ainda não praticaram no dia para manter a sequência"
                    >
                        <Toggle enabled={emailStreak} onChange={setEmailStreak} />
                    </CardRow>
                    <CardRow
                        label="Atualizações de ranking"
                        description="Avisar quando o usuário sobe ou desce de posição no ranking"
                    >
                        <Toggle enabled={emailRanking} onChange={setEmailRanking} />
                    </CardRow>
                    <CardRow
                        label="Novos conteúdos"
                        description="Informar usuários quando novas frases ou categorias forem adicionadas"
                    >
                        <Toggle enabled={emailConteudo} onChange={setEmailConteudo} />
                    </CardRow>
                </CardContainer>

                {/* Sistema */}
                <CardContainer title="Sistema">
                    <CardRow
                        label="Avisos de manutenção"
                        description="Notificar administradores quando o modo de manutenção for ativado ou desativado"
                    >
                        <Toggle enabled={sysManutencao} onChange={setSysManutencao} />
                    </CardRow>
                    <CardRow
                        label="Alertas de segurança"
                        description="Receber alertas sobre acessos suspeitos ou falhas de autenticação"
                    >
                        <Toggle enabled={sysSeguranca} onChange={setSysSeguranca} />
                    </CardRow>
                    <CardRow
                        label="Novo usuário cadastrado"
                        description="Notificar administradores sempre que um novo usuário se registrar"
                    >
                        <Toggle enabled={sysNovoUsuario} onChange={setSysNovoUsuario} />
                    </CardRow>
                </CardContainer>

            </div>
        </AppLayout>
    )
}
