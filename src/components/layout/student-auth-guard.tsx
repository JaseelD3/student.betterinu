"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"

import { Skeleton } from "@/components/ui/skeleton"
import { getClientAuth } from "@/lib/firebase-client"
import { useAuthStore } from "@/store/useAuthStore"
import type { StudentProfile } from "@/types/student"

export function StudentAuthGuard({ children }: React.PropsWithChildren) {
  const router = useRouter()
  // `checked` = Firebase has resolved the initial auth state (may be null or user).
  // We must wait for this before deciding to redirect, otherwise we redirect
  // immediately before Firebase restores the persisted session from IndexedDB.
  const [checked, setChecked] = useState(false)
  const { setStudent, token: storedToken } = useAuthStore()

  useEffect(() => {
    return onAuthStateChanged(getClientAuth(), async (user) => {
      if (!user) {
        setChecked(true)
        router.replace("/login")
        return
      }

      /** Hydrate useAuthStore from the Firebase user so all dashboard
       *  components can read student name/email without their own listeners.
       *  IMPORTANT: preserve the token from login; if it's missing (e.g. page
       *  refresh) refresh it from Firebase now so axios can attach it. */
      const profile: StudentProfile = {
        id: user.uid,
        name: user.displayName ?? "Student",
        email: user.email ?? "",
        avatarUrl: user.photoURL,
        role: "student",
      }
      // Re-use the stored token (set during login) or refresh it from Firebase.
      const idToken = storedToken || (await user.getIdToken())
      setStudent(profile, idToken)

      setChecked(true)
    })
    // storedToken intentionally omitted — we only need this once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, setStudent])

  if (!checked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    )
  }

  return children
}
