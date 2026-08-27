"use client"

// Cerimônias WebAuthn no navegador. O backend (lbuchs/webauthn) fala base64url,
// mas navigator.credentials.* exige ArrayBuffer nos campos binários — então
// convertemos na entrada e na saída.

import { apiClient } from "@/app/_lib/api"

function b64uToBuf(b64u: string): ArrayBuffer {
    const b64 = b64u.replace(/-/g, "+").replace(/_/g, "/")
    const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : ""
    const str = atob(b64 + pad)
    const bytes = new Uint8Array(str.length)
    for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i)
    return bytes.buffer
}

function bufToB64u(buf: ArrayBuffer): string {
    const bytes = new Uint8Array(buf)
    let str = ""
    for (const b of bytes) str += String.fromCharCode(b)
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export function browserSupportsPasskeys(): boolean {
    return typeof window !== "undefined" && typeof window.PublicKeyCredential !== "undefined"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyArgs = any

// ─── Registro (admin já logado, a partir do perfil) ─────────────────────────────
export async function registerPasskey(name?: string): Promise<void> {
    const { data } = await apiClient.post("/admin/passkeys/register-options.php")
    const pk: AnyArgs = data.publicKey

    const publicKey: PublicKeyCredentialCreationOptions = {
        ...pk,
        challenge: b64uToBuf(pk.challenge),
        user: { ...pk.user, id: b64uToBuf(pk.user.id) },
        excludeCredentials: (pk.excludeCredentials ?? []).map((c: AnyArgs) => ({
            ...c,
            id: b64uToBuf(c.id),
        })),
    }

    const cred = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null
    if (!cred) throw new Error("Registro cancelado.")
    const resp = cred.response as AuthenticatorAttestationResponse

    await apiClient.post("/admin/passkeys/register.php", {
        clientDataJSON: bufToB64u(resp.clientDataJSON),
        attestationObject: bufToB64u(resp.attestationObject),
        name,
    })
}

// ─── Login próprio do painel (sem email/senha) ──────────────────────────────────
export async function loginWithPasskey(): Promise<void> {
    const { data } = await apiClient.post("/auth/passkey/login-options.php")
    const pk: AnyArgs = data.publicKey

    const publicKey: PublicKeyCredentialRequestOptions = {
        ...pk,
        challenge: b64uToBuf(pk.challenge),
        allowCredentials: (pk.allowCredentials ?? []).map((c: AnyArgs) => ({
            ...c,
            id: b64uToBuf(c.id),
        })),
    }

    const cred = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null
    if (!cred) throw new Error("Login cancelado.")
    const resp = cred.response as AuthenticatorAssertionResponse

    await apiClient.post("/auth/passkey/login.php", {
        id: cred.id,
        clientDataJSON: bufToB64u(resp.clientDataJSON),
        authenticatorData: bufToB64u(resp.authenticatorData),
        signature: bufToB64u(resp.signature),
    })
}
