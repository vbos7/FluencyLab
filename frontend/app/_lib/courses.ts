// Contratos de curso compartilhados entre a página (server) e o client component.
// Resposta de GET /courses.php?slug=...

export type Lesson = {
    id: number
    title: string
    duration: number
    youtube_id: string | null // pode vir null quando a aula está trancada
    order_num: number
    is_free: boolean
    locked: boolean
}

export type CourseDetail = {
    id: number
    slug: string
    title: string
    description: string
    level: string
    lessons: Lesson[]
    user_has_premium: boolean
}

// Comentário de uma aula (GET/POST em /comments.php).
export type Comment = {
    id: number
    content: string
    user_id: number
    user_name: string
    created_at: string
}
