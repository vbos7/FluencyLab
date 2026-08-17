import { notFound } from "next/navigation";
import { fetchFromApi } from "@/app/_lib/server-api";
import CursoClient from "./curso-client";

type Lesson = { id: number; title: string; duration: number; youtube_id: string; order_num: number };
type CourseDetail = { id: number; slug: string; title: string; description: string; level: string; lessons: Lesson[] };

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params; // 👈 precisa dar await antes de usar

    let course: CourseDetail;

    try {
        course = await fetchFromApi<CourseDetail>(`/courses.php?slug=${slug}`);
    } catch (error) {
        console.error("Erro ao buscar curso:", error);
        notFound();
    }

    return <CursoClient course={course} />;
}