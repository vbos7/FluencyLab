"use client";

import { useState, useEffect, useRef } from "react";

const PAIRS = [
  { pt: "Eu gosto de aprender idiomas.", en: "I like to learn languages." },
  { pt: "Onde fica a estação de metrô?", en: "Where is the subway station?" },
  { pt: "Ela trabalha todos os dias.", en: "She works every day." },
  { pt: "Você fala inglês?", en: "Do you speak English?" },
  { pt: "Preciso de ajuda, por favor.", en: "I need help, please." },
];

function useTyping() {
  const [ptText, setPtText] = useState(PAIRS[0].pt);
  const [enText, setEnText] = useState("");
  const ref = useRef({ ci: 0, typing: true, pi: 0 });

  useEffect(() => {
    let t: NodeJS.Timeout;
    const tick = () => {
      const s = ref.current;
      const pair = PAIRS[s.pi];
      if (s.typing) {
        if (s.ci <= pair.en.length) {
          setEnText(pair.en.slice(0, s.ci++));
          t = setTimeout(tick, 52);
        } else {
          s.typing = false;
          t = setTimeout(tick, 2000);
        }
      } else {
        if (s.ci > 0) {
          setEnText(pair.en.slice(0, --s.ci));
          t = setTimeout(tick, 26);
        } else {
          s.pi = (s.pi + 1) % PAIRS.length;
          setPtText(PAIRS[s.pi].pt);
          s.typing = true;
          t = setTimeout(tick, 380);
        }
      }
    };
    t = setTimeout(tick, 1400);
    return () => clearTimeout(t);
  }, []);

  return { ptText, enText };
}

function MicIcon() {
  return (
    <svg className="p-3 text-white"
      fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  );
}

const STEPS = [
  { n: "1", bold: "Receba uma frase", rest: " em português na tela" },
  { n: "2", bold: "Escreva a tradução", rest: " para o inglês no campo" },
  { n: "3", bold: "Receba feedback", rest: " e veja a resposta correta" },
];

