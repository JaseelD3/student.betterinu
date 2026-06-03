"use client"

import { CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

export function ToastHost() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    const listener = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail)
      window.setTimeout(() => setMessage(""), 2600)
    }

    window.addEventListener("betterinu-toast", listener)
    return () => window.removeEventListener("betterinu-toast", listener)
  }, [])

  if (!message) {
    return null
  }

  return (
    <div className="text-on-dark animate-slide-in-right fixed right-6 bottom-6 z-50 flex max-w-sm items-center gap-3 rounded-md bg-[var(--green-900)] px-4 py-3 text-[13px] font-semibold shadow-lg">
      <CheckCircle2 className="size-5 text-[var(--green-200)]" aria-hidden />
      {message}
    </div>
  )
}
