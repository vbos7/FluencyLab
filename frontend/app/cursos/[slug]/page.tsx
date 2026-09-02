import { notFound } from "next/navigation";
import { fetchFromApi } from "@/app/_lib/server-api";
import { type CourseDetail } from "@/app/_lib/courses";
import CursoClient from "./curso-client";

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let course: CourseDetail;

    try {
        course = await fetchFromApi<CourseDetail>(`/courses.php?slug=${slug}`);
    } catch (error) {
        console.error("Erro ao buscar curso:", error);
        notFound();
    }

    return <CursoClient course={course} />;
}