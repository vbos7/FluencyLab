"use client"

import axios from "axios"

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { Accept: "application/json" },
    withCredentials: true, // envia o cookie PHPSESSID em todo request
})
