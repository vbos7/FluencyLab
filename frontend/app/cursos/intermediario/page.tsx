"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, ChevronRight, X, MessageCircle, Send } from "lucide-react";
import NavLayout from "@/app/_layouts/nav-layout";

const aulas = [
  { titulo: "Aula 1 — Verbo to Be",        duracao: "8:08",  youtubeId: "YOUTUBE_ID_AQUI" },
  { titulo: "Aula 2 — Números e cores",            duracao: "10:10", youtubeId: "YOUTUBE_ID_AQUI" },
  { titulo: "Aula 3 — Dias da semana e meses",     duracao: "9:05",  youtubeId: "YOUTUBE_ID_AQUI" },
];

const comentariosIniciais = [
  { nome: "Lucas M.",  inicial: "LM", cor: "bg-blue-100 text-blue-700",   texto: "Aula incrível! Finalmente entendi a pronúncia do alfabeto direitinho.", tempo: "2 dias atrás" },
  { nome: "Ana Paula", inicial: "AP", cor: "bg-green-100 text-green-700", texto: "Muito boa explicação, bem didática e no ritmo certo.", tempo: "5 dias atrás" },
  { nome: "Carlos J.", inicial: "CJ", cor: "bg-purple-100 text-purple-700", texto: "Revisando o básico antes de ir pro intermediário. Recomendo!", tempo: "1 semana atrás" },
];

export default function BasicoPage() {
  const [aulaAtiva, setAulaAtiva]     = useState(0);
  const [drawerAberto, setDrawer]     = useState(false);
  const [comentarios, setComentarios] = useState(comentariosIniciais);
  const [novoComentario, setNovo]     = useState("");

  function enviarComentario() {
    if (!novoComentario.trim()) return;
    setComentarios([
      {
        nome: "Você",
        inicial: "VC",
        cor: "bg-blue-100 text-blue-700",
        texto: novoComentario.trim(),
        tempo: "agora",
      },
      ...comentarios,
    ]);
    setNovo("");
  }

  const aula = aulas[aulaAtiva];

  return (
    <NavLayout>
      <div className="min-h-screen bg-gray-50">

        {/* ── DRAWER MOBILE ── */}
        {drawerAberto && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Overlay escuro */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setDrawer(false)}
            />
            {/* Gaveta */}
            <div className="relative ml-auto w-72 h-full bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Aulas</p>
                <button onClick={() => setDrawer(false)} className="text-gray-400 hover:text-gray-700 transition">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {aulas.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => { setAulaAtiva(i); setDrawer(false); }}
                    className={`w-full text-left px-5 py-3.5 flex items-start gap-3 transition ${
                      aulaAtiva === i ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 ${
                      aulaAtiva === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-medium leading-snug ${aulaAtiva === i ? "text-blue-700" : "text-gray-800"}`}>
                        {a.titulo}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock size={10} /> {a.duracao}
                      </p>
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
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition"
            >
              <ArrowLeft size={15} />
              Voltar para cursos
            </Link>

            {/* Botão drawer só no mobile */}
            <button
              onClick={() => setDrawer(true)}
              className="lg:hidden inline-flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition"
            >
              <BookOpen size={14} />
              Aulas
            </button>
          </div>

          {/* ── LAYOUT PRINCIPAL ── */}
          <div className="flex gap-6 items-start">

            {/* ── SIDEBAR DESKTOP ── */}
            <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-white rounded-2xl border border-[#dce8ff] shadow-[0_2px_16px_rgba(37,99,235,0.08)] overflow-hidden sticky top-6">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Nível Intermediario</p>
                <p className="text-xs text-gray-400 mt-0.5">{aulas.length} aulas disponíveis</p>
              </div>
              <div className="flex-1 py-2">
                {aulas.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => setAulaAtiva(i)}
                    className={`w-full text-left px-5 py-3.5 flex items-start gap-3 transition ${
                      aulaAtiva === i ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 ${
                      aulaAtiva === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-snug ${aulaAtiva === i ? "text-blue-700" : "text-gray-800"}`}>
                        {a.titulo}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock size={10} /> {a.duracao}
                      </p>
                    </div>
                    {aulaAtiva === i && (
                      <ChevronRight size={14} className="text-blue-400 shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </aside>

            {/* ── CONTEÚDO DIREITO ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Card do vídeo */}
              <div className="bg-white rounded-2xl border border-[#dce8ff] shadow-[0_2px_16px_rgba(37,99,235,0.08)] overflow-hidden">
                <div className="aspect-video w-full bg-gray-100">
                  <iframe
                    key={aulaAtiva}
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${aula.youtubeId}`}
                    title={aula.titulo}
                    allowFullScreen
                  />
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{aula.titulo}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {aula.duracao}
                    </p>
                  </div>
                  <span className="text-xs bg-green-50 text-green-600 border border-green-100 px-2.5 py-1 rounded-full font-medium">
                    Aula {aulaAtiva + 1}
                  </span>
                </div>

                {/* Navegação entre aulas */}
                <div className="px-5 pb-4 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setAulaAtiva((p) => Math.max(0, p - 1))}
                    disabled={aulaAtiva === 0}
                    className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ← Anterior
                  </button>
                  <button
                    onClick={() => setAulaAtiva((p) => Math.min(aulas.length - 1, p + 1))}
                    disabled={aulaAtiva === aulas.length - 1}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Próxima →
                  </button>
                </div>
              </div>

              {/* ── COMENTÁRIOS ── */}
              <div className="bg-white rounded-2xl border border-[#dce8ff] shadow-[0_2px_16px_rgba(37,99,235,0.08)] px-5 py-5">
                <div className="flex items-center gap-2 mb-5">
                  <MessageCircle size={16} className="text-blue-500" />
                  <p className="text-sm font-semibold text-gray-900">
                    Comentários <span className="text-gray-400 font-normal">({comentarios.length})</span>
                  </p>
                </div>

                {/* Input novo comentário */}
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                    VC
                  </div>
                  <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition">
                    <input
                      type="text"
                      value={novoComentario}
                      onChange={(e) => setNovo(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && enviarComentario()}
                      placeholder="Deixe um comentário sobre esta aula..."
                      className="flex-1 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-400"
                    />
                    <button
                      onClick={enviarComentario}
                      disabled={!novoComentario.trim()}
                      className="text-blue-500 hover:text-blue-700 disabled:opacity-30 transition"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>

                {/* Lista de comentários */}
                <div className="flex flex-col gap-4">
                  {comentarios.map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${c.cor}`}>
                        {c.inicial}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-semibold text-gray-900">{c.nome}</p>
                          <p className="text-xs text-gray-400">{c.tempo}</p>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{c.texto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </NavLayout>
  );
}