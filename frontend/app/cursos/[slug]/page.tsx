import { notFound } from "next/navigation"
import { ApiError, fetchFromApi, getCurrentUser } from "@/app/_lib/server-api"
import { type CourseDetail } from "@/app/_lib/courses"
import { MaintenanceScreen } from "@/app/_components/maintenance-screen"
import CursoClient from "./curso-client"

type Status = { maintenance: boolean; app_name: string }

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    let course: CourseDetail

    try {
        course = await fetchFromApi<CourseDetail>(`/courses.php?slug=${encodeURIComponent(slug)}`)
    } catch (error) {
        // Só "curso não existe" vira 404; falha do servidor vai para a página de erro.
        if (error instanceof ApiError && error.status === 404) notFound()
        throw error
    }

    // Esta página não usa o NavLayout, então confere o modo manutenção aqui.
    const [status, user] = await Promise.all([
        fetchFromApi<Status>("/status.php"),
        getCurrentUser(),
    ])
    if (status.maintenance && user?.role !== "admin") {
        return <MaintenanceScreen appName={status.app_name} />
    }

    return <CursoClient course={course} />
}
