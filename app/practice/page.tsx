"use client"

import { useState, useRef } from "react"
import { Star, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { cn } from "@/app/_lib/utils"
import { FRASES } from "@/app/_data/fakes"

// FRASES é um array de arrays — .flat() achata para um único array indexável
const PHRASES = FRASES.flat()

// ─── HELPERS ─────────────────────────────────────────────────────────────

// Calcula a distância de edição (Levenshtein) entre duas strings:
// quantas operações (inserção, deleção, substituição) são necessárias
// para transformar 'a' em 'b'. Usa programação dinâmica com matriz dp[m+1][n+1].
function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
    for (let i = 0; i <= m; i++) dp[i][0] = i   // custo de deletar tudo de 'a'
    for (let j = 0; j <= n; j++) dp[0][j] = j   // custo de inserir tudo de 'b'
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            // se os caracteres são iguais, herda o custo anterior sem operação extra;
            // caso contrário, pega o menor custo entre deletar, inserir ou substituir
            dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]
}

// Normaliza as duas respostas (minúsculas, sem espaços extras, sem pontuação)
// e converte a distância de edição num score de 0 a 100.
// Fórmula: score = (1 - distância / tamanho_da_maior_string) × 100
function scoreAnswer(userAns: string, correctAns: string): number {
    const u = userAns.toLowerCase().trim().replace(/[.,!?]/g, "")
    const c = correctAns.toLowerCase().trim().replace(/[.,!?]/g, "")
    if (u === c) return 100  // resposta idêntica após normalização
    const dist = levenshtein(u, c)
    return Math.max(0, Math.round((1 - dist / Math.max(u.length, c.length)) * 100))
}

// Formato do objeto de feedback retornado após a verificação
type Feedback = {
    status: "perfect" | "good" | "partial" | "needs_work"
    title: string
    message: string
    corrections: { wrong: string; correct: string; explanation: string }[]
    xp: number
}

// Transforma o score numérico em ‘feedback’ qualitativo com XP e correções:
//   ≥ 95 → perfeito        (+25 XP)
//   ≥ 70 → bom             (+15 XP)
//   ≥ 40 → parcial         (+8 XP)
//   < 40 → insuficiente    (+3 XP)
function generateFeedback(userAns: string, phraseEn: string, score: number): Feedback {
    if (score >= 95) {
        return { status: "perfect", title: "Perfeito! 🎉", message: "Sua tradução está excelente!", corrections: [], xp: 25 }
    }
    if (score >= 70) {
        return {
            status: "good", title: "Quase lá! 👏",
            message: "Sua tradução está boa, mas pode melhorar em alguns pontos.",
            corrections: [{ wrong: userAns, correct: phraseEn, explanation: "A tradução esperada usa uma estrutura ligeiramente diferente." }],
            xp: 15,
        }
    }
    if (score >= 40) {
        return {
            status: "partial", title: "Bom esforço! 💪",
            message: "Você captou a ideia principal, mas há diferenças significativas.",
            corrections: [{ wrong: userAns, correct: phraseEn, explanation: "Revise a estrutura gramatical e o vocabulário utilizado." }],
            xp: 8,
        }
    }
    return {
        status: "needs_work", title: "Continue praticando! 📖",
        message: "A tradução precisa de mais atenção. Veja a resposta correta abaixo.",
        corrections: [{ wrong: userAns, correct: phraseEn, explanation: "Tente prestar atenção na estrutura da frase e nas palavras-chave." }],
        xp: 3,
    }
}

// Classes Tailwind do card de feedback indexadas pelo status
const FEEDBACK_STYLES: Record<string, string> = {
    perfect: "bg-green-100 border border-[#86EFAC]",
    good: "bg-blue-100 border border-blue-200",
    partial: "bg-amber-100 border border-[#FCD34D]",
    needs_work: "bg-red-100 border border-[#FCA5A5]",
}

// Classes Tailwind do badge de dificuldade indexadas pelo nível
const DIFFICULTY_STYLES: Record<string, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-600",
    hard: "bg-red-100 text-red-600",
}

// Rótulos em português para cada nível de dificuldade
const DIFFICULTY_LABELS: Record<string, string> = {
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
}

