'use client'

import { useEffect, useState } from "react";
import {  BowArrow, Video, SquareKanban, BookOpenCheck } from 'lucide-react';
import { ElementType } from 'react';
import { Icon } from "../admin/icon";

export default function PremiumCard() {
    return (
        <div className="rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] sm:p-6 ">
  {/* Header */}
  <div className="text-center mb-10 lg:mb-12">
    <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-3">
      Plano Premium
    </h3>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      Acelere seu inglês 3x mais rápido com acesso vitalício
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    {/* Coluna 1 - Benefícios em cards horizontais */}
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: BowArrow, title: "Modos exclusivos", desc: "Dictation, fill-in e mais" },
          { icon: Video, title: "Vídeos", desc: "Aulas do básico ao avançado" },
          { icon: SquareKanban, title: "Relatórios", desc: "Evolução semanal detalhada" },
          { icon: BookOpenCheck, title: "Suas categorias", desc: "Escolha o tema das frases" },
        ].map((item, i) => {
          const IconComponent = item.icon;
          return (
          <div key={i} className="group bg-white/70 hover:bg-white backdrop-blur-sm p-6 rounded-2xl border border-white/50 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-start gap-4 mb-3">
              <div className="text-2xl flex-shrink-0"><IconComponent size={24} /></div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-700">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          </div>
        );
        })}
      </div>
      
      {/* Social Proof */}
      <div className="flex items-center justify-center gap-4 pt-6 border-t border-blue-100 text-sm text-gray-500">
        <div className="flex -space-x-3">
          {["LM", "CJ", "PH", "RS", "MG"].map((init, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-bold rounded-full flex items-center justify-center shadow-lg border-3 border-white"
            >
              {init}
            </div>
          ))}
        </div>
        <span className="font-semibold text-gray-700">+1.847 alunos evoluíram</span>
      </div>
    </div>

    {/* Coluna 2 - Preço e CTA */}
    <div className="text-center lg:text-left relative overflow-hidden">

      <div className="pointer-events-none absolute -top-14 -right-14 h-52 w-52 rounded-full bg-white/6" />
            <div className="pointer-events-none absolute right-16 -bottom-16 h-40 w-40 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute bottom-28 -left-28 h-40 w-40 rounded-full bg-white/5" />

      <div className="  p-10  mb-8 rounded-2xl bg-linear-to-br from-blue-700 to-blue-600 p-7 text-white shadow-xl shadow-blue-900/40">
        <div className="flex items-baseline justify-center lg:justify-start mb-4">
          <span className="text-blue-200 text-lg font-medium tracking-wide uppercase">Único pagamento</span>
        </div>
        <div className="flex items-baseline justify-center lg:justify-start gap-2">
          <span className="text-5xl lg:text-6xl font-black">R$</span>
          <span className="text-6xl lg:text-7xl font-black">4,99</span>
        </div>
        <div className="mt-4 bg-white/30 backdrop-blur-sm px-6 py-3 rounded-2xl text-xl font-bold mx-auto lg:mx-0 w-fit">
          ACESSO VITALÍCIO
        </div>
      </div>

      <a
        href="/planos"
        className="block w-full bg-linear-to-br from-blue-700 to-blue-600 shadow-blue-900/40 text-white font-bold py-5 px-8 rounded-3xl text-xl shadow-2xl  transform hover:-translate-y-2 transition-all duration-300 mb-6 flex items-center justify-center gap-3 text-lg"
      >
        <span>Quero o Premium Agora </span>
      </a>

      <p className="text-sm text-gray-500 text-center lg:text-left">
        Cancelamento quando quiser • Pagamento seguro • Garantia total
      </p>
    </div>
  </div>
</div>
    );
}