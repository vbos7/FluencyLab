"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/app/_components/ui/dialog"
import { CheckCircle, Volume2, Bell, Eye, Zap, Type, ChevronRight, Sparkles } from "lucide-react"

type FontSize = "normal" | "large"

type Prefs = {
    fontSize: FontSize
    sound: boolean
    notifications: boolean
    colorBlind: boolean
    reduceMotion: boolean
}

const FIRST_LOGIN_KEY = "fluency-lab:firstLogin"

function applyFontSize(size: FontSize) {
    document.documentElement.classList.toggle("font-large", size === "large")
}

function applyColorBlind(enabled: boolean) {
    document.documentElement.classList.toggle("colorblind", enabled)
}

function applyReduceMotion(enabled: boolean) {
    document.documentElement.classList.toggle("reduce-motion", enabled)
}

function saveAllPrefs(prefs: Prefs) {
    localStorage.setItem("fluency-lab:fontSize", prefs.fontSize)
    localStorage.setItem("fluency-lab:sound", String(prefs.sound))
    localStorage.setItem("fluency-lab:notifications", String(prefs.notifications))
    localStorage.setItem("fluency-lab:colorBlind", String(prefs.colorBlind))
    localStorage.setItem("fluency-lab:reduceMotion", String(prefs.reduceMotion))
}

// ── Sub-componentes ─────────────────────────────────────────────────────────

