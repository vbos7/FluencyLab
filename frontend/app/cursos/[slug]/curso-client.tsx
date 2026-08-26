"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    StickyNote
} from "lucide-react";



type Lesson = {
    id: number;
    title: string;
    duration: number;
    youtube_id: string | null;
    order_num: number;
    is_free: boolean;
    locked: boolean;
};

type CourseDetail = {
    id: number;
    slug: string;
    title: string;
    description: string;
    level: string;
    lessons: Lesson[];
    user_has_premium: boolean;
};

type Comment = { id: number; content: string; user_id: number; user_name: string; created_at: string };
type LoggedUser = { id: number; name: string; email: string; role: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function formatarDuracao(segundos: number) {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg.toString().padStart(2, "0")}`;
}

export default function CursoClient({ course }: { course: CourseDetail }) {
    const [aulaAtiva, setAulaAtiva] = useState(0);
    const [drawerAberto, setDrawer] = useState(false);
    const [comentarios, setComentarios] = useState<Comment[]>([]);
    const [novoComentario, setNovo] = useState("");
    const [carregandoComentarios, setCarregando] = useState(true);
    const [usuarioLogado, setUsuarioLogado] = useState<LoggedUser | null>(null);

    const [aulasConcluidas, setAulasConcluidas] = useState<number[]>([]);
    const [carregandoProgresso, setCarregandoProgresso] = useState(true);

    const [nota, setNota] = useState("");
    const [notaOriginal, setNotaOriginal] = useState("");
    const [carregandoNota, setCarregandoNota] = useState(true);
    const [salvandoNota, setSalvandoNota] = useState(false);

    const aula = course.lessons[aulaAtiva];

    

    // ── Busca o usuário logado ──────────────────────────────────
    useEffect(() => {
        fetch(`${API_URL}/auth/me.php`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setUsuarioLogado(data ?? null))
            .catch(() => setUsuarioLogado(null));
    }, []);

    // ── Busca o progresso do curso (só se estiver logado) ──────
    useEffect(() => {
        if (!usuarioLogado) {
            setCarregandoProgresso(false);
            return;
        }
        fetch(`${API_URL}/progresso.php?course_id=${course.id}`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setAulasConcluidas(data?.completed_lesson_ids ?? []))
            .catch(() => setAulasConcluidas([]))
            .finally(() => setCarregandoProgresso(false));
    }, [usuarioLogado, course.id]);

    // ── Busca os comentários da aula ativa ──────────────────────
    useEffect(() => {
        if (!aula || aula.locked) return;
        setCarregando(true);
        fetch(`${API_URL}/comentarios.php?lesson_id=${aula.id}`)
            .then((res) => res.json())
            .then((data) => setComentarios(data))
            .catch(() => setComentarios([]))
            .finally(() => setCarregando(false));
    }, [aula?.id]);


    // ── Busca as anotações da aula ─────────────────────────────
    useEffect(() => {
    if (!aula || !usuarioLogado) {
        setCarregandoNota(false);
        return;
    }
    setCarregandoNota(true);
    fetch(`${API_URL}/notas.php?lesson_id=${aula.id}`, { credentials: "include" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
            setNota(data?.content ?? "");
            setNotaOriginal(data?.content ?? "");
        })
        .catch(() => {
            setNota("");
            setNotaOriginal("");
        })
        .finally(() => setCarregandoNota(false));
}, [aula?.id, usuarioLogado]);

    async function enviarComentario() {
        if (!novoComentario.trim() || !aula || !usuarioLogado) return;

        const res = await fetch(`${API_URL}/comentarios.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                lesson_id: aula.id,
                content: novoComentario.trim(),
            }),
        });

        if (res.ok) {
            setNovo("");
            const atualizados = await fetch(`${API_URL}/comentarios.php?lesson_id=${aula.id}`).then((r) => r.json());
            setComentarios(atualizados);
        }
    }
    // ── Salva a nota da aula ───────────────────────────────────
    async function salvarNota() {
    if (!aula || !usuarioLogado) return;
    setSalvandoNota(true);

    const res = await fetch(`${API_URL}/notas.php`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: aula.id, content: nota }),
    });

    if (res.ok) {
        setNotaOriginal(nota);
    }
    setSalvandoNota(false);
}

