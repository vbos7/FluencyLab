"use client"

import { useState, useRef } from "react"
import { type Phrase, type Feedback, scoreAnswer, generateFeedback } from "@/app/_lib/practice"
import { XpToast } from "./xp-toast"
import { PracticeHeader } from "./practice-header"
import { PhraseCard } from "./phrase-card"
import { AnswerForm } from "./answer-form"
import { FeedbackCard } from "./feedback-card"

type Props = {
    // Lista completa de frases (já achatada) passada pelo server component
    phrases: Phrase[]
}

export function PracticeController({ phrases }: Props) {
    // Dificuldade ativa — lida do localStorage na inicialização (padrão: "medium")
    const [difficulty, setDifficulty] = useState<string>(() => {
        if (typeof window === "undefined") return "medium"
        return localStorage.getItem("fluency-lab:difficulty") ?? "medium"
    })

    // Frases filtradas pela dificuldade ativa
    const filteredPhrases = phrases.filter(p => p.difficulty === difficulty)

    // Índice da frase atual dentro de filteredPhrases — inicializado aleatoriamente
    const [currentIndex, setCurrentIndex] = useState(() => {
        const saved = typeof window !== "undefined"
            ? localStorage.getItem("fluency-lab:difficulty") ?? "medium"
            : "medium"
        const initial = phrases.filter(p => p.difficulty === saved)
        return Math.floor(Math.random() * initial.length)
    })

    // Texto digitado pelo usuário no textarea
    const [answer, setAnswer] = useState("")
    // Resultado da verificação; null enquanto o usuário ainda não verificou
    const [feedback, setFeedback] = useState<Feedback | null>(null)
    // Controla a visibilidade do toast de XP
    const [showXpToast, setShowXpToast] = useState(false)
    // Quantidade de XP exibida no toast após verificar
    const [earnedXp, setEarnedXp] = useState(0)
    // Lista de ids de frases favoritadas pelo usuário
    const [favorites, setFavorites] = useState<number[]>([])
    // Dispara a animação de pop ao favoritar (reset automático em 300ms)
    const [justFavorited, setJustFavorited] = useState(false)
    // Referência direta ao textarea para dar foco programaticamente
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Atalhos derivados do state atual
    const phrase = filteredPhrases[currentIndex]
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

    // Avança para uma frase aleatória diferente da atual (dentro da dificuldade ativa)
    const handleNext = () => {
        let next
        // Garante que a próxima frase seja diferente da atual (só se houver mais de uma)
        do { next = Math.floor(Math.random() * filteredPhrases.length) } while (next === currentIndex && filteredPhrases.length > 1)
        setCurrentIndex(next)
        setAnswer("")
        setFeedback(null)
        // Pequeno delay para o textarea já estar visível antes de focar
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    // Troca a dificuldade ativa, persiste no localStorage e sorteia nova frase
    const handleChangeDifficulty = (newDifficulty: string) => {
        localStorage.setItem("fluency-lab:difficulty", newDifficulty)
        setDifficulty(newDifficulty)
        const newFiltered = phrases.filter(p => p.difficulty === newDifficulty)
        setCurrentIndex(Math.floor(Math.random() * newFiltered.length))
        setAnswer("")
        setFeedback(null)
    }

    // Alterna o favorito: remove se já existe, adiciona se não existe
    const toggleFavorite = (id: number) => {
        if (!favorites.includes(id)) {
            // Aciona a animação de pop apenas ao favoritar (não ao desfavoritar)
            setJustFavorited(true)
            setTimeout(() => setJustFavorited(false), 300)
        }
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
    }

    return (
        <div className="mx-auto bg-white px-5 pt-10 pb-28">
            <XpToast earnedXp={earnedXp} visible={showXpToast} />

            <PracticeHeader
                difficulty={difficulty}
                onChangeDifficulty={handleChangeDifficulty}
                isFav={isFav}
                justFavorited={justFavorited}
                onToggleFavorite={() => toggleFavorite(phrase.id)}
            />

            <PhraseCard phrase={phrase} />

            {!feedback && (
                <AnswerForm
                    answer={answer}
                    onChange={setAnswer}
                    onVerify={handleVerify}
                    onSkip={handleNext}
                    inputRef={inputRef}
                />
            )}

            {feedback && (
                <FeedbackCard
                    feedback={feedback}
                    answer={answer}
                    onNext={handleNext}
                />
            )}
        </div>
    )
}
