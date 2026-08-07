// ─── Tipos ───────────────────────────────────────────────────────────────────

export type Phrase = {
    id: number
    pt: string
    en: string
    difficulty: string
    category: string
}

// Formato do objeto de feedback retornado após a verificação
export type Feedback = {
    status: "perfect" | "good" | "partial" | "needs_work"
    title: string
    message: string
    corrections: { wrong: string; correct: string; explanation: string }[]
    xp: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Calcula a distância de edição (Levenshtein) entre duas strings:
// quantas operações (inserção, deleção, substituição) são necessárias
// para transformar 'a' em 'b'. Usa programação dinâmica com matriz dp[m+1][n+1].
export function levenshtein(a: string, b: string): number {
    const m = a.length,
        n = b.length
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] =
                a[i - 1] === b[j - 1]
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]
}

// Normaliza as duas respostas e converte a distância de edição num score de 0 a 100.
// Fórmula: score = (1 - distância / tamanho_da_maior_string) × 100
export function scoreAnswer(userAns: string, correctAns: string): number {
    const u = userAns
        .toLowerCase()
        .trim()
        .replace(/[.,!?]/g, "")
    const c = correctAns
        .toLowerCase()
        .trim()
        .replace(/[.,!?]/g, "")
    if (u === c) return 100
    const dist = levenshtein(u, c)
    return Math.max(0, Math.round((1 - dist / Math.max(u.length, c.length)) * 100))
}

// Transforma o score numérico em feedback qualitativo com XP e correções:
//   ≥ 95 → perfeito     (+25 XP)
//   ≥ 70 → bom          (+15 XP)
//   ≥ 40 → parcial      (+8 XP)
//   < 40 → insuficiente (+3 XP)
export function generateFeedback(userAns: string, phraseEn: string, score: number): Feedback {
    if (score >= 95) {
        return {
            status: "perfect",
            title: "Perfeito! 🎉",
            message: "Sua tradução está excelente!",
            corrections: [],
            xp: 25,
        }
    }
    if (score >= 70) {
        return {
            status: "good",
            title: "Quase lá! 👏",
            message: "Sua tradução está boa, mas pode melhorar em alguns pontos.",
            corrections: [
                {
                    wrong: userAns,
                    correct: phraseEn,
                    explanation: "A tradução esperada usa uma estrutura ligeiramente diferente.",
                },
            ],
            xp: 15,
        }
    }
    if (score >= 40) {
        return {
            status: "partial",
            title: "Bom esforço! 💪",
            message: "Você captou a ideia principal, mas há diferenças significativas.",
            corrections: [
                {
                    wrong: userAns,
                    correct: phraseEn,
                    explanation: "Revise a estrutura gramatical e o vocabulário utilizado.",
                },
            ],
            xp: 8,
        }
    }
    return {
        status: "needs_work",
        title: "Continue praticando! 📖",
        message: "A tradução precisa de mais atenção. Veja a resposta correta abaixo.",
        corrections: [
            {
                wrong: userAns,
                correct: phraseEn,
                explanation: "Tente prestar atenção na estrutura da frase e nas palavras-chave.",
            },
        ],
        xp: 3,
    }
}

// ─── Constantes de estilo ─────────────────────────────────────────────────────

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

// ─── Dados ───────────────────────────────────────────────────────────────────

