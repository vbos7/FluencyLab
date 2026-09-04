"use client"

import { apiClient } from "@/app/_lib/api"
import { useState, useRef, useEffect } from "react"
import { type Phrase, type Feedback } from "@/app/_lib/practice"
import { XpToast } from "./xp-toast"
import { LevelUpModal } from "./level-up-modal"
import { PracticeHeader } from "./practice-header"
import { PhraseCard } from "./phrase-card"
import { AnswerForm } from "./answer-form"
import { FeedbackCard } from "./feedback-card"

type Props = {
    // Lista de frases carregada da API pelo server component (page.tsx)
    phrases: Phrase[]
}

type AiFeedback = {
    is_correct: boolean
    score: number
    overall_comment: string
    mistakes: { type: string; original: string; suggestion: string; explanation_pt: string }[]
    corrected_sentence: string
    positive_points: string[]
}

function adaptAiFeedback(ai: AiFeedback, xp: number): Feedback {
    const status =
        ai.score >= 95
            ? "perfect"
            : ai.score >= 70
              ? "good"
              : ai.score >= 40
                ? "partial"
                : "needs_work"
    const titles = {
        perfect: "Perfeito!",
        good: "Muito bem!",
        partial: "Quase lá!",
        needs_work: "Continue praticando",
    }
    return {
        status,
        title: titles[status],
        message: ai.overall_comment,
        corrections: ai.mistakes.map((m) => ({
            wrong: m.original,
            correct: m.suggestion,
            explanation: m.explanation_pt,
        })),
        xp,
    }
}

