"use client"

import { useAuthStore } from "@/store/useAuthStore"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function DashboardWelcomeHeader() {
  const { student } = useAuthStore()
  const firstName = student?.name?.split(" ")[0] ?? null

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-1">
          {formatDate()}
        </p>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {getGreeting()}{firstName ? `, ${firstName}` : ""} 
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here's what's happening today.
        </p>
      </div>
    </header>
  )
}
