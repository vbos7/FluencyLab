"use client"

// Camada de acesso à API do painel admin (client-side, via apiClient/axios).
// Todas as chamadas mandam o cookie PHPSESSID (withCredentials). Os endpoints já
// exigem admin no backend (guard.php + requireAdmin), então aqui só tipamos.

import { apiClient } from "@/app/_lib/api"
import type {
    AdminCategory,
    AdminPhrase,
    AdminSettings,
    AdminUser,
    Difficulty,
} from "@/app/_lib/admin"

// ─── Usuários ──────────────────────────────────────────────────────────────────

export async function listUsers(): Promise<AdminUser[]> {
    const { data } = await apiClient.get<AdminUser[]>("/admin/users.php")
    return data
}

export type NewUser = { name: string; email: string; password: string; role: "student" | "admin" }

export async function createUser(payload: NewUser): Promise<void> {
    await apiClient.post("/admin/users.php", payload)
}

export async function updateUser(id: number, payload: { name?: string; role?: "student" | "admin" }): Promise<void> {
    await apiClient.put(`/admin/users.php?id=${id}`, payload)
}

export async function deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/admin/users.php?id=${id}`)
}

// ─── Frases ────────────────────────────────────────────────────────────────────

export type PhraseInput = { pt: string; en: string; difficulty: Difficulty; category_id: number }

export async function listPhrases(): Promise<AdminPhrase[]> {
    const { data } = await apiClient.get<AdminPhrase[]>("/admin/phrases.php")
    return data
}

export async function createPhrase(payload: PhraseInput): Promise<void> {
    await apiClient.post("/admin/phrases.php", payload)
}

export async function updatePhrase(id: number, payload: PhraseInput): Promise<void> {
    await apiClient.put(`/admin/phrases.php?id=${id}`, payload)
}

export async function deletePhrase(id: number): Promise<void> {
    await apiClient.delete(`/admin/phrases.php?id=${id}`)
}

// ─── Categorias ──────────────────────────────────────────────────────────────

export async function listCategories(): Promise<AdminCategory[]> {
    const { data } = await apiClient.get<AdminCategory[]>("/admin/categories.php")
    return data
}

export async function createCategory(name: string): Promise<void> {
    await apiClient.post("/admin/categories.php", { name })
}

export async function updateCategory(id: number, name: string): Promise<void> {
    await apiClient.put(`/admin/categories.php?id=${id}`, { name })
}

export async function deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/admin/categories.php?id=${id}`)
}

// ─── Configurações ──────────────────────────────────────────────────────────────

export async function getSettings(): Promise<AdminSettings> {
    const { data } = await apiClient.get<AdminSettings>("/admin/settings.php")
    return data
}

export async function saveSettings(
    patch: Record<string, string | number | boolean>,
): Promise<AdminSettings> {
    const { data } = await apiClient.put<{ settings: AdminSettings }>("/admin/settings.php", patch)
    return data.settings
}

// ─── Perfil do admin ────────────────────────────────────────────────────────────

// /api/profile.php serve tanto aluno quanto admin (a sessão define quem é).
export type Profile = {
    id: number
    name: string
    email: string
    phone: string | null
    role: string
    avatar: string | null
    created_at: string
}

export async function getProfile(): Promise<Profile> {
    const { data } = await apiClient.get<Profile>("/profile.php")
    return data
}

// PUT /profile.php aceita name, email, phone e (opcional) troca de senha.
export type ProfileUpdate = {
    name: string
    email: string
    phone?: string
    current_password?: string
    new_password?: string
    new_password_confirmation?: string
}

export async function updateProfile(payload: ProfileUpdate): Promise<void> {
    await apiClient.put("/profile.php", payload)
}

export async function deleteAccount(): Promise<void> {
    await apiClient.delete("/profile.php")
}

export async function uploadAvatar(file: File): Promise<string> {
    const form = new FormData()
    form.append("avatar", file)
    const { data } = await apiClient.post<{ avatar: string }>("/admin/profile/avatar.php", form)
    return data.avatar
}

export async function deleteAvatar(): Promise<void> {
    await apiClient.delete("/admin/profile/avatar.php")
}

// ─── Autenticação de dois fatores (2FA) ─────────────────────────────────────────

export type TwoFactorStatus = {
    enabled: boolean
    pending: boolean
    recovery_codes_remaining: number
}

export async function twoFactorStatus(): Promise<TwoFactorStatus> {
    const { data } = await apiClient.get<TwoFactorStatus>("/admin/two-factor/status.php")
    return data
}

export type TwoFactorSetup = { secret: string; otpauth_uri: string; qr: string }

export async function twoFactorEnable(): Promise<TwoFactorSetup> {
    const { data } = await apiClient.post<TwoFactorSetup>("/admin/two-factor/enable.php")
    return data
}

export async function twoFactorConfirm(code: string): Promise<string[]> {
    const { data } = await apiClient.post<{ recovery_codes: string[] }>(
        "/admin/two-factor/confirm.php",
        { code },
    )
    return data.recovery_codes
}

export async function twoFactorDisable(password: string): Promise<void> {
    await apiClient.delete("/admin/two-factor/disable.php", { data: { password } })
}

// ─── Passkeys (WebAuthn) ────────────────────────────────────────────────────────
// A cerimônia (navigator.credentials.*) fica em webauthn-client.ts; aqui só a
// listagem/remoção dos metadados.

export type Passkey = {
    id: number
    name: string | null
    created_at: string
    last_used_at: string | null
}

export async function listPasskeys(): Promise<Passkey[]> {
    const { data } = await apiClient.get<{ passkeys: Passkey[] }>("/admin/passkeys/list.php")
    return data.passkeys
}

export async function deletePasskey(id: number): Promise<void> {
    await apiClient.delete(`/admin/passkeys/delete.php?id=${id}`)
}

// ─── Helper para extrair a mensagem de erro do backend ──────────────────────────

// Endpoints devolvem { error: string } ou { errors: string[] }. Normaliza para texto.
export function apiErrorMessage(err: unknown, fallback = "Algo deu errado. Tente de novo."): string {
    const data =
        typeof err === "object" && err !== null && "response" in err
            ? (err as { response?: { data?: { error?: string; errors?: string[] } } }).response?.data
            : undefined
    if (data?.errors?.length) return data.errors.join(" ")
    if (data?.error) return data.error
    return fallback
}
