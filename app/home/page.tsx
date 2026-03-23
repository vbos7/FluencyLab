"use client";
import router from "next/router";
import { useEffect, useState } from "react";


const user = {
  name: "Marcus Vinicius",
  level: 4,
  xp: 980,
  xpNeeded: 1500,
  streak: 7,
  stats: { translations: 20, accuracy: 70, minutesToday: 45 },
};


const navItems = [
  {
    label: "Início", active: true, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>)
  },
  {
    label: "Progresso", active: false, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>)
  },
  {
    label: "Ranking", active: false, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>)
  },
  {
    label: "Perfil", active: false, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>)
  },
];

// tier color maps
const tierColors = {
  gold: { pos: "text-amber-500", bar: "from-amber-400 to-orange-400", ring: "border-amber-300/40 bg-amber-50" },
  silver: { pos: "text-slate-400", bar: "from-slate-400 to-slate-500", ring: "border-slate-300/40" },
  bronze: { pos: "text-orange-700", bar: "from-orange-700 to-orange-500", ring: "border-orange-300/40" },
};

const avatarColors = {
  J: "from-blue-600 to-blue-800",
  M: "from-emerald-500 to-cyan-600",
  P: "from-orange-500 to-red-500",
};

// ── animation hook ─────────────────────────────────────────────
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
  return mounted;
}



