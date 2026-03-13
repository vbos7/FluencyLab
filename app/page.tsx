"use client";
import { useEffect, useState } from "react";


const user = {
  name: "Marcus Vinicius",
  level: 2,
  xp: 300,
  xpNeeded: 500,
  streak: 7,
  stats: { translations: 20, accuracy: 70, minutesToday: 45 },
};

const ranking = [
  { pos: 1, name: "João", xp: 500, tier: "gold", initials: "J", pct: 100 },
  { pos: 2, name: "Maria", xp: 450, tier: "silver", initials: "M", pct: 90 },
  { pos: 3, name: "Pedro", xp: 400, tier: "bronze", initials: "P", pct: 80 },
];

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
      <div className="mb-2 transition-all duration-500  mt-[5%]"
        style={{ opacity: 1, transform: "translateY(0)" }}>
        <p className="text-sm text-slate-400 font-medium mb-1">👋 Olá de volta,</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Bem-vindo, <span className="text-blue-600">{user.name}!</span>
        </h1>
      </div>


      <div className="flex flex-col m-5">
        {/* Nível Atual */}

        <div className="relative overflow-hidden rounded-2xl p-7 mb-5 bg-gradient-to-br from-blue-600 to-blue-300 shadow-xl shadow-blue-400 transition-all duration-500 delay-75 opacity-100 translate-y-0 text-white">

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
                🔥 {user.streak} dias streak
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




        {/* Conteúdo Recomendado */}
        <div className="mt-4 flex flex-row gap-4 mt-[10%] mb-[10%] h-50 w-full">

          <div className="bg-gray-200 p-4 rounded-lg w-[50%] flex flex-col justify-center items-center">

            <div className=" bg-green-300 p-3 rounded-full mb-2">✔️</div>

            <p className="text-3xl text-olive-900">20</p>

            <p className="text-gray-500 text-sm m-2">Traduções</p>
          </div>

          <div className="bg-gray-200 p-4 rounded-lg w-[50%] flex flex-col justify-center items-center">

            <div className=" bg-red-300 p-3 rounded-full mb-2">🔥</div>

            <p className="text-3xl text-olive-900">70%</p>

            <p className="text-gray-500 text-sm m-2">Precisão</p>
          </div>

        </div>

        {/* Pratica */}

        <div className=
          "relative overflow-hidden bg-white rounded-2xl p-6 mb-7 flex items-center justify-between gap-5 border border-blue-100 shadow-sm transition-all duration-500 delay-200 mounted ? opacity-100 translate-y-0 opacity-0 translate-y-4">


          {/* left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-blue-300 to-blue-600" />

          <div className="pl-2">
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">Pronto para praticar e subir seu nivel?</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Você está a {user.xpNeeded - user.xp} XP do nível {user.level + 1}. Um pouquinho mais e você chega lá!
            </p>
          </div>

          <button className="flex-shrink-0 px-8 py-3 rounded-xl text-sm font-bold text-white
                         bg-gradient-to-br from-blue-500 to-blue-800
                         shadow-md shadow-blue-400/35
                         hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/45
                         active:scale-95 transition-all duration-200">
            Ir Praticar
          </button>

        </div>



        <div className="mt-2 bg-[#26658C] p-4 rounded-xl w-full flex flex-col justify-center items-center">

          <p className="text-lg text-white p-4 text-center">O FluencyLab é um aplicativo de aprendizado de idiomas que utiliza inteligência artificial para ajudar os usuários a praticarem suas habilidades linguísticas de forma eficaz e personalizada.</p>

          <button className="mt-2 bg-white text-[#0D1B2A] hover:bg-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 py-2 px-4 rounded-md mt-3 w-full transition-colors duration-300">

            Ir Praticar!
          </button>
        </div>

        {/* ranking top3 */}

        <div className="flex flex-col ">
          <div className="ms-4">
            <h2 className="text-xl font-bold mt-4 mb-2">Ranking Top 3</h2>
          </div>

          <div className="flex flex-row gap-4 mt-2 justify-between ms-2">

            <div className="bg-gray-200  p-[8%] rounded-lg   hover:bg-gray-300 transition-colors duration-300 ">
              <h1 className="text-lg">1. João</h1>
              <p className="text-sm text-gray-500">500xp</p>
            </div>

            <div className="bg-gray-200  p-[8%] rounded-lg hover:bg-gray-300 transition-colors duration-300 ">
              <h1 className="text-lg">2. Maria</h1>
              <p className="text-sm text-gray-500">450xp</p>
            </div>

            <div className="bg-gray-200  p-[8%] rounded-lg hover:bg-gray-300 transition-colors duration-300 ">
              <h1 className="text-lg">3. Pedro</h1>
              <p className="text-sm text-gray-500">400xp</p>
            </div>

          </div>
        </div>






      </div>
    </div>
  )
}
