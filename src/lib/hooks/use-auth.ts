"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"

import { api } from "@/lib/axios"
import { queryKeys } from "@/lib/query-keys"
import { useAuthStore } from "@/store/useAuthStore"
import { getClientAuth } from "@/lib/firebase-client"
import type { StudentProfile } from "@/types/student"

import type { LoginInput } from "@/types/auth"



/**
 * Boots the session by fetching the current authenticated student from the API,
 * then hydrates the auth store. Call once at app mount.
 * NOTE: The backend endpoint is GET /api/student/profile (not /student/me).
 */
export function useBootSession() {
  const { setStudent, token } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: async () => {
      const { data } = await api.get<StudentProfile>("/api/student/profile")
      return data
    },
    onSuccess: (student: StudentProfile) => {
      setStudent(student, token ?? "")
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}


/**
 * Logs the student in via email + password, verifies backend access,
 * and stores the session token so API calls can attach Authorization headers.
 */
export function useLogin() {
  const router = useRouter()
  const { setStudent } = useAuthStore()

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const auth = getClientAuth()
      const credential = await signInWithEmailAndPassword(
        auth,
        input.email,
        input.password
      )
      // Get the Firebase ID token and send it to the backend:
      // 1. Verifies the student exists in the DB
      // 2. Sets the __session httpOnly cookie (needed for SSR/API routes)
      const idToken = await credential.user.getIdToken()
      await (await import("@/lib/api-client")).studentApi.verifyAccess(idToken)

      // Store the token in Zustand so axios interceptor can attach it
      const profile: StudentProfile = {
        id: credential.user.uid,
        name: credential.user.displayName ?? "Student",
        email: credential.user.email ?? "",
        avatarUrl: credential.user.photoURL,
        role: "student",
      }
      setStudent(profile, idToken)
    },
    onSuccess: () => {
      router.push("/")
    },
  })
}

/**
 * Logs the student out, clears the session in both store and server.
 */
export function useLogout() {
  const router = useRouter()
  const { clearSession } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const auth = getClientAuth()
      await signOut(auth)
      // Call backend logout if it exists to clear any httpOnly cookies
      await api.post("/student/auth/logout").catch(() => {})
    },
    onSuccess: () => {
      clearSession()
      queryClient.clear()
      router.push("/login")
    },
    onError: () => {
      clearSession()
      queryClient.clear()
      router.push("/login")
    },
  })
}
