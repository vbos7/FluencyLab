"use client";

import { useState } from "react";
import { X } from "lucide-react";
import PlanosPage from "@/app/planos/page";

type Props = {
  onClose: () => void;
};

export default function CheckoutModal({ onClose }: Props) {
  const [method, setMethod] = useState<"card" | "pix">("card");
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);
    // 🔧 Aqui você conecta com Stripe ou Mercado Pago depois
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 px-4 pointer-events-none"
      style={{ animation: "fadeIn 0.25s ease" }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute pointer-events-auto top-6 right-6 -m-2 p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50"
        aria-label="Fechar modal"
      >
          <X className="w-5 h-5" />
        </button>
      <div className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"

        style={{ animation: "slideUp 0.4s cubic-bezier(.16,1,.3,1)" }}
      >
        


        {/* Body */}
        <div className="px-6 py-5">

          {/* Badge do plano */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-blue-400 mb-0.5">Plano Pro</p>
              <p className="text-blue-900 font-semibold text-lg">
                R$ 4,99 <span className="text-sm font-normal text-blue-400">/vitalicio</span>
              </p>
            </div>
            <span className="text-xs font-medium bg-blue-700 text-blue-100 px-3 py-1 rounded-full">
              ✦ Premium
            </span>
          </div>

          {/* Dados pessoais */}
          

          <hr className="border-gray-100 my-4" />

          {/* Método de pagamento */}
          <p className="text-xs font-medium text-gray-500 mb-3">Forma de pagamento</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {(["card", "pix"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`py-2.5 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-2 ${
                  method === m
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {m === "card" ? "💳 Cartão" : "⚡ Pix"}
              </button>
            ))}
          </div>

          {/* Campos cartão */}
          {method === "card" && (
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Número do cartão
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    Validade
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Nome no cartão
                </label>
                <input
                  type="text"
                  placeholder="Como está no cartão"
                  className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>
            </div>
          )}

          {/* Pix */}
          {method === "pix" && (
            <div className="text-center py-4 mb-4">
              <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-xl mx-auto flex items-center justify-center text-xs text-gray-400 mb-3">
                QR Code
              </div>
              <p className="text-sm text-gray-500">
                Após confirmar, você receberá o QR Code do Pix no seu e-mail.
              </p>
            </div>
          )}

          {/* Botão */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white rounded-xl text-sm font-medium transition"
          >
            {loading ? "Processando..." : "Confirmar assinatura →"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
            🔒 Pagamento 100% seguro
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}