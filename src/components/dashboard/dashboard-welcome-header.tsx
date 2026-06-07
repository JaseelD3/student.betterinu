"use client"

import { useAuthStore } from "@/store/useAuthStore"
import { useStudentProfile } from "@/lib/hooks/use-profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  const { data: profile } = useStudentProfile()
  const firstName = student?.name?.split(" ")[0] ?? null
  const avatarUrl = profile?.avatar_url ?? student?.avatarUrl ?? null
  const initials = student?.name
    ? student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

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

      <Avatar className="size-12 shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
        <AvatarImage src={avatarUrl ?? undefined} alt={student?.name ?? "Student"} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
    </header>
  )
}