export function PracticeController({ phrases }: Props) {
    const [loading, setLoading] = useState(false)
    // Mensagem de erro exibida quando a correção pela IA falha (null = sem erro)
    const [error, setError] = useState<string | null>(null)
    // Dificuldade ativa — lida do localStorage na inicialização (padrão: "medium")
    const [difficulty, setDifficulty] = useState<string>(() => {
        if (typeof window === "undefined") return "medium"
        return localStorage.getItem("fluency-lab:difficulty") ?? "medium"
    })

    // Frases filtradas pela dificuldade ativa
    const filteredPhrases = phrases.filter((p) => p.difficulty === difficulty)

    // Índice da frase atual dentro de filteredPhrases — inicializado aleatoriamente
    const [currentIndex, setCurrentIndex] = useState(() => {
        const saved =
            typeof window !== "undefined"
                ? (localStorage.getItem("fluency-lab:difficulty") ?? "medium")
                : "medium"
        const initial = phrases.filter((p) => p.difficulty === saved)
        return Math.floor(Math.random() * initial.length)
    })

    // Texto digitado pelo usuário no textarea
    const [answer, setAnswer] = useState("")
    // Resultado da verificação; null enquanto o usuário ainda não verificou
    const [feedback, setFeedback] = useState<Feedback | null>(null)
    // Texto lido pelo screen reader ao verificar (região aria-live sempre presente no DOM)
    const [srAnnouncement, setSrAnnouncement] = useState("")
    // Controla a visibilidade do toast de XP
    const [showXpToast, setShowXpToast] = useState(false)
    // Quantidade de XP exibida no toast após verificar
    const [earnedXp, setEarnedXp] = useState(0)
    // Nível recém-alcançado quando a tentativa faz o aluno subir de nível
    // (null = sem comemoração pendente). Vem do `leveled_up` do backend.
    const [levelUp, setLevelUp] = useState<number | null>(null)
    // Modo convidado — lido do localStorage na inicialização
    const [isGuest] = useState(() => {
        if (typeof window === "undefined") return false
        return localStorage.getItem("fluency-lab:mode") === "guest"
    })

    // Lista de ids de frases favoritadas pelo usuário — inicializada do localStorage
    const [favorites, setFavorites] = useState<number[]>(() => {
        if (typeof window === "undefined") return []
        try {
            return JSON.parse(localStorage.getItem("fluency-lab:favorites") ?? "[]")
        } catch {
            return []
        }
    })
    // Dispara a animação de pop ao favoritar (reset automático em 300ms)
    const [justFavorited, setJustFavorited] = useState(false)
    // Referência direta ao textarea para dar foco programaticamente
    const inputRef = useRef<HTMLTextAreaElement>(null)
    // Momento em que a frase atual foi apresentada — usado para medir o tempo
    // gasto no exercício (enviado ao backend e somado no "tempo total de estudo")
    const phraseStartRef = useRef(Date.now())

    // Sincroniza favorites com localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem("fluency-lab:favorites", JSON.stringify(favorites))
    }, [favorites])

    // Atalhos derivados do state atual
    const phrase = filteredPhrases[currentIndex]
    const isFav = favorites.includes(phrase.id)

    // Envia a resposta para a API corrigir com IA, adapta o feedback e exibe o toast de XP por 2s
    const handleVerify = async () => {
        if (!answer.trim()) return
        setLoading(true)
        setError(null)

        try {
            // Segundos entre a frase aparecer e o clique em "Verificar"
            const timeSpent = Math.round((Date.now() - phraseStartRef.current) / 1000)
            const response = await apiClient.post("/practice/check-answer.php", {
                phrase_id: phrase.id,
                answer,
                time_spent_seconds: timeSpent,
            })
            const fb = adaptAiFeedback(response.data.feedback, response.data.xp_earned)
            setFeedback(fb)
            // Anuncia o resultado para leitores de tela (a região aria-live já está no DOM)
            setSrAnnouncement(`${fb.title} ${fb.message}`)
            setEarnedXp(fb.xp)
            setShowXpToast(true)
            setTimeout(() => setShowXpToast(false), 2000)
            // Subiu de nível nesta tentativa → dispara a comemoração
            if (response.data.leveled_up) {
                setLevelUp(response.data.level)
            }
        } catch (err) {
            console.error("Erro ao corrigir:", err)
            setError("Não foi possível corrigir sua tradução agora. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    // Avança para uma frase aleatória diferente da atual (dentro da dificuldade ativa)
    const handleNext = () => {
        let next
        // Garante que a próxima frase seja diferente da atual (só se houver mais de uma)
        do {
            next = Math.floor(Math.random() * filteredPhrases.length)
        } while (next === currentIndex && filteredPhrases.length > 1)
        setCurrentIndex(next)
        setAnswer("")
        setFeedback(null)
        setError(null)
        phraseStartRef.current = Date.now() // reinicia o cronômetro para a nova frase
        // Pequeno delay para o textarea já estar visível antes de focar
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    // Troca a dificuldade ativa, persiste no localStorage e sorteia nova frase
    const handleChangeDifficulty = (newDifficulty: string) => {
        localStorage.setItem("fluency-lab:difficulty", newDifficulty)
        setDifficulty(newDifficulty)
        const newFiltered = phrases.filter((p) => p.difficulty === newDifficulty)
        setCurrentIndex(Math.floor(Math.random() * newFiltered.length))
        setAnswer("")
        setFeedback(null)
        setError(null)
        phraseStartRef.current = Date.now() // reinicia o cronômetro para a nova frase
    }

    // Alterna o favorito: remove se já existe, adiciona se não existe
    const toggleFavorite = (id: number) => {
        if (!favorites.includes(id)) {
            // Aciona a animação de pop apenas ao favoritar (não ao desfavoritar)
            setJustFavorited(true)
            setTimeout(() => setJustFavorited(false), 300)
        }
        setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
    }

    return (
        <div className="page-enter mx-auto max-w-5xl bg-white px-5 pt-10 pb-28">
            {/* Região aria-live sempre presente no DOM — screen readers anunciam ao receber texto */}
            <div role="status" aria-live="assertive" aria-atomic="true" className="sr-only">
                {srAnnouncement}
            </div>

            <XpToast earnedXp={earnedXp} visible={showXpToast} />
            <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />

            <PracticeHeader
                difficulty={difficulty}
                onChangeDifficulty={handleChangeDifficulty}
                isFav={isFav}
                justFavorited={justFavorited}
                onToggleFavorite={() => toggleFavorite(phrase.id)}
                showFavorite={!isGuest}
            />

            <PhraseCard phrase={phrase} />

            {!feedback && (
                <AnswerForm
                    loading={loading}
                    answer={answer}
                    onChange={setAnswer}
                    onVerify={handleVerify}
                    onSkip={handleNext}
                    inputRef={inputRef}
                />
            )}

            {/* Erro da correção — role="alert" faz o screen reader anunciar automaticamente */}
            {error && !feedback && (
                <p
                    role="alert"
                    className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-3.5 text-sm font-medium text-red-700"
                >
                    {error}
                </p>
            )}

            {feedback && <FeedbackCard feedback={feedback} answer={answer} onNext={handleNext} />}
        </div>
    )
}
