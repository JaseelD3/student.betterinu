"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"

import RoboLoader from "@/components/loading/robo-loader"
import { getClientAuth } from "@/lib/firebase-client"

export function StudentAuthGuard({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(getClientAuth(), (user) => {
      if (!user) {
        router.replace("/login")
        return
      }

      setIsReady(true)
    })
  }, [router])

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <RoboLoader size="md" caption="Loading your account..." />
      </div>
    )
  }

  return children
}
