"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    BookOpen,
    Clock,
    ChevronRight,
    X,
    MessageCircle,
    Send,
    Lock,
    Crown,
    CheckCircle2,
    StickyNote,
} from "lucide-react"
import { type CourseDetail, type Comment } from "@/app/_lib/courses"
import { type LoggedUser } from "@/app/_lib/user"

const API_URL = process.env.NEXT_PUBLIC_API_URL

function formatarDuracao(segundos: number) {
    const min = Math.floor(segundos / 60)
    const seg = segundos % 60
    return `${min}:${seg.toString().padStart(2, "0")}`
}

export default function CursoClient({ course }: { course: CourseDetail }) {
    const [aulaAtiva, setAulaAtiva] = useState(0)
    const [drawerAberto, setDrawer] = useState(false)
    // Comentários guardados junto do id da aula a que pertencem: assim o "carregando"
    // vira estado derivado (some a necessidade de setState síncrono no efeito).
    const [comentariosState, setComentariosState] = useState<{
        lessonId: number | null
        items: Comment[]
    }>({
        lessonId: null,
        items: [],
    })
    const [novoComentario, setNovo] = useState("")
    const [usuarioLogado, setUsuarioLogado] = useState<LoggedUser | null>(null)

    const [aulasConcluidas, setAulasConcluidas] = useState<number[]>([])
    const [carregandoProgresso, setCarregandoProgresso] = useState(true)

    const [nota, setNota] = useState("")
    const [notaOriginal, setNotaOriginal] = useState("")
    // Mesma ideia dos comentários: guardamos a aula cuja nota foi carregada para
    // derivar o "carregando" sem setState síncrono.
    const [notaLessonId, setNotaLessonId] = useState<number | null>(null)
    const [salvandoNota, setSalvandoNota] = useState(false)

    const aula = course.lessons[aulaAtiva]

    // Comentários da aula ativa (e seu "carregando") derivados do estado acima.
    const comentarios = comentariosState.lessonId === aula?.id ? comentariosState.items : []
    const carregandoComentarios = !!aula && !aula.locked && comentariosState.lessonId !== aula.id
    const carregandoNota = !!aula && !!usuarioLogado && notaLessonId !== aula.id

    // ── Busca o usuário logado ──────────────────────────────────
    useEffect(() => {
        fetch(`${API_URL}/auth/me.php`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setUsuarioLogado(data ?? null))
            .catch(() => setUsuarioLogado(null))
    }, [])

    // ── Busca o progresso do curso (só se estiver logado) ──────
    // Sem login o bloco de progresso nem é renderizado (guardado por `usuarioLogado`),
    // então não precisamos zerar o "carregando" à mão aqui.
    useEffect(() => {
        if (!usuarioLogado) return
        let ignore = false
        fetch(`${API_URL}/progresso.php?course_id=${course.id}`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!ignore) setAulasConcluidas(data?.completed_lesson_ids ?? [])
            })
            .catch(() => {
                if (!ignore) setAulasConcluidas([])
            })
            .finally(() => {
                if (!ignore) setCarregandoProgresso(false)
            })
        return () => {
            ignore = true
        }
    }, [usuarioLogado, course.id])

    // ── Busca os comentários da aula ativa ──────────────────────
    // O "carregando" é derivado (ver acima); aqui só gravamos o resultado com o id
    // da aula, sem setState síncrono.
    useEffect(() => {
        if (!aula || aula.locked) return
        let ignore = false
        fetch(`${API_URL}/comentarios.php?lesson_id=${aula.id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!ignore) setComentariosState({ lessonId: aula.id, items: data })
            })
            .catch(() => {
                if (!ignore) setComentariosState({ lessonId: aula.id, items: [] })
            })
        return () => {
            ignore = true
        }
    }, [aula])

    // ── Busca as anotações da aula ─────────────────────────────
    // O "carregando" é derivado de `notaLessonId`; aqui só gravamos o conteúdo e
    // marcamos a aula carregada, sem setState síncrono.
    useEffect(() => {
        if (!aula || !usuarioLogado) return
        let ignore = false
        fetch(`${API_URL}/notas.php?lesson_id=${aula.id}`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (ignore) return
                setNota(data?.content ?? "")
                setNotaOriginal(data?.content ?? "")
                setNotaLessonId(aula.id)
            })
            .catch(() => {
                if (ignore) return
                setNota("")
                setNotaOriginal("")
                setNotaLessonId(aula.id)
            })
        return () => {
            ignore = true
        }
    }, [aula, usuarioLogado])

    async function enviarComentario() {
        if (!novoComentario.trim() || !aula || !usuarioLogado) return

        const res = await fetch(`${API_URL}/comentarios.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                lesson_id: aula.id,
                content: novoComentario.trim(),
            }),
        })

        if (res.ok) {
            setNovo("")
            const atualizados = await fetch(`${API_URL}/comentarios.php?lesson_id=${aula.id}`).then(
                (r) => r.json()
            )
            setComentariosState({ lessonId: aula.id, items: atualizados })
        }
    }
    // ── Salva a nota da aula ───────────────────────────────────
    async function salvarNota() {
        if (!aula || !usuarioLogado) return
        setSalvandoNota(true)

        const res = await fetch(`${API_URL}/notas.php`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lesson_id: aula.id, content: nota }),
        })

        if (res.ok) {
            setNotaOriginal(nota)
        }
        setSalvandoNota(false)
    }

    const notaMudou = nota !== notaOriginal

    // ── Marca/desmarca aula como concluída (atualização otimista) ──
    async function alternarConcluida(lessonId: number) {
        if (!usuarioLogado) return
        const jaConcluida = aulasConcluidas.includes(lessonId)

        setAulasConcluidas((prev) =>
            jaConcluida ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
        )

        const res = await fetch(
            `${API_URL}/progresso.php${jaConcluida ? `?lesson_id=${lessonId}` : ""}`,
            {
                method: jaConcluida ? "DELETE" : "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: jaConcluida ? undefined : JSON.stringify({ lesson_id: lessonId }),
            }
        )

        if (!res.ok) {
            // desfaz a mudança otimista se a requisição falhar
            setAulasConcluidas((prev) =>
                jaConcluida ? [...prev, lessonId] : prev.filter((id) => id !== lessonId)
            )
        }
    }

    const percentualConcluido =
        course.lessons.length > 0
            ? Math.round((aulasConcluidas.length / course.lessons.length) * 100)
            : 0

    if (!aula) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-500">
                Este curso ainda não tem aulas cadastradas.
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── DRAWER MOBILE ── */}
            {drawerAberto && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setDrawer(false)}
                    />
                    <div className="relative ml-auto flex h-full w-72 flex-col bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <p className="text-sm font-semibold text-gray-900">Aulas</p>
                            <button
                                onClick={() => setDrawer(false)}
                                className="text-gray-400 transition hover:text-gray-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {usuarioLogado && !carregandoProgresso && (
                            <div className="border-b border-gray-100 px-5 py-3">
                                <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                        {aulasConcluidas.length} de {course.lessons.length}{" "}
                                        concluídas
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                        {percentualConcluido}%
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                        style={{ width: `${percentualConcluido}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto py-2">
                            {course.lessons.map((l, i) => (
                                <button
                                    key={l.id}
                                    onClick={() => {
                                        setAulaAtiva(i)
                                        setDrawer(false)
                                    }}
                                    className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition ${aulaAtiva === i ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                >
                                    <span
                                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                                            aulasConcluidas.includes(l.id)
                                                ? "bg-green-500 text-white"
                                                : aulaAtiva === i
                                                  ? "bg-blue-600 text-white"
                                                  : "bg-gray-100 text-gray-500"
                                        }`}
                                    >
                                        {aulasConcluidas.includes(l.id) ? (
                                            <CheckCircle2 size={13} />
                                        ) : (
                                            i + 1
                                        )}
                                    </span>
                                    <div>
                                        <p
                                            className={`flex items-center gap-1.5 text-sm leading-snug font-medium ${aulaAtiva === i ? "text-blue-700" : "text-gray-800"}`}
                                        >
                                            {l.title}
                                            {l.locked && (
                                                <Lock
                                                    size={11}
                                                    className="shrink-0 text-gray-400"
                                                />
                                            )}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                            <Clock size={10} /> {formatarDuracao(l.duration)}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* ── HEADER ── */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/cursos"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-gray-700"
                    >
                        <ArrowLeft size={15} /> Voltar para cursos
                    </Link>
                    <button
                        onClick={() => setDrawer(true)}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100 lg:hidden"
                    >
                        <BookOpen size={14} /> Aulas
                    </button>
                </div>

                <div className="flex items-start gap-6">
                    {/* ── SIDEBAR DESKTOP ── */}
                    <aside className="sticky top-6 hidden w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#dce8ff] bg-white shadow-[0_2px_16px_rgba(37,99,235,0.08)] lg:flex">
                        <div className="border-b border-gray-100 px-5 py-4">
                            <p className="text-sm font-semibold text-gray-900">{course.title}</p>
                            <p className="mt-0.5 text-xs text-gray-400">
                                {course.lessons.length} aulas disponíveis
                            </p>

                            {usuarioLogado && !carregandoProgresso && (
                                <div className="mt-3">
                                    <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                                        <span>
                                            {aulasConcluidas.length} de {course.lessons.length}{" "}
                                            concluídas
                                        </span>
                                        <span className="font-semibold text-blue-600">
                                            {percentualConcluido}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                            style={{ width: `${percentualConcluido}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 py-2">
                            {course.lessons.map((l, i) => (
                                <button
                                    key={l.id}
                                    onClick={() => setAulaAtiva(i)}
                                    className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition ${aulaAtiva === i ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                >
                                    <span
                                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                                            aulasConcluidas.includes(l.id)
                                                ? "bg-green-500 text-white"
                                                : aulaAtiva === i
                                                  ? "bg-blue-600 text-white"
                                                  : "bg-gray-100 text-gray-500"
                                        }`}
                                    >
                                        {aulasConcluidas.includes(l.id) ? (
                                            <CheckCircle2 size={13} />
                                        ) : (
                                            i + 1
                                        )}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={`flex items-center gap-1.5 text-sm leading-snug font-medium ${aulaAtiva === i ? "text-blue-700" : "text-gray-800"}`}
                                        >
                                            <span className="truncate">{l.title}</span>
                                            {l.locked && (
                                                <Lock
                                                    size={11}
                                                    className="shrink-0 text-gray-400"
                                                />
                                            )}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                            <Clock size={10} /> {formatarDuracao(l.duration)}
                                        </p>
                                    </div>
                                    {aulaAtiva === i && (
                                        <ChevronRight
                                            size={14}
                                            className="mt-1 shrink-0 text-blue-400"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* ── CONTEÚDO DIREITO ── */}
                    <div className="flex min-w-0 flex-1 flex-col gap-5">
                        <div className="overflow-hidden rounded-2xl border border-[#dce8ff] bg-white shadow-[0_2px_16px_rgba(37,99,235,0.08)]">
                            {aula.locked ? (
                                // ── PAYWALL no lugar do vídeo ──
                                <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50 to-indigo-50 px-6 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md">
                                        <Lock size={26} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-gray-900">
                                            Aula exclusiva para assinantes Pro
                                        </p>
                                        <p className="mt-1 max-w-xs text-sm text-gray-500">
                                            Libere esta e todas as demais aulas com o plano Pro.
                                        </p>
                                    </div>
                                    <Link
                                        href="/planos"
                                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        <Crown size={15} />
                                        Assinar plano Pro
                                    </Link>
                                </div>
                            ) : (
                                <div className="aspect-video w-full bg-gray-100">
                                    <iframe
                                        key={aula.id}
                                        className="h-full w-full"
                                        src={`https://www.youtube.com/embed/${aula.youtube_id}`}
                                        title={aula.title}
                                        allowFullScreen
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between px-5 py-4">
                                <div>
                                    <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                                        {aula.title}
                                        {aula.locked && (
                                            <Lock size={12} className="text-gray-400" />
                                        )}
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                        <Clock size={10} /> {formatarDuracao(aula.duration)}
                                    </p>
                                </div>
                                <span className="rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                                    Aula {aulaAtiva + 1}
                                </span>
                            </div>

                            {/* Botão marcar como concluída */}
                            {!aula.locked && usuarioLogado && (
                                <div className="px-5 pb-3">
                                    <button
                                        onClick={() => alternarConcluida(aula.id)}
                                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
                                            aulasConcluidas.includes(aula.id)
                                                ? "border border-green-200 bg-green-50 text-green-700"
                                                : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <CheckCircle2 size={15} />
                                        {aulasConcluidas.includes(aula.id)
                                            ? "Aula concluída"
                                            : "Marcar como concluída"}
                                    </button>
                                </div>
                            )}

                            {/* Navegação entre aulas */}
                            <div className="flex items-center justify-between gap-3 px-5 pb-4">
                                <button
                                    onClick={() => setAulaAtiva((p) => Math.max(0, p - 1))}
                                    disabled={aulaAtiva === 0}
                                    className="flex-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ← Anterior
                                </button>
                                <button
                                    onClick={() =>
                                        setAulaAtiva((p) =>
                                            Math.min(course.lessons.length - 1, p + 1)
                                        )
                                    }
                                    disabled={aulaAtiva === course.lessons.length - 1}
                                    className="flex-1 rounded-xl bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Próxima →
                                </button>
                            </div>
                        </div>

                        {!aula.locked && usuarioLogado && (
                            <div className="rounded-2xl border border-[#dce8ff] bg-white px-5 py-5 shadow-[0_2px_16px_rgba(37,99,235,0.08)]">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <StickyNote size={16} className="text-amber-500" />
                                        <p className="text-sm font-semibold text-gray-900">
                                            Minhas anotações
                                        </p>
                                    </div>
                                    {notaMudou && (
                                        <button
                                            onClick={salvarNota}
                                            disabled={salvandoNota}
                                            className="text-xs font-medium text-blue-600 transition hover:text-blue-700 disabled:opacity-50"
                                        >
                                            {salvandoNota ? "Salvando..." : "Salvar"}
                                        </button>
                                    )}
                                </div>

                                {carregandoNota ? (
                                    <p className="text-sm text-gray-400">Carregando...</p>
                                ) : (
                                    <textarea
                                        value={nota}
                                        onChange={(e) => setNota(e.target.value)}
                                        placeholder="Escreva aqui vocabulário novo, dúvidas ou o que achou importante nesta aula..."
                                        rows={4}
                                        className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition outline-none placeholder:text-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-50"
                                    />
                                )}
                            </div>
                        )}

                        {/* ── COMENTÁRIOS ── */}
                        {!aula.locked && (
                            <div className="rounded-2xl border border-[#dce8ff] bg-white px-5 py-5 shadow-[0_2px_16px_rgba(37,99,235,0.08)]">
                                <div className="mb-5 flex items-center gap-2">
                                    <MessageCircle size={16} className="text-blue-500" />
                                    <p className="text-sm font-semibold text-gray-900">
                                        Comentários{" "}
                                        <span className="font-normal text-gray-400">
                                            ({comentarios.length})
                                        </span>
                                    </p>
                                </div>

                                <div className="mb-6 flex gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                        {usuarioLogado
                                            ? usuarioLogado.name.slice(0, 2).toUpperCase()
                                            : "?"}
                                    </div>
                                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50">
                                        <input
                                            type="text"
                                            value={novoComentario}
                                            onChange={(e) => setNovo(e.target.value)}
                                            onKeyDown={(e) =>
                                                e.key === "Enter" && enviarComentario()
                                            }
                                            placeholder={
                                                usuarioLogado
                                                    ? "Deixe um comentário sobre esta aula..."
                                                    : "Faça login para comentar"
                                            }
                                            disabled={!usuarioLogado}
                                            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            onClick={enviarComentario}
                                            disabled={!novoComentario.trim()}
                                            className="text-blue-500 transition hover:text-blue-700 disabled:opacity-30"
                                        >
                                            <Send size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {carregandoComentarios && (
                                        <p className="text-sm text-gray-400">
                                            Carregando comentários...
                                        </p>
                                    )}
                                    {!carregandoComentarios && comentarios.length === 0 && (
                                        <p className="text-sm text-gray-400">
                                            Seja o primeiro a comentar nessa aula.
                                        </p>
                                    )}
                                    {comentarios.map((c) => (
                                        <div key={c.id} className="flex gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                                                {c.user_name?.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <p className="text-xs font-semibold text-gray-900">
                                                        {c.user_name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(c.created_at).toLocaleDateString(
                                                            "pt-BR"
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="text-sm leading-relaxed text-gray-600">
                                                    {c.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