export const FRASES = [
    [
        {
            id: 1,
            pt: "Eu sou bonito",
            en: "I'm beautiful",
            difficulty: "easy",
            category: "Cotidiano",
        },
        {
            id: 2,
            pt: "Eu estou feliz",
            en: "I am happy",
            difficulty: "easy",
            category: "Cotidiano",
        },
        {
            id: 3,
            pt: "Eu estou cansado",
            en: "I am tired",
            difficulty: "easy",
            category: "Cotidiano",
        },
        {
            id: 4,
            pt: "Eu acordo cedo todos os dias",
            en: "I wake up early every day",
            difficulty: "medium",
            category: "Cotidiano",
        },
        {
            id: 5,
            pt: "Eu gosto de ouvir música",
            en: "I like listening to music",
            difficulty: "medium",
            category: "Cotidiano",
        },
        {
            id: 6,
            pt: "Eu moro com minha família",
            en: "I live with my family",
            difficulty: "medium",
            category: "Cotidiano",
        },
        {
            id: 7,
            pt: "Eu tento melhorar um pouco a cada dia",
            en: "I try to improve a little every day",
            difficulty: "hard",
            category: "Cotidiano",
        },
        {
            id: 8,
            pt: "Às vezes eu prefiro ficar em casa",
            en: "Sometimes I prefer to stay at home",
            difficulty: "hard",
            category: "Cotidiano",
        },
        {
            id: 9,
            pt: "Eu sempre procuro aprender coisas novas",
            en: "I always try to learn new things",
            difficulty: "hard",
            category: "Cotidiano",
        },
        {
            id: 10,
            pt: "Minha rotina muda dependendo do dia",
            en: "My routine changes depending on the day",
            difficulty: "hard",
            category: "Cotidiano",
        },

        {
            id: 11,
            pt: "Eu estou no trabalho",
            en: "I am at work",
            difficulty: "easy",
            category: "Trabalho",
        },
        {
            id: 12,
            pt: "Eu começo às oito",
            en: "I start at eight",
            difficulty: "easy",
            category: "Trabalho",
        },
        {
            id: 13,
            pt: "Eu gosto do meu trabalho",
            en: "I like my job",
            difficulty: "easy",
            category: "Trabalho",
        },
        {
            id: 14,
            pt: "Eu preciso terminar este relatório",
            en: "I need to finish this report",
            difficulty: "medium",
            category: "Trabalho",
        },
        {
            id: 15,
            pt: "A reunião começa em dez minutos",
            en: "The meeting starts in ten minutes",
            difficulty: "medium",
            category: "Trabalho",
        },
        {
            id: 16,
            pt: "Nós estamos trabalhando em um novo projeto",
            en: "We are working on a new project",
            difficulty: "medium",
            category: "Trabalho",
        },
        {
            id: 17,
            pt: "Este projeto exige muita atenção",
            en: "This project requires a lot of attention",
            difficulty: "hard",
            category: "Trabalho",
        },
        {
            id: 18,
            pt: "Precisamos melhorar nossa comunicação",
            en: "We need to improve our communication",
            difficulty: "hard",
            category: "Trabalho",
        },
        {
            id: 19,
            pt: "O prazo final é no final da semana",
            en: "The deadline is at the end of the week",
            difficulty: "hard",
            category: "Trabalho",
        },
        {
            id: 20,
            pt: "Estamos analisando novas estratégias",
            en: "We are analyzing new strategies",
            difficulty: "hard",
            category: "Trabalho",
        },

        {
            id: 21,
            pt: "Onde fica o aeroporto?",
            en: "Where is the airport?",
            difficulty: "easy",
            category: "Viagem",
        },
        {
            id: 22,
            pt: "Eu preciso de um táxi",
            en: "I need a taxi",
            difficulty: "easy",
            category: "Viagem",
        },
        {
            id: 23,
            pt: "Meu voo sai hoje",
            en: "My flight leaves today",
            difficulty: "easy",
            category: "Viagem",
        },
        {
            id: 24,
            pt: "Eu tenho uma reserva no hotel",
            en: "I have a reservation at the hotel",
            difficulty: "medium",
            category: "Viagem",
        },
        {
            id: 25,
            pt: "Quanto custa esta passagem?",
            en: "How much is this ticket?",
            difficulty: "medium",
            category: "Viagem",
        },
        {
            id: 26,
            pt: "O voo está atrasado",
            en: "The flight is delayed",
            difficulty: "medium",
            category: "Viagem",
        },
        {
            id: 27,
            pt: "Eu perdi minha bagagem no aeroporto",
            en: "I lost my luggage at the airport",
            difficulty: "hard",
            category: "Viagem",
        },
        {
            id: 28,
            pt: "Este é meu primeiro voo internacional",
            en: "This is my first international flight",
            difficulty: "hard",
            category: "Viagem",
        },
        {
            id: 29,
            pt: "Preciso confirmar minha reserva",
            en: "I need to confirm my reservation",
            difficulty: "hard",
            category: "Viagem",
        },
        {
            id: 30,
            pt: "Estamos esperando o embarque começar",
            en: "We are waiting for boarding to start",
            difficulty: "hard",
            category: "Viagem",
        },

        {
            id: 31,
            pt: "Eu quero água",
            en: "I want water",
            difficulty: "easy",
            category: "Restaurante",
        },
        {
            id: 32,
            pt: "O cardápio por favor",
            en: "The menu please",
            difficulty: "easy",
            category: "Restaurante",
        },
        {
            id: 33,
            pt: "A conta por favor",
            en: "The bill please",
            difficulty: "easy",
            category: "Restaurante",
        },
        {
            id: 34,
            pt: "Eu gostaria de um café",
            en: "I would like a coffee",
            difficulty: "medium",
            category: "Restaurante",
        },
        {
            id: 35,
            pt: "Este prato é muito bom",
            en: "This dish is very good",
            difficulty: "medium",
            category: "Restaurante",
        },
        {
            id: 36,
            pt: "Você tem sobremesa?",
            en: "Do you have dessert?",
            difficulty: "medium",
            category: "Restaurante",
        },
        {
            id: 37,
            pt: "Este restaurante é muito famoso",
            en: "This restaurant is very famous",
            difficulty: "hard",
            category: "Restaurante",
        },
        {
            id: 38,
            pt: "Eu gostaria de experimentar algo novo",
            en: "I would like to try something new",
            difficulty: "hard",
            category: "Restaurante",
        },
        {
            id: 39,
            pt: "A comida demorou um pouco",
            en: "The food took a while",
            difficulty: "hard",
            category: "Restaurante",
        },
        {
            id: 40,
            pt: "Você pode recomendar um prato?",
            en: "Can you recommend a dish?",
            difficulty: "hard",
            category: "Restaurante",
        },

        {
            id: 41,
            pt: "Eu estudo inglês",
            en: "I study English",
            difficulty: "easy",
            category: "Estudo",
        },
        {
            id: 42,
            pt: "Eu tenho uma prova",
            en: "I have a test",
            difficulty: "easy",
            category: "Estudo",
        },
        {
            id: 43,
            pt: "Eu gosto de aprender",
            en: "I like learning",
            difficulty: "easy",
            category: "Estudo",
        },
        {
            id: 44,
            pt: "Eu estou estudando para a prova",
            en: "I am studying for the test",
            difficulty: "medium",
            category: "Estudo",
        },
        {
            id: 45,
            pt: "Eu preciso ler este livro",
            en: "I need to read this book",
            difficulty: "medium",
            category: "Estudo",
        },
        {
            id: 46,
            pt: "A aula começa agora",
            en: "The class starts now",
            difficulty: "medium",
            category: "Estudo",
        },
        {
            id: 47,
            pt: "Eu aprendi algo novo hoje",
            en: "I learned something new today",
            difficulty: "hard",
            category: "Estudo",
        },
        {
            id: 48,
            pt: "Este exercício é um pouco difícil",
            en: "This exercise is a little difficult",
            difficulty: "hard",
            category: "Estudo",
        },
        {
            id: 49,
            pt: "Eu preciso praticar todos os dias",
            en: "I need to practice every day",
            difficulty: "hard",
            category: "Estudo",
        },
        {
            id: 50,
            pt: "Estudar idiomas abre muitas portas",
            en: "Studying languages opens many doors",
            difficulty: "hard",
            category: "Estudo",
        },

        {
            id: 51,
            pt: "Meu celular acabou a bateria",
            en: "My phone died",
            difficulty: "easy",
            category: "Tecnologia",
        },
        {
            id: 52,
            pt: "A internet caiu",
            en: "The internet is down",
            difficulty: "easy",
            category: "Tecnologia",
        },
        {
            id: 53,
            pt: "Meu computador está lento",
            en: "My computer is slow",
            difficulty: "easy",
            category: "Tecnologia",
        },
        {
            id: 54,
            pt: "Eu esqueci minha senha",
            en: "I forgot my password",
            difficulty: "medium",
            category: "Tecnologia",
        },
        {
            id: 55,
            pt: "O aplicativo não abre",
            en: "The app won't open",
            difficulty: "medium",
            category: "Tecnologia",
        },
        {
            id: 56,
            pt: "Eu preciso atualizar o sistema",
            en: "I need to update the system",
            difficulty: "medium",
            category: "Tecnologia",
        },
        {
            id: 57,
            pt: "Este site está fora do ar",
            en: "This website is down",
            difficulty: "hard",
            category: "Tecnologia",
        },
        {
            id: 58,
            pt: "Eu preciso reiniciar o computador",
            en: "I need to restart the computer",
            difficulty: "hard",
            category: "Tecnologia",
        },
        {
            id: 59,
            pt: "Eu baixei um arquivo grande",
            en: "I downloaded a large file",
            difficulty: "hard",
            category: "Tecnologia",
        },
        {
            id: 60,
            pt: "Estamos testando uma nova ferramenta",
            en: "We are testing a new tool",
            difficulty: "hard",
            category: "Tecnologia",
        },

        { id: 61, pt: "Eu estou doente", en: "I am sick", difficulty: "easy", category: "Saúde" },
        {
            id: 62,
            pt: "Eu tenho febre",
            en: "I have a fever",
            difficulty: "easy",
            category: "Saúde",
        },
        {
            id: 63,
            pt: "Eu tenho dor de cabeça",
            en: "I have a headache",
            difficulty: "easy",
            category: "Saúde",
        },
        {
            id: 64,
            pt: "Eu preciso descansar",
            en: "I need to rest",
            difficulty: "medium",
            category: "Saúde",
        },
        {
            id: 65,
            pt: "Eu estou me sentindo melhor",
            en: "I am feeling better",
            difficulty: "medium",
            category: "Saúde",
        },
        {
            id: 66,
            pt: "Eu preciso de um médico",
            en: "I need a doctor",
            difficulty: "medium",
            category: "Saúde",
        },
        {
            id: 67,
            pt: "Eu marquei uma consulta",
            en: "I scheduled an appointment",
            difficulty: "hard",
            category: "Saúde",
        },
        {
            id: 68,
            pt: "Eu preciso tomar este remédio",
            en: "I need to take this medicine",
            difficulty: "hard",
            category: "Saúde",
        },
        {
            id: 69,
            pt: "Estou tentando cuidar melhor da minha saúde",
            en: "I am trying to take better care of my health",
            difficulty: "hard",
            category: "Saúde",
        },
        {
            id: 70,
            pt: "Exercício físico é importante",
            en: "Physical exercise is important",
            difficulty: "hard",
            category: "Saúde",
        },

        {
            id: 71,
            pt: "Quanto custa isso?",
            en: "How much is this?",
            difficulty: "easy",
            category: "Compras",
        },
        {
            id: 72,
            pt: "Eu quero comprar isso",
            en: "I want to buy this",
            difficulty: "easy",
            category: "Compras",
        },
        {
            id: 73,
            pt: "Você aceita cartão?",
            en: "Do you accept card?",
            difficulty: "easy",
            category: "Compras",
        },
        {
            id: 74,
            pt: "Tem desconto?",
            en: "Is there a discount?",
            difficulty: "medium",
            category: "Compras",
        },
        {
            id: 75,
            pt: "Eu estou apenas olhando",
            en: "I am just looking",
            difficulty: "medium",
            category: "Compras",
        },
        {
            id: 76,
            pt: "Você tem outro tamanho?",
            en: "Do you have another size?",
            difficulty: "medium",
            category: "Compras",
        },
        {
            id: 77,
            pt: "Eu gostaria de experimentar isso",
            en: "I would like to try this",
            difficulty: "hard",
            category: "Compras",
        },
        {
            id: 78,
            pt: "Este produto parece muito bom",
            en: "This product looks very good",
            difficulty: "hard",
            category: "Compras",
        },
        {
            id: 79,
            pt: "Estou comparando os preços",
            en: "I am comparing prices",
            difficulty: "hard",
            category: "Compras",
        },
        {
            id: 80,
            pt: "Eu volto depois para comprar",
            en: "I will come back later to buy it",
            difficulty: "hard",
            category: "Compras",
        },

        { id: 81, pt: "Eu estou feliz", en: "I am happy", difficulty: "easy", category: "Emoções" },
        { id: 82, pt: "Eu estou triste", en: "I am sad", difficulty: "easy", category: "Emoções" },
        {
            id: 83,
            pt: "Eu estou nervoso",
            en: "I am nervous",
            difficulty: "easy",
            category: "Emoções",
        },
        {
            id: 84,
            pt: "Eu estou animado",
            en: "I am excited",
            difficulty: "medium",
            category: "Emoções",
        },
        {
            id: 85,
            pt: "Eu estou preocupado",
            en: "I am worried",
            difficulty: "medium",
            category: "Emoções",
        },
        {
            id: 86,
            pt: "Eu estou relaxado",
            en: "I am relaxed",
            difficulty: "medium",
            category: "Emoções",
        },
        {
            id: 87,
            pt: "Eu estou muito motivado hoje",
            en: "I am very motivated today",
            difficulty: "hard",
            category: "Emoções",
        },
        {
            id: 88,
            pt: "Estou tentando manter a calma",
            en: "I am trying to stay calm",
            difficulty: "hard",
            category: "Emoções",
        },
        {
            id: 89,
            pt: "Às vezes eu me sinto perdido",
            en: "Sometimes I feel lost",
            difficulty: "hard",
            category: "Emoções",
        },
        {
            id: 90,
            pt: "Eu estou aprendendo a controlar minhas emoções",
            en: "I am learning to control my emotions",
            difficulty: "hard",
            category: "Emoções",
        },

        { id: 91, pt: "Me ajude", en: "Help me", difficulty: "easy", category: "Emergência" },
        {
            id: 92,
            pt: "Chame a polícia",
            en: "Call the police",
            difficulty: "easy",
            category: "Emergência",
        },
        {
            id: 93,
            pt: "Chame uma ambulância",
            en: "Call an ambulance",
            difficulty: "easy",
            category: "Emergência",
        },
        {
            id: 94,
            pt: "Eu preciso de ajuda agora",
            en: "I need help now",
            difficulty: "medium",
            category: "Emergência",
        },
        {
            id: 95,
            pt: "Alguém está ferido",
            en: "Someone is injured",
            difficulty: "medium",
            category: "Emergência",
        },
        {
            id: 96,
            pt: "Há um incêndio",
            en: "There is a fire",
            difficulty: "medium",
            category: "Emergência",
        },
        {
            id: 97,
            pt: "Eu perdi meus documentos",
            en: "I lost my documents",
            difficulty: "hard",
            category: "Emergência",
        },
        {
            id: 98,
            pt: "Meu carro quebrou na estrada",
            en: "My car broke down on the road",
            difficulty: "hard",
            category: "Emergência",
        },
        {
            id: 99,
            pt: "Eu preciso falar com um policial",
            en: "I need to speak to a police officer",
            difficulty: "hard",
            category: "Emergência",
        },
        {
            id: 100,
            pt: "Por favor me ajude imediatamente",
            en: "Please help me immediately",
            difficulty: "hard",
            category: "Emergência",
        },
    ],
]
