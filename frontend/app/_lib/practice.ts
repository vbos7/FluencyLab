// ─── Tipos ───────────────────────────────────────────────────────────────────

// Frase da prática. A tradução de referência (en) não vem para o navegador:
// ela é a resposta do exercício e só a IA a usa, no backend.
export type Phrase = {
    id: number
    pt: string
    difficulty: string
    category: string
}

// Formato do objeto de feedback retornado após a verificação
export type Feedback = {
    status: "perfect" | "good" | "partial" | "needs_work"
    title: string
    message: string
    // Frase inteira correta em inglês (resposta corrigida ou tradução de referência)
    correctedSentence: string
    // Erros pontuais: trecho errado → trecho corrigido + explicação
    corrections: { wrong: string; correct: string; explanation: string }[]
    xp: number
}

// ─── Estilos e rótulos ───────────────────────────────────────────────────────

// Classes Tailwind do card de feedback indexadas pelo status
export const FEEDBACK_STYLES: Record<string, string> = {
    perfect: "bg-green-100 border border-[#86EFAC]",
    good: "bg-blue-100 border border-blue-200",
    partial: "bg-amber-100 border border-[#FCD34D]",
    needs_work: "bg-red-100 border border-[#FCA5A5]",
}

// Classes Tailwind do badge de dificuldade indexadas pelo nível
export const DIFFICULTY_STYLES: Record<string, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-600",
    hard: "bg-red-100 text-red-600",
}

// Rótulos em português para cada nível de dificuldade
export const DIFFICULTY_LABELS: Record<string, string> = {
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
}
