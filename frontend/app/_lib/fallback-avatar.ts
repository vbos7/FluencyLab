// Imagens de exemplo do shadcn/ui (public/avatars/01.png..05.png) usadas quando
// o perfil não tem foto própria nem GitHub vinculado. A escolha é determinística
// por id — o mesmo usuário sempre aparece com a mesma imagem em qualquer tela.
const FALLBACK_AVATAR_COUNT = 5

export function fallbackAvatarSrc(id: number): string {
    const index = (Math.abs(id) % FALLBACK_AVATAR_COUNT) + 1
    return `/avatars/${String(index).padStart(2, "0")}.png`
}
