"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/app/_layouts/app-layout"
import { type BreadcrumbItem, cn } from "@/app/_lib/utils"
import { type AdminCourse, COURSE_LEVEL_LABELS } from "@/app/_lib/admin"
import { apiErrorMessage, deleteCourse, listCourses } from "@/app/_lib/admin-api"
import { CardContainer } from "@/app/_components/admin/profile/card-container"
import { Button } from "@/app/_components/ui/button"
import { CourseFormDialog } from "@/app/_components/admin/courses/course-form-dialog"
import { ConfirmDialog } from "@/app/_components/admin/confirm-dialog"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Cursos", href: "/admin/cursos" },
]

export default function CursosPage() {
    const [courses, setCourses] = useState<AdminCourse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<AdminCourse | null>(null)
    const [toDelete, setToDelete] = useState<AdminCourse | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            setCourses(await listCourses())
        } catch (err) {
            setError(apiErrorMessage(err, "Não foi possível carregar os cursos."))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    function openCreate() {
        setEditing(null)
        setFormOpen(true)
    }

    function openEdit(course: AdminCourse) {
        setEditing(course)
        setFormOpen(true)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 md:p-10">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Cursos</h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            {loading ? "Carregando…" : `${courses.length} cursos cadastrados`}
                        </p>
                    </div>
                    <Button className="shrink-0" onClick={openCreate}>
                        + Novo curso
                    </Button>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <CardContainer title="Todos os cursos">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 bg-slate-50 text-xs tracking-wide text-slate-600 uppercase dark:border-white/8 dark:bg-white/3">
                                    <th className="px-5 py-3 text-left">Curso</th>
                                    <th className="px-5 py-3 text-left">Nível</th>
                                    <th className="px-5 py-3 text-right">Aulas</th>
                                    <th className="px-5 py-3 text-right">Ordem</th>
                                    <th className="px-5 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && courses.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                                            Nenhum curso cadastrado.
                                        </td>
                                    </tr>
                                )}
                                {courses.map((course, i) => (
                                    <tr
                                        key={course.id}
                                        className={cn(
                                            "border-b border-neutral-100 transition-colors hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/3",
                                            i === courses.length - 1 && "border-b-0"
                                        )}
                                    >
                                        <td className="px-5 py-3">
                                            <div className="font-medium text-slate-800">{course.title}</div>
                                            <div className="text-xs text-slate-400">/{course.slug}</div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">
                                            {COURSE_LEVEL_LABELS[course.level]}
                                        </td>
                                        <td className="px-5 py-3 text-right font-mono font-semibold text-slate-700">
                                            {course.lesson_count}
                                        </td>
                                        <td className="px-5 py-3 text-right font-mono text-slate-500">
                                            {course.order_num}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(course)}
                                                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => setToDelete(course)}
                                                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContainer>
            </div>

            <CourseFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                editing={editing}
                onSaved={load}
            />

            <ConfirmDialog
                open={!!toDelete}
                onOpenChange={(v) => !v && setToDelete(null)}
                title="Remover curso?"
                description={`Isso apaga o curso "${toDelete?.title ?? ""}" e TODAS as suas aulas (${toDelete?.lesson_count ?? 0}). Não dá para desfazer.`}
                confirmLabel="Remover"
                onConfirm={async () => {
                    if (!toDelete) return
                    try {
                        await deleteCourse(toDelete.id)
                        toast.success("Curso removido.")
                        await load()
                    } catch (err) {
                        toast.error(apiErrorMessage(err, "Não foi possível remover o curso."))
                        throw err
                    }
                }}
            />
        </AppLayout>
    )
}