const notaMudou = nota !== notaOriginal;

    // ── Marca/desmarca aula como concluída (atualização otimista) ──
    async function alternarConcluida(lessonId: number) {
        if (!usuarioLogado) return;
        const jaConcluida = aulasConcluidas.includes(lessonId);

        setAulasConcluidas((prev) =>
            jaConcluida ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
        );

        const res = await fetch(
            `${API_URL}/progresso.php${jaConcluida ? `?lesson_id=${lessonId}` : ""}`,
            {
                method: jaConcluida ? "DELETE" : "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: jaConcluida ? undefined : JSON.stringify({ lesson_id: lessonId }),
            }
        );

        if (!res.ok) {
            // desfaz a mudança otimista se a requisição falhar
            setAulasConcluidas((prev) =>
                jaConcluida ? [...prev, lessonId] : prev.filter((id) => id !== lessonId)
            );
        }
    }

    const percentualConcluido =
        course.lessons.length > 0
            ? Math.round((aulasConcluidas.length / course.lessons.length) * 100)
            : 0;

    if (!aula) {
        return (
            
                <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">
                    Este curso ainda não tem aulas cadastradas.
                </div>
            
        );
    }

    return (
        
            <div className="min-h-screen bg-gray-50">
                {/* ── DRAWER MOBILE ── */}
                {drawerAberto && (
                    <div className="fixed inset-0 z-50 flex lg:hidden">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
                        <div className="relative ml-auto w-72 h-full bg-white shadow-xl flex flex-col">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900">Aulas</p>
                                <button onClick={() => setDrawer(false)} className="text-gray-400 hover:text-gray-700 transition">
                                    <X size={18} />
                                </button>
                            </div>

                            {usuarioLogado && !carregandoProgresso && (
                                <div className="px-5 py-3 border-b border-gray-100">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                                        <span>{aulasConcluidas.length} de {course.lessons.length} concluídas</span>
                                        <span className="font-semibold text-blue-600">{percentualConcluido}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${percentualConcluido}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 overflow-y-auto py-2">
                                {course.lessons.map((l, i) => (
                                    <button
                                        key={l.id}
                                        onClick={() => { setAulaAtiva(i); setDrawer(false); }}
                                        className={`w-full text-left px-5 py-3.5 flex items-start gap-3 transition ${aulaAtiva === i ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                    >
                                        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 ${
                                            aulasConcluidas.includes(l.id)
                                                ? "bg-green-500 text-white"
                                                : aulaAtiva === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                                        }`}>
                                            {aulasConcluidas.includes(l.id) ? <CheckCircle2 size={13} /> : i + 1}
                                        </span>
                                        <div>
                                            <p className={`text-sm font-medium leading-snug flex items-center gap-1.5 ${aulaAtiva === i ? "text-blue-700" : "text-gray-800"}`}>
                                                {l.title}
                                                {l.locked && <Lock size={11} className="text-gray-400 shrink-0" />}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock size={10} /> {formatarDuracao(l.duration)}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* ── HEADER ── */}
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/cursos" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition">
                            <ArrowLeft size={15} /> Voltar para cursos
                        </Link>
                        <button onClick={() => setDrawer(true)} className="lg:hidden inline-flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition">
                            <BookOpen size={14} /> Aulas
                        </button>
                    </div>

                    <div className="flex gap-6 items-start">
                        {/* ── SIDEBAR DESKTOP ── */}
                        <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-white rounded-2xl border border-[#dce8ff] shadow-[0_2px_16px_rgba(37,99,235,0.08)] overflow-hidden sticky top-6">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900">{course.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{course.lessons.length} aulas disponíveis</p>

                                {usuarioLogado && !carregandoProgresso && (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                                            <span>{aulasConcluidas.length} de {course.lessons.length} concluídas</span>
                                            <span className="font-semibold text-blue-600">{percentualConcluido}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
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
                                        className={`w-full text-left px-5 py-3.5 flex items-start gap-3 transition ${aulaAtiva === i ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                    >
                                        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 ${
                                            aulasConcluidas.includes(l.id)
                                                ? "bg-green-500 text-white"
                                                : aulaAtiva === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                                        }`}>
                                            {aulasConcluidas.includes(l.id) ? <CheckCircle2 size={13} /> : i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium leading-snug flex items-center gap-1.5 ${aulaAtiva === i ? "text-blue-700" : "text-gray-800"}`}>
                                                <span className="truncate">{l.title}</span>
                                                {l.locked && <Lock size={11} className="text-gray-400 shrink-0" />}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock size={10} /> {formatarDuracao(l.duration)}</p>
                                        </div>
                                        {aulaAtiva === i && <ChevronRight size={14} className="text-blue-400 shrink-0 mt-1" />}
                                    </button>
                                ))}
                            </div>
                        </aside>

                        {/* ── CONTEÚDO DIREITO ── */}
                        <div className="flex-1 min-w-0 flex flex-col gap-5">
                            <div className="bg-white rounded-2xl border border-[#dce8ff] shadow-[0_2px_16px_rgba(37,99,235,0.08)] overflow-hidden">
                                {aula.locked ? (
                                    // ── PAYWALL no lugar do vídeo ──
                                    <div className="aspect-video w-full bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
                                            <Lock size={26} className="text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-base font-semibold text-gray-900">Aula exclusiva para assinantes Pro</p>
                                            <p className="text-sm text-gray-500 mt-1 max-w-xs">
                                                Libere esta e todas as demais aulas com o plano Pro.
                                            </p>
                                        </div>
                                        <Link
                                            href="/planos"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
                                        >
                                            <Crown size={15} />
                                            Assinar plano Pro
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="aspect-video w-full bg-gray-100">
                                        <iframe key={aula.id} className="w-full h-full" src={`https://www.youtube.com/embed/${aula.youtube_id}`} title={aula.title} allowFullScreen />
                                    </div>
                                )}

                                <div className="px-5 py-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                                            {aula.title}
                                            {aula.locked && <Lock size={12} className="text-gray-400" />}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock size={10} /> {formatarDuracao(aula.duration)}</p>
                                    </div>
                                    <span className="text-xs bg-green-50 text-green-600 border border-green-100 px-2.5 py-1 rounded-full font-medium">Aula {aulaAtiva + 1}</span>
                                </div>

                                {/* Botão marcar como concluída */}
                                {!aula.locked && usuarioLogado && (
                                    <div className="px-5 pb-3">
                                        <button
                                            onClick={() => alternarConcluida(aula.id)}
                                            className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition ${
                                                aulasConcluidas.includes(aula.id)
                                                    ? "bg-green-50 text-green-700 border border-green-200"
                                                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                            }`}
                                        >
                                            <CheckCircle2 size={15} />
                                            {aulasConcluidas.includes(aula.id) ? "Aula concluída" : "Marcar como concluída"}
                                        </button>
                                    </div>
                                )}

                                {/* Navegação entre aulas */}
                                <div className="px-5 pb-4 flex items-center justify-between gap-3">
                                    <button onClick={() => setAulaAtiva((p) => Math.max(0, p - 1))} disabled={aulaAtiva === 0} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">← Anterior</button>
                                    <button onClick={() => setAulaAtiva((p) => Math.min(course.lessons.length - 1, p + 1))} disabled={aulaAtiva === course.lessons.length - 1} className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition">Próxima →</button>
                                </div>
                            </div>

                            {!aula.locked && usuarioLogado && (
    <div className="bg-white rounded-2xl border border-[#dce8ff] shadow-[0_2px_16px_rgba(37,99,235,0.08)] px-5 py-5">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <StickyNote size={16} className="text-amber-500" />
                <p className="text-sm font-semibold text-gray-900">Minhas anotações</p>
            </div>
            {notaMudou && (
                <button
                    onClick={salvarNota}
                    disabled={salvandoNota}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 transition"
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
                className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 transition resize-none placeholder:text-gray-400"
            />
        )}
    </div>
)}

                            {/* ── COMENTÁRIOS ── */}
                            {!aula.locked && (
                                <div className="bg-white rounded-2xl border border-[#dce8ff] shadow-[0_2px_16px_rgba(37,99,235,0.08)] px-5 py-5">
                                    <div className="flex items-center gap-2 mb-5">
                                        <MessageCircle size={16} className="text-blue-500" />
                                        <p className="text-sm font-semibold text-gray-900">
                                            Comentários <span className="text-gray-400 font-normal">({comentarios.length})</span>
                                        </p>
                                    </div>

                                    <div className="flex gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                                            {usuarioLogado ? usuarioLogado.name.slice(0, 2).toUpperCase() : "?"}
                                        </div>
                                        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition">
                                            <input
                                                type="text"
                                                value={novoComentario}
                                                onChange={(e) => setNovo(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && enviarComentario()}
                                                placeholder={usuarioLogado ? "Deixe um comentário sobre esta aula..." : "Faça login para comentar"}
                                                disabled={!usuarioLogado}
                                                className="flex-1 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-400 disabled:cursor-not-allowed"
                                            />
                                            <button onClick={enviarComentario} disabled={!novoComentario.trim()} className="text-blue-500 hover:text-blue-700 disabled:opacity-30 transition">
                                                <Send size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {carregandoComentarios && <p className="text-sm text-gray-400">Carregando comentários...</p>}
                                        {!carregandoComentarios && comentarios.length === 0 && <p className="text-sm text-gray-400">Seja o primeiro a comentar nessa aula.</p>}
                                        {comentarios.map((c) => (
                                            <div key={c.id} className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold shrink-0">
                                                    {c.user_name?.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-xs font-semibold text-gray-900">{c.user_name}</p>
                                                        <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("pt-BR")}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
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
    );
}