export default function Home() {

  return (

    <div className="mx-auto min-h-dvh relative bg-white pb-24 px-4 sm:px-6 lg:px-8">


      {/* bem-vindo */}
      <div className="mb-2 transition-all duration-500 mt-[5%]"
        style={{ opacity: 1, transform: "translateY(0)" }}>
        <p className="text-sm text-slate-400 font-medium mb-1">👋 Olá de volta,</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Bem-vindo,{" "}
          <span className="text-blue-600 inline-flex overflow-hidden">
            {(user.name + "!").split("").map((char, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  animation: `letterBounce 1.8s ${i * 0.08}s ease-in-out infinite`,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </h1>

        <style>{`
    @keyframes letterBounce {
      0%,  60%, 100% { transform: translateY(0);    }
      30%             { transform: translateY(-10px); }
    }
  `}</style>
      </div>


      <div className="flex flex-col m-5">

        {/* Nível Atual */}
        <div className="relative overflow-hidden rounded-2xl p-7 mb-1 bg-gradient-to-br from-blue-600 to-blue-300 shadow-xl shadow-blue-400 transition-all duration-500 delay-75 opacity-100 translate-y-0 text-white">

          <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full bg-white/[0.06] pointer-events-none" />

          <div className="absolute -bottom-16 right-16 w-40 h-40 rounded-full bg-white/[0.05] pointer-events-none" />

          <div className="absolute -left-28 bottom-28 w-40 h-40 rounded-full bg-white/[0.05] pointer-events-none" />

          {/* top row */}
          <div className="relative z-10">

            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-widest opacity-70 mb-1">Nível Atual</p>
                <p className="text-5xl font-mono font-medium leading-none">
                  {String(user.level).padStart(2, "0")}
                </p>
              </div>


              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold
                bg-white/15 border border-white/20 backdrop-blur-sm">

                <span className="relative inline-flex items-center justify-center w-8 h-8">
                  <svg viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 drop-shadow-[0_0_6px_rgba(251,146,60,0.9)]"
                    style={{
                      animation: "flameSway 1.8s ease-in-out infinite alternate",
                      transformOrigin: "50% 95%"
                    }}>
                    <defs>
                      {/* gradiente externo laranja/vermelho */}
                      <linearGradient id="flameOuter" x1="16" y1="38" x2="16" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ea580c" />
                        <stop offset="40%" stopColor="#f97316" />
                        <stop offset="75%" stopColor="#fb923c" />
                        <stop offset="100%" stopColor="#fde68a" />
                      </linearGradient>

                      {/* gradiente interno amarelo/branco */}
                      <linearGradient id="flameInner" x1="16" y1="38" x2="16" y2="4" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="35%" stopColor="#fbbf24" />
                        <stop offset="70%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>

                      {/* gradiente núcleo branco */}
                      <linearGradient id="flameCore" x1="16" y1="38" x2="16" y2="12" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="50%" stopColor="#fef9c3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                      </linearGradient>

                      {/* filtro glow */}
                      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>

                    {/* chama externa — forma principal */}
                    <path
                      d="M16 2
           C16 2 22 8 23 14
           C24.5 11 24 7 22 4
           C26 7 28 12 27.5 18
           C28.5 16 29 13 28 10
           C31 15 31 21 29 26
           C27.5 30 23.5 34 16 36
           C8.5 34 4.5 30 3 26
           C1 21 1 15 4 10
           C3 13 3.5 16 4.5 18
           C4 12 6 7 10 4
           C8 7 7.5 11 9 14
           C10 8 12 2 16 2Z"
                      fill="url(#flameOuter)"
                      filter="url(#glow)"
                      style={{
                        animation: "flameBreath 0.9s ease-in-out infinite alternate",
                        transformOrigin: "16px 36px"
                      }}
                    />

                    {/* chama intermediária */}
                    <path
                      d="M16 8
           C16 8 20 13 20.5 18
           C21.5 15.5 21 12 19.5 10
           C22 13 23 17.5 22 22
           C22.5 20.5 23 18 22.5 16
           C24.5 19.5 24 24 22 28
           C20.5 31 18.5 33 16 34
           C13.5 33 11.5 31 10 28
           C8 24 7.5 19.5 9.5 16
           C9 18 9.5 20.5 10 22
           C9 17.5 10 13 12.5 10
           C11 12 10.5 15.5 11.5 18
           C12 13 13.5 8 16 8Z"
                      fill="url(#flameInner)"
                      style={{
                        animation: "flameBreath 0.7s 0.1s ease-in-out infinite alternate",
                        transformOrigin: "16px 34px"
                      }}
                    />

                    {/* núcleo central brilhante */}
                    <path
                      d="M16 14
           C16 14 18.5 17.5 18.5 21
           C19 19.5 18.5 17.5 17.5 16
           C19 18 19.5 21 18.5 24
           C18 26.5 17 28.5 16 29.5
           C15 28.5 14 26.5 13.5 24
           C12.5 21 13 18 14.5 16
           C13.5 17.5 13 19.5 13.5 21
           C13.5 17.5 14.5 14 16 14Z"
                      fill="url(#flameCore)"
                      style={{
                        animation: "coreFlicker 0.5s 0.05s ease-in-out infinite alternate",
                        transformOrigin: "16px 29px"
                      }}
                    />

                    {/* faíscas */}
                    <circle cx="9" cy="10" r="1" fill="#fb923c"
                      style={{ animation: "sparkFloat 1.4s 0s ease-out infinite", opacity: 0 }} />
                    <circle cx="23" cy="8" r="0.8" fill="#fbbf24"
                      style={{ animation: "sparkFloat 1.2s 0.3s ease-out infinite", opacity: 0 }} />
                    <circle cx="7" cy="15" r="0.7" fill="#f97316"
                      style={{ animation: "sparkFloat 1.6s 0.6s ease-out infinite", opacity: 0 }} />
                    <circle cx="25" cy="13" r="1" fill="#fde68a"
                      style={{ animation: "sparkFloat 1.1s 0.9s ease-out infinite", opacity: 0 }} />
                    <circle cx="13" cy="6" r="0.6" fill="#fb923c"
                      style={{ animation: "sparkFloat 1.3s 0.2s ease-out infinite", opacity: 0 }} />
                  </svg>

                  <style>{`
      @keyframes flameSway {
        from { transform: rotate(-4deg) scaleX(0.96); }
        to   { transform: rotate(4deg)  scaleX(1.04); }
      }
      @keyframes flameBreath {
        from { transform: scaleY(1)    scaleX(1); }
        to   { transform: scaleY(1.07) scaleX(0.94); }
      }
      @keyframes coreFlicker {
        from { transform: scaleY(1)    scaleX(1);    opacity: 0.9; }
        to   { transform: scaleY(1.12) scaleX(0.9);  opacity: 1;   }
      }
      @keyframes sparkFloat {
        0%   { transform: translate(0, 0)    scale(1);   opacity: 1; }
        70%  { opacity: 0.6; }
        100% { transform: translate(0, -14px) scale(0);  opacity: 0; }
      }
    `}</style>
                </span>

                {user.streak} dias streak
              </div>


            </div>
          </div>

          {/* xp labels */}
          <div className="flex justify-between text-xs font-semibold opacity-75 mb-2">
            <span>{user.xp} XP</span>
            <span>Meta: {user.xpNeeded} XP</span>
          </div>

          {/* progress bar */}
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-white/90 to-white/60 relative
                       transition-all duration-1000 ease-out"
              style={{ width: `${(user.xp / user.xpNeeded) * 100}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                             bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
          </div>

          <p className="mt-2.5 text-right text-[0.7rem] opacity-60 font-medium">
            Faltam <strong className="opacity-100">{user.xpNeeded - user.xp} XP</strong> para o Nível {user.level + 1} 🚀
          </p>
        </div>

        {/* Estatísticas */}
        <div className="flex flex-row gap-4 mt-[8%] mb-[5%] w-full">

          {/* card traduções */}
          <a href="/progress" className="group bg-white rounded-2xl p-5 text-center border shadow-sm
                  hover:-translate-y-1 hover:shadow-md hover:border-emerald-200
                  hover:bg-emerald-50/40 transition-all duration-300 cursor-default w-full">

            <div className="bg-emerald-100 p-3 rounded-full mb-3 mt-4 w-fit mx-auto
                    group-hover:bg-emerald-200 transition-all duration-300"
              style={{ animation: "iconFloat 3s ease-in-out infinite" }}>
              ✅
            </div>

            <p className="text-3xl font-bold text-emerald-500 tabular-nums"
              style={{ animation: "countUp 1.4s ease-out forwards" }}>
              20
            </p>

            <p className="text-sm font-mono font-medium text-gray-400 mt-2">Traduções</p>
          </a>

          {/* card precisão */}
          <a href="/progress" className="group bg-white rounded-2xl p-5 text-center border shadow-sm
                  hover:-translate-y-1 hover:shadow-md hover:border-red-200
                  hover:bg-red-50/40 transition-all duration-300 cursor-default w-full">

            <div className="bg-red-100 p-3 rounded-full mb-3 mt-4 w-fit mx-auto
                    group-hover:bg-red-200 transition-all duration-300"
              style={{ animation: "iconFloat 3s 0.4s ease-in-out infinite" }}>
              🎯
            </div>

            <p className="text-3xl font-bold text-red-500 tabular-nums"
              style={{ animation: "countUp 1.4s 0.2s ease-out forwards" }}>
              70%
            </p>

            <p className="text-sm font-mono font-medium text-gray-400 mt-2">Precisão</p>
          </a>

          <style>{`
    @keyframes countUp {
      0%   { opacity: 0; transform: scale(0.4) translateY(10px); }
      60%  { transform: scale(1.2) translateY(-4px);              }
      80%  { transform: scale(0.95);                              }
      100% { opacity: 1; transform: scale(1) translateY(0);      }
    }

    @keyframes iconFloat {
      0%   { transform: translateY(0)    scale(1);    }
      30%  { transform: translateY(-5px) scale(1.08); }
      60%  { transform: translateY(-3px) scale(1.04); }
      100% { transform: translateY(0)    scale(1);    }
    }
  `}</style>

        </div>

        {/* Pratica */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-blue-100 shadow-sm
                flex items-center justify-between
                p-4 md:p-7
                gap-3 md:gap-6
                h-28 md:h-44
                mb-7">

          {/* left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 md:w-2 rounded-l-2xl bg-gradient-to-b from-blue-300 to-blue-600" />

          {/* texto */}
          <div className="pl-3 md:pl-4 flex-1">
            <h3 className="font-extrabold text-slate-900
                   text-sm md:text-base  mb-1 md:mb-2">
              Pronto para praticar e subir seu nível?
            </h3>
            <p className="text-slate-500 leading-relaxed
                  text-[0.7rem] md:text-sm
                  max-w-[160px] md:max-w-sm">
              Você está a {user.xpNeeded - user.xp} XP do nível {user.level + 1}. Um pouquinho mais e você chega lá!
            </p>
          </div>

          {/* botão */}
          <a href="/practice"
            className="flex-shrink-0 flex items-center justify-center gap-2
                text-white font-bold
                bg-gradient-to-br from-blue-500 to-blue-800
                shadow-md shadow-blue-400/35
                hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/45
                active:scale-95 transition-all duration-200
                rounded-lg md:rounded-xl
                text-[0.7rem] md:text-base
                px-3 py-2 md:px-10 md:py-4
                w-20 md:w-48">

            <svg className="w-3 h-3 md:w-5 md:h-5 flex-shrink-0"
              fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>

            <span className="hidden md:inline">Ir Praticar</span>
            <span className="md:hidden">Praticar</span>
          </a>

        </div>
        {/* ranking top3 */}
        <div className="mt-7 duration-500 delay-300 opacity-100 translate-y-0">
          {/* header */}
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              🏆 Ranking Top 3
            </h2>
            <a href="/ranking" className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors">
              Ver todos →
            </a>
          </div>

          {/* lista */}
          <div className="flex flex-col gap-2.5">

            {/* 1º lugar - ouro */}
            <div className="flex items-center gap-3.5 bg-amber-50 rounded-2xl px-5 py-4
                    border border-amber-300/40 shadow-sm
                    hover:translate-x-1.5 hover:shadow-md transition-all duration-200">
              <span className="font-mono text-base font-semibold w-6 text-center text-amber-500">1</span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center
                      text-sm font-bold text-white flex-shrink-0
                      bg-gradient-to-br from-blue-600 to-blue-800">
                <img src="https://github.com/leerob.png" alt="Lucas M." className=" rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 mb-1.5">Lusca M.</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
                  </div>
                  <span className="text-[0.68rem] text-slate-400 font-mono whitespace-nowrap">9.820 XP</span>
                </div>
              </div>
            </div>

            {/* 2º lugar - prata */}
            <div className="flex items-center gap-3.5 bg-white rounded-2xl px-5 py-4
                    border border-slate-300/40 shadow-sm
                    hover:translate-x-1.5 hover:shadow-md transition-all duration-200">
              <span className="font-mono text-base font-semibold w-6 text-center text-slate-400">2</span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center
                      text-sm font-bold text-white flex-shrink-0
                      bg-gradient-to-br from-emerald-500 to-cyan-600">
                <img src="https://github.com/rauchg.png" alt="Carlos J." className=" rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 mb-1.5">Carlos J.</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-slate-400 to-slate-500" />
                  </div>
                  <span className="text-[0.68rem] text-slate-400 font-mono whitespace-nowrap">9.350 XP</span>
                </div>
              </div>
            </div>

            {/* 3º lugar - bronze */}
            <div className="flex items-center gap-3.5 bg-white rounded-2xl px-5 py-4
                    border border-orange-300/40 shadow-sm
                    hover:translate-x-1.5 hover:shadow-md transition-all duration-200">
              <span className="font-mono text-base font-semibold w-6 text-center text-orange-700">3</span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center
                      text-sm font-bold text-white flex-shrink-0
                      bg-gradient-to-br from-orange-500 to-red-500">
                <img src="https://github.com/timneutkens.png" alt="Pedro H." className=" rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 mb-1.5">Pedro H.</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-orange-700 to-orange-500" />
                  </div>
                  <span className="text-[0.68rem] text-slate-400 font-mono whitespace-nowrap">8.980 XP</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
