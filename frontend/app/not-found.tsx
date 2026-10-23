import Link from "next/link"

// 404 padrão do app (o do Next vem em inglês).
export default function NotFound() {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-6 text-center"
        >
            <p className="text-6xl font-black text-blue-600">404</p>
            <h1 className="text-xl font-bold text-slate-900">Página não encontrada</h1>
            <p className="max-w-sm text-sm text-slate-500">
                O endereço pode ter mudado ou não existe mais.
            </p>
            <Link
                href="/"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                Voltar ao início
            </Link>
        </main>
    )
}
