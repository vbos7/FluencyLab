"use client";

import { useEffect, useRef, useState } from "react";

export default function ProfilePage() {
  const xpFillRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    nome: "Samuel",
    email: "",
    telefone: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  useEffect(() => {     
    const el = xpFillRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.width = "67%";
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    console.log("Dados salvos:", form);
    setIsModalOpen(false);
  }

  return (
    <div className="bg-[#f0f4ff] min-h-screen px-4 py-6 sm:py-10 font-sans text-[#1e293b]">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 sm:gap-6">

        
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dce8ff] overflow-hidden shadow-[0_8px_32px_rgba(37,99,235,0.13)]">
          <div
            className="h-20 sm:h-28 relative"
            style={{ background: "linear-gradient(270deg,#1d4ed8 10%,#2563eb 50%,#60a5fa 100%)" }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="px-4 sm:px-8 pb-5 sm:pb-8">
            
            <div className="relative inline-block -mt-9 sm:-mt-11 mb-2 sm:mb-3">
              <div
                className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full border-4 border-white flex items-center justify-center text-3xl sm:text-4xl font-black text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
                style={{ background: "linear-gradient(135deg,#1d4ed8,#60a5fa)" }}
              >
                
              </div>
              <div className="absolute bottom-0.5 right-0.5 w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] bg-[#f5a623] rounded-full border-[3px] border-white flex items-center justify-center text-[10px] sm:text-xs z-10">
                🥇
              </div>
            </div>

            
            <div className="flex items-start justify-between flex-wrap gap-2 sm:gap-3">
              <div>
                <h1 className="text-lg sm:text-[1.35rem] font-black leading-tight">{form.nome}</h1>
                <div
                  className="inline-flex items-center mt-1.5 sm:mt-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-[#b07a00] border border-[#f5a623]"
                  style={{ background: "linear-gradient(135deg,#fff8e7,#ffe9b0)" }}
                >
                  #1 no Ranking Geral
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#2563eb] text-white rounded-xl font-bold text-xs sm:text-sm shadow-[0_4px_14px_rgba(37,99,235,0.30)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] active:scale-95"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: "⭐", value: "200", label: "Pontos" },
            { icon: "🏆", value: "#1",    label: "Posição" },
            { icon: "🔥", value: "14",    label: "Sequência" },
            { icon: "✅", value: "47",    label: "Concluídos" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[#dce8ff] rounded-2xl p-3.5 sm:p-5 text-center shadow-[0_2px_16px_rgba(37,99,235,0.08)] transition-transform hover:-translate-y-1"
            >
              <div className="text-2xl sm:text-[1.6rem] mb-1">{s.icon}</div>
              <div className="text-xl sm:text-2xl font-black">{s.value}</div>
              <div className="text-[10px] sm:text-xs font-semibold text-[#7a94b8] mt-1 uppercase tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        
        <div className="bg-white border border-[#dce8ff] rounded-2xl p-4 sm:p-6 shadow-[0_2px_16px_rgba(37,99,235,0.08)]">
          <div className="text-sm sm:text-base font-extrabold mb-3 sm:mb-4">
            ⚡ Progresso para o Próximo Nível
          </div>
          <div className="flex justify-between text-[11px] sm:text-[.82rem] font-bold text-[#7a94b8] mb-2">
            <span>Nível 4 — Expert</span>
            <span>250 / 300 XP</span>
          </div>
          <div className="h-2.5 sm:h-3 bg-[#e8f0fe] rounded-full overflow-hidden">
            <div
              ref={xpFillRef}
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: "0%", background: "linear-gradient(90deg,#2563eb,#60a5fa)" }}
            />
          </div>
          <div className="text-[10px] sm:text-[.78rem] text-[#7a94b8] mt-1.5 text-right">
            Faltam 50 pts para o Nível 5
          </div>
        </div>

        
        <div className="bg-white border border-[#dce8ff] rounded-2xl p-4 sm:p-6 shadow-[0_2px_16px_rgba(37,99,235,0.08)]">
          <div className="text-sm sm:text-base font-extrabold mb-3 sm:mb-4">📊 Ranking Atual</div>
          {[
            { pos: "🥇", name: "Samuel",   pts: "200 pts", isYou: true  },
            { pos: "🥈", name: "Isabella", pts: "190 pts", isYou: false },
            { pos: "🥉", name: "Pedro",    pts: "180 pts", isYou: false },
            { pos: "#4", name: "Milena",   pts: "165 pts", isYou: false },
            { pos: "#5", name: "Bruno",    pts: "155 pts", isYou: false },
          ].map((r, i) => (
            <div
              key={r.name}
              className={`flex items-center gap-3 py-2 sm:py-2.5 ${i < 4 ? "border-b border-[#dce8ff]" : ""}`}
            >
              <div className={`w-6 sm:w-7 text-center text-xs sm:text-sm font-bold ${i >= 3 && !r.isYou ? "text-[#7a94b8]" : ""}`}>
                {r.pos}
              </div>
              <div className={`flex-1 font-bold text-xs sm:text-sm ${r.isYou ? "text-[#2563eb]" : ""}`}>
                {r.name}
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#2563eb]"> {r.pts}</div>
            </div>
          ))}
        </div>
      </div>

      
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(15,30,60,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md p-6 sm:p-8 flex flex-col gap-4 shadow-2xl">

            
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold">Editar Perfil</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f4ff] text-[#7a94b8] text-xs font-bold hover:bg-[#dce8ff] transition-colors"
              >
                
              </button>
            </div>

            
            <div className="flex flex-col gap-3">

              
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-[#7a94b8] uppercase tracking-wide mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className="w-full border border-[#dce8ff] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2563eb] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-[#7a94b8] uppercase tracking-wide mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full border border-[#dce8ff] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2563eb] transition-colors"
                />
              </div>

              
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-[#7a94b8] uppercase tracking-wide mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="+55 11 99999-9999"
                  className="w-full border border-[#dce8ff] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2563eb] transition-colors"
                />
              </div>

              
              <div className="border-t border-[#dce8ff] pt-3 sm:pt-4 flex flex-col gap-2.5 sm:gap-3">
                <p className="text-[10px] sm:text-xs font-bold text-[#7a94b8] uppercase tracking-wide">
                  Trocar Senha
                </p>
                <input
                  type="password"
                  name="senhaAtual"
                  value={form.senhaAtual}
                  onChange={handleChange}
                  placeholder="Senha atual"
                  className="w-full border border-[#dce8ff] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2563eb] transition-colors"
                />
                <input
                  type="password"
                  name="novaSenha"
                  value={form.novaSenha}
                  onChange={handleChange}
                  placeholder="Nova senha"
                  className="w-full border border-[#dce8ff] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2563eb] transition-colors"
                />
                <input
                  type="password"
                  name="confirmarSenha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Confirmar nova senha"
                  className="w-full border border-[#dce8ff] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2563eb] transition-colors"
                />
              </div>
            </div>

            
            <div className="flex gap-2.5 sm:gap-3 mt-1">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 sm:py-2.5 rounded-xl border border-[#dce8ff] text-[#7a94b8] font-bold text-xs sm:text-sm hover:bg-[#f0f4ff] transition-colors active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 sm:py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs sm:text-sm shadow-[0_4px_14px_rgba(37,99,235,0.30)] hover:bg-[#1d4ed8] transition-colors active:scale-95"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}