export default function FluencyLabHome() {
  const { ptText, enText } = useTyping();

  const fadeUp = (delay: number) => `anim-${Math.ceil(delay / 100)}`;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(250%); }
        }
        @keyframes spinSlow   { to { transform: rotate(360deg); } }
        @keyframes spinReverse { to { transform: rotate(-360deg); } }

        .anim-1 { animation: fadeUp .5s  .10s ease both; }
        .anim-2 { animation: fadeUp .55s .25s ease both; }
        .anim-3 { animation: fadeUp .6s  .38s ease both; }
        .anim-4 { animation: fadeUp .65s .65s cubic-bezier(.34,1.3,.64,1) both; }
        .anim-5 { animation: fadeUp .55s .95s ease both; }
        .anim-6 { animation: fadeUp .65s 1.15s cubic-bezier(.34,1.3,.64,1) both; }
        .anim-7 { animation: fadeUp .5s  1.35s ease both; }

        .ring-cw  { animation: spinSlow    22s linear infinite; }
        .ring-ccw { animation: spinReverse 14s linear infinite; }
        .shimmer-bar { animation: shimmer 3.2s 2s infinite; }
      `}</style>

      {/* ── PAGE WRAPPER ── */}
      <div className="min-h-screen w-full bg-blue-100 flex flex-col">

        {/* ── HERO ── */}
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 overflow-hidden
                        px-4 sm:px-8 md:px-16 lg:px-24
                        pt-10 pb-16
                        sm:pt-14 sm:pb-20
                        md:pt-16 md:pb-24">

          {/* Dot grid */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          {/* Rings */}
          <div className="ring-cw absolute rounded-full border border-white/10"
            style={{ width: 260, height: 260, top: -110, right: -100 }} />
          <div className="ring-ccw absolute rounded-full border border-white/10"
            style={{ width: 160, height: 160, top: -50, right: -50 }} />

          {/* Inner content max-width */}
          <div className="relative z-10 max-w-2xl mx-auto">

            {/* Badge */}
            <div className="anim-1 inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full
                            px-3 py-1 mb-5 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse shadow-[0_0_6px_#93C5FD]" />
              <span className="text-white text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
                Português → Inglês
              </span>
            </div>

            {/* Logo */}
            <div className="anim-2 flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center
                              rounded-xl bg-white/15 border border-white/30">
                <MicIcon />
              </div>
              <div>
                <p className="text-white font-extrabold text-lg sm:text-2xl tracking-tight leading-none">
                  Fluency Lab
                </p>
              </div>
            </div>

            {/* Headline */}
            <div className="anim-3">
              <h1 className="text-white font-extrabold leading-snug tracking-tight mb-3
                             text-2xl sm:text-3xl md:text-4xl">
                Pratique inglês<br />
                traduzindo de
                verdade
              </h1>
              <p className="text-white/70 leading-relaxed max-w-sm
                            text-sm sm:text-base">
                Receba frases em português e escreva a tradução em inglês —
                Usando um sistema de Competição com seus amigos.
              </p>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col
                        px-4 sm:px-8 md:px-0
                        pb-6 sm:pb-10">

          {/* Demo card — overlaps hero */}
          <div className="anim-4 -mt-8 sm:-mt-12 flex-shrink-0
                          bg-white rounded-2xl border border-blue-50
                          shadow-[0_6px_32px_rgba(18,73,199,0.13)]
                          px-4 sm:px-5 pt-4 pb-3">

            <p className="text-[9.5px] sm:text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">
              ✦ Veja como funciona
            </p>

            <div className="flex flex-col gap-2">
              {/* PT */}
              <div className="rounded-xl px-3 py-2.5 bg-blue-50 border border-blue-200">
                <p className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">
                  🇧🇷 Frase em Português
                </p>
                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {ptText}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                <div className="w-6 h-6 flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center
                                shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
              </div>

              {/* EN */}
              <div className="rounded-xl px-3 py-2.5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300">
                <p className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-blue-500 mb-1">
                  🇺🇸 Sua tradução em Inglês
                </p>
                <p className="text-sm sm:text-base font-semibold text-blue-800 leading-snug">
                  {enText}
                  <span className="inline-block w-0.5 h-3.5 bg-blue-600 rounded-sm align-middle ml-px animate-pulse" />
                </p>
              </div>
            </div>
          </div>


          {/* Divider */}
          <div className="flex-shrink-0 h-px my-4 sm:my-5
                          bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          {/* Buttons — mesmos estilos do login */}
          <div className={`flex flex-col gap-3 ${fadeUp(200)}`}>

            {/* Primary — igual ao botão Login */}
            <button
              type="button"
              className="relative overflow-hidden w-full h-12 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-blue-500 to-blue-800 shadow-md shadow-blue-400/35 hover:shadow-lg hover:shadow-blue-400/45 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              <a href="/register" className="flex items-center justify-center gap-2 w-full h-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Criar conta grátis
              </a>
              {/* Shimmer — igual ao login */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_2s_infinite]" />
            </button>

            {/* Secondary — outline no mesmo tom */}
            <button
              type="button"
              className="w-full h-12 rounded-xl font-bold text-sm text-blue-600 bg-[#f0f4ff] border border-blue-200 hover:border-blue-400 hover:shadow-sm hover:shadow-blue-100 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              <a href="/login" className="flex items-center justify-center gap-2 w-full h-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Já tenho conta — Entrar
              </a>
            </button>
          </div>

          {/* Terms */}
          <div className="anim-7 flex-shrink-0 text-center text-[10.5px] sm:text-xs text-slate-400 pt-3 pb-1">
            Ao continuar, você aceita os{" "}
            <a href="#" className="text-blue-600 font-semibold hover:underline">Termos de Uso</a>{" "}
            e a{" "}
            <a href="#" className="text-blue-600 font-semibold hover:underline">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </>
  );
}