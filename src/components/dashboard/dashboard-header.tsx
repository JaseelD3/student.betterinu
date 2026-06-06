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

export function DashboardHeader() {
  const { student } = useAuthStore()
  const firstName = student?.name?.split(" ")[0] ?? null

  return (
    <header className="flex flex-col gap-1">
      <h1 className="font-heading text-foreground text-2xl font-bold sm:text-3xl">
        {getGreeting()}
        {firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="text-muted-foreground text-sm">{formatDate()}</p>
    </header>
  )
}
