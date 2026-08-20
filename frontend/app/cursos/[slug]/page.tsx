import { notFound } from "next/navigation";
import { fetchFromApi } from "@/app/_lib/server-api";
import CursoClient from "./curso-client";

type Lesson = {
    id: number;
    title: string;
    duration: number;
    youtube_id: string | null; // 👈 pode vir null quando trancada
    order_num: number;
    is_free: boolean;          // 👈 novo
    locked: boolean;           // 👈 novo
};

type CourseDetail = {
    id: number;
    slug: string;
    title: string;
    description: string;
    level: string;
    lessons: Lesson[];
    user_has_premium: boolean; // 👈 novo
};

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