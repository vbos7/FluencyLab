"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function CheckoutModal({ onClose }: Props) {
  const [method, setMethod] = useState<"card" | "pix">("card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1800);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 px-4"
      style={{ animation: "fadeIn 0.25s ease" }}
    >
      {/* Botão X sempre visível */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition"
        >
          <X size={14} />
        </button>
      <div
        className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
        style={{ animation: "slideUp 0.4s cubic-bezier(.16,1,.3,1)" }}
      >
        

        {/* ===== TELA DE SUCESSO ===== */}
        {success ? (
          <div
            className="flex flex-col items-center justify-center text-center px-8 py-12"
            style={{ animation: "popIn 0.45s cubic-bezier(.16,1,.3,1)" }}
          >
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-blue-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Bem-vindo ao Pro!
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Seu pagamento foi confirmado. Agora você tem acesso completo
              a tudo que o FluencyLab tem de melhor — é só aproveitar!
            </p>

            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 text-sm font-medium text-blue-700">
              ✦ Plano Pro ativado com sucesso
            </div>

            <button
              onClick={() => (window.location.href = "./practice")}
              className="mt-6 w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-medium transition"
            >
              Começar a aprender →
            </button>
          </div>

        ) : (

          /* ===== TELA DO FORMULÁRIO ===== */
          <div className="px-6 py-6">

            {/* Badge do plano */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-blue-400 mb-0.5">Plano Pro</p>
                <p className="text-blue-900 font-semibold text-lg">
                  R$ 4,99{" "}
                  <span className="text-sm font-normal text-blue-400">/vitalício</span>
                </p>
              </div>
              <span className="text-xs font-medium bg-blue-700 text-blue-100 px-3 py-1 rounded-full">
                ✦ Premium
              </span>
            </div>

            {/* Dados pessoais */}
            
            <div className="flex flex-col gap-3 mb-1">
            </div>

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

            {/* Botão confirmar */}
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
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes popIn { from { opacity:0; transform:scale(0.9) } to { opacity:1; transform:scale(1) } }
      `}</style>
    </div>
  );
}