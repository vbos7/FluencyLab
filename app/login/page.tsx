"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Mail } from "lucide-react"
import Home from "../home/page";


export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay = 0) =>
    `transition-all duration-500 ${delay ? `delay-[${delay}ms]` : ""} ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`;

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center px-4 relative overflow-hidden">

      {/* dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(59,130,246,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-blue-300/10 blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-blue-200/10 blur-3xl pointer-events-none z-0" />

      {/* card */}
      <div className={`m-7 relative z-10 w-full max-w-md bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-100/40 px-8 py-10 ${fadeUp()}`}>

        {/* logo + heading */}
        <div className={`flex flex-col items-center mb-2 ${fadeUp(75)}`}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center text-2xl shadow-lg shadow-blue-400/30 mb-4 ">

            <svg className="p-3 text-white"
              fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>

          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            FluencyLab
          </h1>
        </div>

        <div className="flex flex-col gap-4">

          {/* email */}
          <div className={fadeUp(100)}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              E-mail
            </label>
            <div className={`flex items-center gap-3 bg-[#f0f4ff] rounded-xl px-4 h-12 border transition-all duration-200 ${focused === "email" ? "border-blue-400 shadow-sm shadow-blue-100" : "border-transparent"}`}>
              <EmailIcon active={focused === "email"} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="seu@email.com"
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
              />
            </div>
          </div>

          {/* password */}
          <div className={fadeUp(150)}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Senha
              </label>

              <button
                onClick={() => setIsOpen(true)}
                className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
              >
                Esqueceu a senha?
              </button>

              

            </div>

            <div className={`flex items-center gap-3 bg-[#f0f4ff] rounded-xl px-4 h-12 border transition-all duration-200 ${focused === "password" ? "border-blue-400 shadow-sm shadow-blue-100" : "border-transparent"}`}>
              <LockIcon active={focused === "password"} />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-slate-400 hover:text-blue-500 transition-colors"
                tabIndex={-1}
              >
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* submit */}
          <div className={`mt-2 ${fadeUp(200)}`}>
            <button onClick={() => router.push("/home")}
              type="button"
              className="relative overflow-hidden w-full h-12 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-blue-500 to-blue-800 shadow-md shadow-blue-400/35 hover:shadow-lg hover:shadow-blue-400/45 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              
                Login
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_2s_infinite]" />
            </button>
          </div>
        </div>

        {/* signup */}
        <p className={`text-center text-xs text-slate-400 mt-6 ${fadeUp(320)}`}>
          Não tem uma conta?{" "}
          <a href="/register" className="text-blue-500 font-semibold hover:text-blue-700 transition-colors">
            Criar conta grátis
          </a>
        </p>

        {/* modal */}
              {isOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm rounded-3xl">
                  <div className="w-full max-w-sm bg-white rounded-2xl p-7 border border-blue-100 shadow-xl">

                    {/* fechar */}
                    <button onClick={() => setIsOpen(false)} className="float-right text-slate-400 hover:text-slate-600">
                      <X size={16} />
                    </button>

                    {!sent ? (
                      <>
                        <h2 className="text-lg font-extrabold text-slate-900 mb-1">Recuperar senha</h2>
                        <p className="text-sm text-slate-400 mb-5">Digite seu e-mail para receber o link.</p>

                        <div className={`flex items-center gap-3 bg-[#f0f4ff] rounded-xl px-4 h-12 mb-4`}>
                          <Mail size={16} className="text-slate-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                          />
                        </div>

                        <button
                          onClick={() => setSent(true)} // troca pelo sua chamada de API
                          className="w-full h-11 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-blue-800"
                        >
                          Enviar link
                        </button>
                      </>
                    ) : (
                      <>
                        <h2 className="text-lg font-extrabold text-slate-900 mb-1">E-mail enviado!</h2>
                        <p className="text-sm text-slate-400 mb-5">
                          Enviamos o link de recuperação para <strong className="text-blue-500">{email}</strong>.
                        </p>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="w-full h-11 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-blue-800"
                        >
                          Entendi
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
      </div>
    </div>
  );
}

function EmailIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${active ? "text-blue-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LockIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${active ? "text-blue-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}