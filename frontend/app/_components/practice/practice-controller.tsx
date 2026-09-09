"use client"

import { apiClient } from "@/app/_lib/api"
import { Sparkles } from "lucide-react"
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
    isPremium: boolean
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

// Convidado pode fazer no máx. N questões (verificar OU pular) antes de logar.
// Deve casar com GUEST_MAX_ATTEMPTS no backend (check-answer.php), que é o teto real.
const GUEST_LIMIT = 5

export function PracticeController({ phrases, isPremium }: Props) {
    const [loading, setLoading] = useState(false)
    // Mensagem de erro exibida quando a correção pela IA falha (null = sem erro)
    const [error, setError] = useState<string | null>(null)
    // Dificuldade ativa — lida do localStorage na inicialização (padrão: "medium")
    const [difficulty, setDifficulty] = useState<string>(() => {
        if (typeof window === "undefined") return "medium"
        return localStorage.getItem("fluency-lab:difficulty") ?? "medium"
    })

    const [category, setCategory] = useState<string>(() => {
        if (typeof window === "undefined") return "all"
        return localStorage.getItem("fluency-lab:category") ?? "all"
    })

    const categories = Array.from(new Set(phrases.map((p) => p.category))).sort()

    const effectiveCategory = isPremium ? category : "all"

    

    // Frases filtradas pela dificuldade ativa
    const filteredPhrases = phrases.filter(
        (p) => p.difficulty === difficulty && (effectiveCategory === "all" || p.category === effectiveCategory)
    )

    const handleChangeCategory = (newCategory: string) => {
        if (!isPremium) return // trava extra de segurança, mesmo que o seletor já esteja escondido
        localStorage.setItem("fluency-lab:category", newCategory)
        setCategory(newCategory)
        const newFiltered = phrases.filter(
            (p) => p.difficulty === difficulty && (newCategory === "all" || p.category === newCategory)
        )
        setCurrentIndex(Math.floor(Math.random() * newFiltered.length))
        setAnswer("")
        setFeedback(null)
        setError(null)
        phraseStartRef.current = Date.now()
    }

    

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
    // Questões já consumidas pelo convidado (persistido p/ não zerar ao recarregar).
    const [guestUsed, setGuestUsed] = useState<number>(() => {
        if (typeof window === "undefined") return 0
        return Number(localStorage.getItem("fluency-lab:guest-count") ?? 0)
    })

    // Favoritos vêm do banco (por usuário), não mais do localStorage.
    // Começa vazio e é preenchido assim que a API responder (convidado não busca).
    const [favorites, setFavorites] = useState<number[]>([])
    // Dispara a animação de pop ao favoritar (reset automático em 300ms)
    const [justFavorited, setJustFavorited] = useState(false)
    // Referência direta ao textarea para dar foco programaticamente
    const inputRef = useRef<HTMLTextAreaElement>(null)
    // Momento em que a frase atual foi apresentada — usado para medir o tempo
    // gasto no exercício (enviado ao backend e somado no "tempo total de estudo")
    const phraseStartRef = useRef(Date.now())

    // Busca os favoritos reais do usuário logado assim que o componente monta
    useEffect(() => {
        if (isGuest) return
        apiClient
            .get("/favoritos.php")
            .then((res) => setFavorites(res.data.map((f: { id: number }) => f.id)))
            .catch(() => setFavorites([]))
    }, [isGuest])

    // Persiste a contagem do convidado (o backend continua sendo o teto de verdade)
    useEffect(() => {
        if (isGuest) localStorage.setItem("fluency-lab:guest-count", String(guestUsed))
    }, [isGuest, guestUsed])

    // Atalhos derivados do state atual
    const phrase = filteredPhrases[currentIndex]
    const isFav = phrase ? favorites.includes(phrase.id) : false
    const guestRemaining = Math.max(0, GUEST_LIMIT - guestUsed)
    // Bloqueia quando o convidado esgota o limite e não há feedback na tela — deixa
    // ele ver o resultado da última resposta antes do aviso de login.
    const guestBlocked = isGuest && guestUsed >= GUEST_LIMIT && feedback === null

    // Envia a resposta para a API corrigir com IA, adapta o feedback e exibe o toast de XP por 2s
    const handleVerify = async () => {
        if (!answer.trim() || !phrase) return
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
            // Convidado: cada verificação consome uma questão do limite
            if (isGuest) setGuestUsed((n) => n + 1)
        } catch (err) {
            // Backend recusou por limite de convidado (403) → força o aviso de login
            const status = (err as { response?: { status?: number } })?.response?.status
            if (isGuest && status === 403) {
                setGuestUsed(GUEST_LIMIT)
                return
            }
            console.error("Erro ao corrigir:", err)
            setError("Não foi possível corrigir sua tradução agora. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    // Avança para uma frase aleatória diferente da atual (dentro da dificuldade ativa)
    const handleNext = () => {
        // "Pular" (sem feedback na tela) também consome uma questão do convidado.
        // Já o "próxima" após responder não conta de novo (a verificação já contou).
        if (isGuest && feedback === null) setGuestUsed((n) => n + 1)

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
        const newFiltered = phrases.filter(
            (p) => p.difficulty === newDifficulty && (effectiveCategory === "all" || p.category === effectiveCategory)
        )
        setCurrentIndex(Math.floor(Math.random() * newFiltered.length))
        setAnswer("")
        setFeedback(null)
        setError(null)
        phraseStartRef.current = Date.now()
    }

    // Alterna o favorito no banco — atualização otimista (muda a tela antes
    // da resposta do servidor, desfaz se a requisição falhar)
    const toggleFavorite = async (id: number) => {
        const jaFavoritada = favorites.includes(id)

        if (!jaFavoritada) {
            // Aciona a animação de pop apenas ao favoritar (não ao desfavoritar)
            setJustFavorited(true)
            setTimeout(() => setJustFavorited(false), 300)
        }

        setFavorites((prev) => (jaFavoritada ? prev.filter((f) => f !== id) : [...prev, id]))

        try {
            if (jaFavoritada) {
                await apiClient.delete(`/favoritos.php?phrase_id=${id}`)
            } else {
                await apiClient.post("/favoritos.php", { phrase_id: id })
            }
        } catch {
            // Desfaz a mudança otimista se a requisição falhar
            setFavorites((prev) => (jaFavoritada ? [...prev, id] : prev.filter((f) => f !== id)))
        }
    }

    // Convidado esgotou as questões grátis → convida a criar conta / entrar.
    if (guestBlocked) {
        return (
            <div className="page-enter mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-20 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50">
                    <Sparkles className="size-8 text-blue-600" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                    Você usou suas {GUEST_LIMIT} questões grátis
                </h2>
                <p className="text-sm text-gray-500">
                    Crie uma conta grátis para praticar sem limite, salvar seu progresso e subir de
                    nível.
                </p>
                <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
                    <a
                        href="/register"
                        className="flex-1 rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Criar conta grátis
                    </a>
                    <a
                        href="/login"
                        className="flex-1 rounded-2xl border border-blue-200 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                    >
                        Entrar
                    </a>
                </div>
            </div>
        )
    }

    // Sem frases nessa dificuldade (ex: localStorage com valor antigo que não bate
    // com nenhuma frase retornada pelo servidor) — evita crash acessando phrase.id
    if (!phrase) {
        return (
            <div className="page-enter mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-20 text-center">
                <p className="text-sm text-gray-500">
                    Nenhuma frase disponível para esta dificuldade no momento.
                </p>
                <button
                    onClick={() => handleChangeDifficulty("medium")}
                    className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Tentar dificuldade Médio
                </button>
            </div>
        )
    }

    return (
        <div className="page-enter mx-auto max-w-5xl bg-white px-5 pt-10 pb-28">
            {/* Região aria-live sempre presente no DOM — screen readers anunciam ao receber texto */}
            <div role="status" aria-live="assertive" aria-atomic="true" className="sr-only">
                {srAnnouncement}
            </div>

            <XpToast earnedXp={earnedXp} visible={showXpToast} />
            <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />

            {isGuest && (
                <p className="mx-auto mb-4 w-fit rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
                    Modo convidado — {guestRemaining} de {GUEST_LIMIT} questões restantes
                </p>
            )}

            <PracticeHeader
            difficulty={difficulty}
            onChangeDifficulty={handleChangeDifficulty}
            category={effectiveCategory}
            onChangeCategory={handleChangeCategory}
            categories={categories}
            isPremium={isPremium}
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