function ToggleRow({
    icon: Icon,
    iconBg,
    iconColor,
    label,
    description,
    value,
    onChange,
}: {
    icon: React.ElementType
    iconBg: string
    iconColor: string
    label: string
    description: string
    value: boolean
    onChange: (v: boolean) => void
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!value)}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
        >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${value ? "text-blue-700" : "text-slate-800"}`}>
                    {label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            </div>
            <span
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors ${
                    value ? "bg-blue-600" : "bg-slate-200"
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        value ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
            </span>
        </button>
    )
}

// ── Preview daltônico ────────────────────────────────────────────────────────

function ColorBlindPreview({ enabled }: { enabled: boolean }) {
    const easy = enabled
        ? { bg: "bg-cyan-100", text: "text-cyan-700", label: "Fácil" }
        : { bg: "bg-green-100", text: "text-green-700", label: "Fácil" }
    const hard = enabled
        ? { bg: "bg-orange-100", text: "text-orange-600", label: "Difícil" }
        : { bg: "bg-red-100", text: "text-red-600", label: "Difícil" }
    const feedback = enabled
        ? { bg: "bg-cyan-50 border-cyan-200", title: "text-cyan-800", sub: "text-cyan-600" }
        : { bg: "bg-green-50 border-green-200", title: "text-green-800", sub: "text-green-600" }

    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Prévia
            </p>
            <div className="flex gap-2 mb-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${easy.bg} ${easy.text}`}>
                    {easy.label}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600">
                    Médio
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${hard.bg} ${hard.text}`}>
                    {hard.label}
                </span>
            </div>
            <div className={`rounded-xl border px-4 py-3 ${feedback.bg}`}>
                <p className={`text-sm font-bold ${feedback.title}`}>Perfeito! 🎉</p>
                <p className={`text-xs ${feedback.sub}`}>Sua tradução está excelente!</p>
            </div>
        </div>
    )
}

// ── Preview redução de movimento ─────────────────────────────────────────────

function MotionPreview({ enabled }: { enabled: boolean }) {

    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Prévia — interaja com os botões
            </p>

            {/* Barra de progresso */}
            <div className="mb-4">
                <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                    <span>Progresso XP</span>
                    <span>65%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                            width: "65%",
                            transition: enabled ? "none" : "width 1.2s ease-out",
                        }}
                    />
                </div>
            </div>

            {/* Botões interativos */}
            <div className="flex gap-2">
                <button
                    type="button"
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white"
                    style={{
                        transition: enabled ? "none" : "transform 0.15s, box-shadow 0.15s, background 0.15s",
                        boxShadow: enabled ? "none" : "0 4px 12px rgba(37,99,235,0.35)",
                    }}
                    onMouseEnter={(e) => {
                        if (enabled) return
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,99,235,0.45)"
                    }}
                    onMouseLeave={(e) => {
                        if (enabled) return
                        e.currentTarget.style.transform = ""
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.35)"
                    }}
                    onMouseDown={(e) => {
                        if (enabled) return
                        e.currentTarget.style.transform = "scale(0.97)"
                    }}
                    onMouseUp={(e) => {
                        if (enabled) return
                        e.currentTarget.style.transform = "translateY(-2px)"
                    }}
                >
                    ✓ Verificar
                </button>
                <button
                    type="button"
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600"
                    style={{
                        transition: enabled ? "none" : "background 0.15s, border-color 0.15s, transform 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        if (enabled) return
                        e.currentTarget.style.background = "#f1f5f9"
                        e.currentTarget.style.transform = "translateY(-2px)"
                    }}
                    onMouseLeave={(e) => {
                        if (enabled) return
                        e.currentTarget.style.background = ""
                        e.currentTarget.style.transform = ""
                    }}
                    onMouseDown={(e) => {
                        if (enabled) return
                        e.currentTarget.style.transform = "scale(0.97)"
                    }}
                    onMouseUp={(e) => {
                        if (enabled) return
                        e.currentTarget.style.transform = "translateY(-2px)"
                    }}
                >
                    → Pular
                </button>
            </div>

            <p className="mt-3 text-center text-[11px] text-slate-400">
                {enabled ? "Animações desativadas — sem movimento" : "Passe o mouse sobre os botões ↑"}
            </p>
        </div>
    )
}

// ── Etapas ──────────────────────────────────────────────────────────────────

type Step = "welcome" | "fontSize" | "sound" | "colorBlind" | "reduceMotion" | "done"
const PROGRESS_STEPS: Step[] = ["fontSize", "sound", "colorBlind", "reduceMotion"]

// ── Dialog principal ────────────────────────────────────────────────────────

export function OnboardingDialog() {
    const [step, setStep] = useState<Step>("welcome")
    const [prefs, setPrefs] = useState<Prefs>({
        fontSize: "normal",
        sound: true,
        notifications: true,
        colorBlind: false,
        reduceMotion: false,
    })

    // Lazy initializer evita setState síncrono em useEffect
    const [open, setOpen] = useState<boolean>(() => {
        if (typeof window === "undefined") return false
        const isFirst = localStorage.getItem(FIRST_LOGIN_KEY) === "true"
        if (isFirst) localStorage.removeItem(FIRST_LOGIN_KEY)
        return isFirst
    })

    function set<K extends keyof Prefs>(key: K, value: Prefs[K]) {
        setPrefs((prev) => ({ ...prev, [key]: value }))
        // Aplica imediatamente no documento
        if (key === "fontSize") applyFontSize(value as FontSize)
        if (key === "colorBlind") applyColorBlind(value as boolean)
        if (key === "reduceMotion") applyReduceMotion(value as boolean)
    }

    function finish() {
        saveAllPrefs(prefs)
        setOpen(false)
    }

    const progressIndex = PROGRESS_STEPS.indexOf(step)

    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent
                className="max-w-md rounded-3xl p-0 sm:rounded-3xl [&>button]:hidden"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                {/* Barra de progresso */}
                {progressIndex >= 0 && (
                    <div className="flex gap-1.5 px-6 pt-6">
                        {PROGRESS_STEPS.map((s, i) => (
                            <div
                                key={s}
                                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                                    i <= progressIndex ? "bg-blue-500" : "bg-slate-200"
                                }`}
                            />
                        ))}
                    </div>
                )}

                <div className="px-6 pb-6 pt-5">

                    {/* ── Boas-vindas ── */}
                    {step === "welcome" && (
                        <div className="flex flex-col items-center py-4 text-center">
                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 shadow-[0_8px_24px_rgba(37,99,235,0.35)]">
                                <Sparkles className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
                                Bem-vindo ao Fluency Lab!
                            </h2>
                            <p className="mb-8 text-sm leading-relaxed text-slate-500">
                                Antes de começar, vamos configurar a plataforma do jeito que você
                                prefere. Leva menos de um minuto. 👇
                            </p>
                            <button
                                onClick={() => setStep("fontSize")}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-colors hover:bg-blue-700 active:scale-95"
                            >
                                Começar configuração
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* ── Tamanho da fonte ── */}
                    {step === "fontSize" && (
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                                    <Type className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                                    Etapa 1 de 4
                                </span>
                            </div>
                            <h2 className="mb-1 text-xl font-extrabold text-slate-900">
                                Tamanho da fonte
                            </h2>
                            <p className="mb-4 text-sm text-slate-500">
                                Clique para ver a diferença em tempo real.
                            </p>

                            <div className="flex gap-3">
                                {(["normal", "large"] as FontSize[]).map((option) => {
                                    const selected = prefs.fontSize === option
                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => set("fontSize", option)}
                                            className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 py-5 transition-all ${
                                                selected
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                        >
                                            <span
                                                className={`font-extrabold leading-none ${
                                                    option === "normal" ? "text-2xl" : "text-4xl"
                                                } ${selected ? "text-blue-600" : "text-slate-700"}`}
                                            >
                                                Aa
                                            </span>
                                            <span className={`text-xs font-semibold ${selected ? "text-blue-600" : "text-slate-500"}`}>
                                                {option === "normal" ? "Normal" : "Grande"}
                                            </span>
                                            {selected && (
                                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                                                    <CheckCircle className="h-3 w-3 text-white" />
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Preview de texto */}
                            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                    Prévia
                                </p>
                                <p className="font-semibold text-slate-800">Pratique inglês todos os dias</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Translate: <span className="font-medium text-blue-600">Eu acordo cedo todo dia</span>
                                </p>
                            </div>

                            <button
                                onClick={() => setStep("sound")}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-colors hover:bg-blue-700 active:scale-95"
                            >
                                Próximo
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* ── Som e notificações ── */}
                    {step === "sound" && (
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                                    <Volume2 className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                                    Etapa 2 de 4
                                </span>
                            </div>
                            <h2 className="mb-1 text-xl font-extrabold text-slate-900">
                                Som e notificações
                            </h2>
                            <p className="mb-5 text-sm text-slate-500">
                                Como você quer ser avisado durante a prática?
                            </p>

                            <div className="flex flex-col gap-3">
                                <ToggleRow
                                    icon={Volume2}
                                    iconBg="bg-blue-50"
                                    iconColor="text-blue-600"
                                    label="Sons de feedback"
                                    description="Toca um som ao verificar respostas certas ou erradas."
                                    value={prefs.sound}
                                    onChange={(v) => set("sound", v)}
                                />
                                <ToggleRow
                                    icon={Bell}
                                    iconBg="bg-violet-50"
                                    iconColor="text-violet-600"
                                    label="Lembretes diários"
                                    description="Receba notificações para manter sua sequência de estudos."
                                    value={prefs.notifications}
                                    onChange={(v) => set("notifications", v)}
                                />
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setStep("fontSize")}
                                    className="flex-1 rounded-2xl border border-slate-200 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 active:scale-95"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={() => setStep("colorBlind")}
                                    className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-colors hover:bg-blue-700 active:scale-95"
                                >
                                    Próximo
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Modo daltônico ── */}
                    {step === "colorBlind" && (
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100">
                                    <Eye className="h-4 w-4 text-cyan-600" />
                                </div>
                                <span className="text-xs font-bold tracking-widest text-cyan-600 uppercase">
                                    Etapa 3 de 4
                                </span>
                            </div>
                            <h2 className="mb-1 text-xl font-extrabold text-slate-900">
                                Modo daltônico
                            </h2>
                            <p className="mb-4 text-sm text-slate-500">
                                Substitui verde→ciano e vermelho→laranja para deuteranopia e protanopia.
                                A prévia abaixo muda em tempo real.
                            </p>

                            <ToggleRow
                                icon={Eye}
                                iconBg="bg-cyan-50"
                                iconColor="text-cyan-600"
                                label="Modo daltônico"
                                description="Ideal para quem tem dificuldade em distinguir verde e vermelho."
                                value={prefs.colorBlind}
                                onChange={(v) => set("colorBlind", v)}
                            />

                            <div className="mt-4">
                                <ColorBlindPreview enabled={prefs.colorBlind} />
                            </div>

                            <div className="mt-5 flex gap-3">
                                <button
                                    onClick={() => setStep("sound")}
                                    className="flex-1 rounded-2xl border border-slate-200 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 active:scale-95"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={() => setStep("reduceMotion")}
                                    className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-colors hover:bg-blue-700 active:scale-95"
                                >
                                    Próximo
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Redução de movimento ── */}
                    {step === "reduceMotion" && (
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
                                    <Zap className="h-4 w-4 text-amber-500" />
                                </div>
                                <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">
                                    Etapa 4 de 4
                                </span>
                            </div>
                            <h2 className="mb-1 text-xl font-extrabold text-slate-900">
                                Redução de movimento
                            </h2>
                            <p className="mb-4 text-sm text-slate-500">
                                Desativa animações e transições. Veja a prévia mudar ao ativar.
                            </p>

                            <ToggleRow
                                icon={Zap}
                                iconBg="bg-amber-50"
                                iconColor="text-amber-500"
                                label="Redução de movimento"
                                description="Para usuários sensíveis a movimento ou que preferem a interface mais estática."
                                value={prefs.reduceMotion}
                                onChange={(v) => set("reduceMotion", v)}
                            />

                            <div className="mt-4">
                                <MotionPreview enabled={prefs.reduceMotion} />
                            </div>

                            <div className="mt-5 flex gap-3">
                                <button
                                    onClick={() => setStep("colorBlind")}
                                    className="flex-1 rounded-2xl border border-slate-200 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 active:scale-95"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={() => setStep("done")}
                                    className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-colors hover:bg-blue-700 active:scale-95"
                                >
                                    Próximo
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Tudo pronto ── */}
                    {step === "done" && (
                        <div className="flex flex-col items-center py-4 text-center">
                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500 shadow-[0_8px_24px_rgba(34,197,94,0.35)]">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
                                Tudo configurado!
                            </h2>
                            <p className="mb-2 text-sm leading-relaxed text-slate-500">
                                Suas preferências foram salvas. Você pode alterá-las a qualquer
                                momento em{" "}
                                <span className="font-semibold text-slate-700">
                                    Perfil → Configurações
                                </span>
                                .
                            </p>

                            <div className="my-5 w-full rounded-2xl bg-slate-50 px-5 py-4 text-left">
                                <p className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                                    Suas preferências
                                </p>
                                <div className="flex flex-col gap-2">
                                    {[
                                        { label: "Tamanho da fonte", value: prefs.fontSize === "large" ? "Grande" : "Normal" },
                                        { label: "Sons de feedback", value: prefs.sound ? "Ativado" : "Desativado" },
                                        { label: "Lembretes diários", value: prefs.notifications ? "Ativado" : "Desativado" },
                                        { label: "Modo daltônico", value: prefs.colorBlind ? "Ativado" : "Desativado" },
                                        { label: "Redução de movimento", value: prefs.reduceMotion ? "Ativado" : "Desativado" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">{label}</span>
                                            <span
                                                className={`text-xs font-semibold ${
                                                    value === "Desativado" || value === "Normal"
                                                        ? "text-slate-400"
                                                        : "text-blue-600"
                                                }`}
                                            >
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={finish}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-colors hover:bg-blue-700 active:scale-95"
                            >
                                Começar a praticar!
                                <Sparkles className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