// ─── PAGE ─────────────────────────────────────────────────────────────────
export default function Practice() {
    // índice da frase atual — inicializado aleatoriamente para variar a cada visita
    const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * PHRASES.length))
    // texto digitado pelo usuário no textarea
    const [answer, setAnswer] = useState("")
    // resultado da verificação; null enquanto o usuário ainda não verificou
    const [feedback, setFeedback] = useState<Feedback | null>(null)
    // controla a visibilidade do toast de XP
    const [showXpToast, setShowXpToast] = useState(false)
    // quantidade de XP exibida no toast após verificar
    const [earnedXp, setEarnedXp] = useState(0)
    // lista de ids de frases favoritadas pelo usuário
    const [favorites, setFavorites] = useState<number[]>([])
    // referência direta ao textarea para dar foco programaticamente
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // atalhos derivados do state atual
    const phrase = PHRASES[currentIndex]
    const isFav = favorites.includes(phrase.id)

    // Verifica a resposta: calcula score → gera feedback → exibe toast por 2s
    const handleVerify = () => {
        if (!answer.trim()) return
        const score = scoreAnswer(answer, phrase.en)
        const fb = generateFeedback(answer, phrase.en, score)
        setFeedback(fb)
        setEarnedXp(fb.xp)
        setShowXpToast(true)
        setTimeout(() => setShowXpToast(false), 2000)
    }

    // Avança para uma frase aleatória diferente da atual e reseta o estado
    const handleNext = () => {
        let next
        // garante que a próxima frase seja diferente da atual
        do { next = Math.floor(Math.random() * PHRASES.length) } while (next === currentIndex)
        setCurrentIndex(next)
        setAnswer("")
        setFeedback(null)
        // pequeno delay para o textarea já estar visível antes de focar
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    // Alterna o favorito: remove se já existe, adiciona se não existe
    const toggleFavorite = (id: number) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
    }

    return (
        <div className="mx-auto min-h-dvh bg-white px-5 pt-10 pb-28">
            {/* Toast de XP — aparece no topo centralizado por 2s após verificar */}
            {showXpToast && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-100">
                    <div className="flex items-center gap-1.5 bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
                        <Sparkles className="size-4.5" />
                        +{earnedXp} XP
                    </div>
                </div>
            )}

            {/* Header: título + botão de favorito da frase atual */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Traduzir</h1>
                <button
                    onClick={() => toggleFavorite(phrase.id)}
                    className="p-1 bg-transparent border-none cursor-pointer"
                >
                    {/* estrela preenchida (azul) se favoritada, contorno cinza se não */}
                    <Star
                        className="size-5"
                        fill={isFav ? "#3B82F6" : "none"}
                        stroke={isFav ? "#3B82F6" : "#94A3B8"}
                    />
                </button>
            </div>

            {/* Card da frase: badge de dificuldade + categoria + texto em português */}
            <div className="bg-linear-to-br from-blue-50 to-white border border-blue-100 rounded-4xl p-7 mb-5">
                <div className="flex gap-2 mb-3.5 items-center">
                    {/* badge de dificuldade com cor dinâmica via DIFFICULTY_STYLES */}
                    <span className={cn(
                        "inline-block px-2.5 py-0.75 rounded-full text-[11px] font-semibold uppercase tracking-[0.05em]",
                        DIFFICULTY_STYLES[phrase.difficulty]
                    )}>
            {DIFFICULTY_LABELS[phrase.difficulty]}
          </span>
                    <span className="text-xs text-slate-400 font-medium">{phrase.category}</span>
                </div>
                <p className="text-[20px] font-semibold text-slate-800 leading-relaxed tracking-tight">{phrase.pt}</p>
            </div>

            {/* Área de resposta — visível apenas antes de verificar (feedback === null) */}
            {!feedback && (
                <div>
                    {/* textarea controlado; Enter sem Shift aciona a verificação */}
                    <textarea
                        ref={inputRef}
                        className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 text-base text-slate-800 bg-white outline-none resize-none min-h-20 focus:border-blue-500 placeholder:text-slate-400 transition-colors"
                        placeholder="Digite a tradução em inglês..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleVerify()
                            }
                        }}
                    />
                    <div className="flex flex-col gap-2.5 mt-4">
                        {/* botão principal desabilitado enquanto o campo estiver vazio */}
                        <Button
                            onClick={handleVerify}
                            disabled={!answer.trim()}
                            className="w-full h-auto py-4 rounded-2xl text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-[0_4px_16px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                        >
                            Verificar Tradução
                        </Button>
                        {/* pular vai direto para handleNext sem verificar */}
                        <Button
                            variant="outline"
                            onClick={handleNext}
                            className="w-full h-auto py-3.5 rounded-2xl text-sm font-medium text-slate-500 border-[1.5px] border-slate-200 bg-transparent hover:bg-transparent hover:text-slate-500"
                        >
                            Pular frase
                        </Button>
                    </div>
                </div>
            )}

            {/* Card de feedback — visível após verificar */}
            {feedback && (
                <div>
                    {/* cor do card varia conforme o status via FEEDBACK_STYLES */}
                    <div className={cn("rounded-4xl p-6 mb-4", FEEDBACK_STYLES[feedback.status])}>
                        <h3 className="text-[20px] font-bold mb-1.5">{feedback.title}</h3>
                        <p className="text-sm text-slate-600 mb-4">{feedback.message}</p>

                        {/* resposta digitada pelo usuário */}
                        <div className="bg-white/60 rounded-xl p-3.5 mb-3">
                            <p className="text-xs font-semibold text-slate-500 mb-1">Sua resposta:</p>
                            <p className="text-[15px] text-slate-700">{answer}</p>
                        </div>

                        {/* lista de correções — vazia quando o status é "perfect" */}
                        {feedback.corrections.map((c, i) => (
                            <div key={i} className="bg-white/60 rounded-xl p-3.5 mb-3">
                                <p className="text-xs font-semibold text-slate-500 mb-1">Tradução esperada:</p>
                                <p className="text-[15px] text-green-600 font-semibold">{c.correct}</p>
                                <p className="text-[13px] text-slate-500 mt-2">{c.explanation}</p>
                            </div>
                        ))}

                        {/* mensagem extra exclusiva para traduções perfeitas */}
                        {feedback.status === "perfect" && (
                            <div className="bg-white/60 rounded-xl p-3.5">
                                <p className="text-[13px] text-slate-600">✨ Sua tradução foi natural e precisa. Continue assim!</p>
                            </div>
                        )}
                    </div>

                    {/* botão de avançar — substitui os botões de verificar/pular */}
                    <Button
                        onClick={handleNext}
                        className="w-full h-auto py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
                    >
                        Próxima Frase
                        <ArrowRight className="size-5" />
                    </Button>
                </div>
            )}
        </div>
    )
}
