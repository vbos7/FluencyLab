// Retorna uma função que extrai as iniciais de um nome (até 2 letras)
export function useInitials() {
    return function getInitials(name: string): string {
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word[0]?.toUpperCase() ?? '')
            .join('')
    }
}
