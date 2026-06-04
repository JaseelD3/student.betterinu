import axios from "axios"

import { useAuthStore } from "@/store/useAuthStore"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

/** Attach bearer token from auth store on every outgoing request. */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** Normalize all error responses to a consistent shape. */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }

    const message: string =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      "Unknown error"

    return Promise.reject(new Error(message))
  }
)
