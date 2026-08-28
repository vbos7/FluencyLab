// Contratos de usuário compartilhados entre server e client components.
// Ficam aqui (e não inline em cada .tsx) porque descrevem respostas da API
// consumidas em vários lugares.

// Usuário de sessão (forma mínima) usado pela navegação (top-nav, bottom-nav,
// curso). Vem de /profile.php, mas só os campos necessários para a navegação.
export type LoggedUser = {
    id: number
    name: string
    email: string
    role: string
}

// Perfil completo — resposta de GET /profile.php.
export type UserProfile = {
    id: number
    name: string
    email: string
    phone: string | null
    role: string
    avatar: string | null
    created_at: string
}
