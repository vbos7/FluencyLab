// Máscara de telefone brasileiro, aplicada enquanto o usuário digita.
// Celular: (99) 99999-9999 · Fixo: (99) 9999-9999. Ignora tudo que não for dígito.
export function maskPhone(value: string): string {
    const d = value.replace(/\D/g, "").slice(0, 11)

    if (d.length <= 2) return d.length ? `(${d}` : ""
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

// Inteiro não-negativo: descarta o sinal e qualquer não-dígito. Vazio permitido
// (pra o usuário conseguir limpar o campo). Bloqueia negativos em inputs numéricos.
export function onlyPositiveInt(value: string): string {
    return value.replace(/\D/g, "")
}

// Decimal não-negativo com um único ponto. Também bloqueia o sinal de menos.
export function onlyPositiveDecimal(value: string): string {
    const cleaned = value.replace(/[^0-9.]/g, "")
    const parts = cleaned.split(".")
    return parts.length <= 1 ? cleaned : `${parts[0]}.${parts.slice(1).join("")}`
}
