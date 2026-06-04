import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { StudentProfile } from "@/types/student"

type AuthState = {
  student: StudentProfile | null
  role: "student" | null
  isAuthenticated: boolean
  token: string | null
}

type AuthActions = {
  setStudent: (student: StudentProfile, token: string) => void
  clearSession: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      student: null,
      role: null,
      isAuthenticated: false,
      token: null,

      setStudent: (student, token) =>
        set({
          student,
          role: "student",
          isAuthenticated: true,
          token,
        }),

      clearSession: () =>
        set({
          student: null,
          role: null,
          isAuthenticated: false,
          token: null,
        }),
    }),
    {
      name: "betterinu-auth",
    }
  )
)
