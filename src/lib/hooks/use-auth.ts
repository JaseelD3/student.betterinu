"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"

import { apiClient, studentApi } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"
import { useAuthStore } from "@/store/useAuthStore"
import { getClientAuth } from "@/lib/firebase-client"
import type { StudentProfile } from "@/types/student"
import type { LoginInput } from "@/types/auth"

/**
 * Boots the session by fetching the current authenticated student from the API,
 * then hydrates the auth store. Call once at app mount.
 */
export function useBootSession() {
  const { setStudent } = useAuthStore()

  const query = useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => apiClient<StudentProfile>("/api/student/profile"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (query.data) {
      const token = useAuthStore.getState().token
      setStudent(query.data, token ?? "")
    }
  }, [query.data, setStudent])

  return query
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
      const credential = await signInWithEmailAndPassword(auth, input.email, input.password)
      const idToken = await credential.user.getIdToken()
      await studentApi.verifyAccess(idToken)

      return {
        profile: {
          id: credential.user.uid,
          name: credential.user.displayName ?? "Student",
          email: credential.user.email ?? "",
          avatarUrl: credential.user.photoURL,
          role: "student" as const,
        } satisfies StudentProfile,
        idToken,
      }
    },
    onSuccess: ({ profile, idToken }) => {
      setStudent(profile, idToken)
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

  const teardown = () => {
    clearSession()
    queryClient.clear()
    router.push("/login")
  }

  return useMutation({
    mutationFn: async () => {
      const auth = getClientAuth()
      await signOut(auth)
      await apiClient<void>("/api/student/auth/logout", {
        method: "POST",
        requireAuth: false,
      }).catch(() => {})
    },
    onSuccess: teardown,
    onError: teardown,
  })
}