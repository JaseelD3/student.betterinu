"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="group text-secondary hover:text-primary focus-ring mb-6 flex items-center gap-2 rounded text-sm font-semibold transition-colors"
    >
      <span className="border-default group-hover:border-primary group-hover:bg-primary/5 flex size-8 items-center justify-center rounded-full border bg-white shadow-sm transition-all">
        <ChevronLeft className="size-4" />
      </span>
      <span>Go Back</span>
    </button>
  )
}
