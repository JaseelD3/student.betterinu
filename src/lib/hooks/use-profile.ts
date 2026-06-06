"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/lib/query-keys"
import { useAuthStore } from "@/store/useAuthStore"

// ── Actual backend response shapes ──────────────────────────────────────────
// GET /api/student/profile → flat student row (id, name, email, avatar_url, etc.)

type StudentProfileFull = {
  id: string
  name: string
  email: string
  avatar_url?: string | null
  phone?: string | null
  firebase_uid?: string
  status?: string
  created_at?: string
  // student_profiles join fields
  highest_qualification?: string | null
  current_status?: string | null
  year_of_passing?: number | null
  certification_url?: string | null
  id_proof_url?: string | null
  verification_status?: string | null
}

/**
 * Fetches the authenticated student's profile.
 * Backend: GET /api/student/profile → flat student row
 */
export function useStudentProfile() {
  const { setStudent, token } = useAuthStore()

  const query = useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: async () => {
      const profile = await apiClient<StudentProfileFull>("/api/student/profile")
      return profile
    },
    staleTime: 5 * 60_000,
  })

  useEffect(() => {
    if (query.data) {
      setStudent(
        {
          id: query.data.id,
          name: query.data.name,
          email: query.data.email,
          avatarUrl: query.data.avatar_url ?? null,
          role: "student",
        },
        token ?? ""
      )
    }
  }, [query.data, setStudent, token])

  return query
}

export type { StudentProfileFull }
