import Link from "next/link"
import NavLayout from "../_layouts/nav-layout"
import { Languages, LibraryBig, Timer } from "lucide-react"
import { Icon } from "../_components/admin/icon"
import { fetchFromApi } from "@/app/_lib/server-api"

type Course = {
    id: number
    slug: string
    title: string
    description: string
    level: string
    total_lessons: number
}

export default async function CursosPage() {
    const courses = await fetchFromApi<Course[]>("/courses.php")

    return (
        <NavLayout>
            <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-20">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="mb-8 inline-flex items-center gap-3 rounded-3xl border border-gray-200 bg-white/80 px-6 py-3 shadow-xl backdrop-blur-sm">
                            <h1 className="animate-float bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-4xl font-bold text-blue-600 text-transparent md:text-5xl">
                                Nossos Cursos
                            </h1>
                        </div>
                        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
                            Escolha seu nível e comece sua jornada rumo à fluência no inglês. <br />
                            <span className="font-semibold text-blue-600">
                                {" "}
                                Aulas práticas e eficazes.
                            </span>
                        </p>
                    </div>

                    {/* Cards HORIZONTAIS empilhados */}
                    <div className="mx-auto max-w-5xl space-y-8">
                        {courses.map((course) => (
                            <Link
                                key={course.slug}
                                href={`/cursos/${course.slug}`}
                                className="group block"
                            >
                                <div
                                    className={`rounded-3xl border bg-white p-8 hover:bg-blue-50 ${course.level} ${course.level} relative overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:border-blue-300 ${course.level} backdrop-blur-sm`}
                                >
                                    {/* Background gradient animado */}
                                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-5"></div>

                                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:gap-8">
                                        {/* Ícone grande */}
                                        <div
                                            className={`flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white/50 bg-gradient-to-br text-4xl text-black shadow-2xl transition-transform duration-500 group-hover:scale-110`}
                                        >
                                            <span>{course.id}</span>
                                        </div>

                                        {/* Conteúdo */}
                                        <div className="mt-6 flex-1 space-y-4 lg:mt-0">
                                            <div>
                                                <h2
                                                    className={`bg-gradient-to-r from-gray-900 bg-clip-text text-2xl font-bold text-transparent transition-transform duration-300 group-hover:translate-x-2 lg:text-3xl`}
                                                >
                                                    {course.title}
                                                </h2>
                                                <p className="mt-2 max-w-lg leading-relaxed text-gray-600">
                                                    {course.description}
                                                </p>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-700">
                                                        <LibraryBig size={16} />
                                                    </div>
                                                    <span>{course.total_lessons} aulas</span>
                                                </div>
                                                <div className="hidden items-center gap-2 text-sm text-gray-500 lg:flex">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold">
                                                        <Timer size={16} />
                                                    </div>
                                                    <span>2-4 semanas</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA animado */}
                                    <div className="mt-8 border-t border-gray-100 pt-6">
                                        <div className="flex items-center justify-between transition-all duration-300 group-hover:gap-4">
                                            <span className="text-sm font-medium text-gray-500">
                                                Começar agora
                                            </span>
                                            <div
                                                className={`inline-flex transform items-center gap-1 rounded-2xl bg-gradient-to-r px-3 py-2 text-sm font-semibold text-black shadow-lg transition-all duration-300 group-hover:translate-x-4 hover:scale-105 hover:text-blue-600 hover:shadow-xl`}
                                            >
                                                Acessar curso
                                                <span className="text-xl hover:text-blue-600">
                                                    →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </NavLayout>
    )
}
