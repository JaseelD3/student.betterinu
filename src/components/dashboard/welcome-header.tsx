"use client"

import { GraduationCap, Sparkles, Flame } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useProgress } from "@/lib/hooks/useProgress"
import { useAuthStore } from "@/store/useAuthStore"

type WelcomeHeaderProps = {
  courseCount: number | null
}

function getInitials(name: string | null | undefined) {
  if (!name) return "S"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export function WelcomeHeader({ courseCount }: WelcomeHeaderProps) {
  /** Read name/email from the store — hydrated by StudentAuthGuard */
  const { student } = useAuthStore()
  const { progress } = useProgress()

  const name = student?.name ?? null
  const email = student?.email ?? null
  const greeting = getGreeting()
  const firstName = name ? name.split(" ")[0] : null

  return (
    <div className="bg-card ring-foreground/10 relative overflow-hidden rounded-md ring-1">
      {/* Subtle gradient accent */}
      <div className="from-primary/8 via-accent/5 absolute inset-0 bg-gradient-to-br to-transparent" />

      <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        {/* Left — avatar + greeting */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="border-primary/20 size-14 border-2 shadow-md">
              <AvatarFallback className="from-primary/20 to-primary/5 text-primary bg-gradient-to-br text-base font-black tracking-wider">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            {progress.streak > 0 && (
              <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-black text-white shadow">
                🔥
              </span>
            )}
          </div>

          <div>
            <h1 className="font-display text-foreground text-xl leading-tight font-bold sm:text-2xl">
              {greeting}
              {firstName ? `, ${firstName}` : ""}!
            </h1>
            <p className="text-muted-foreground mt-0.5 text-xs font-medium">
              {email ?? ""}
            </p>
          </div>
        </div>

        {/* Right — quick stat chips */}
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <StatChip
            icon={<GraduationCap className="size-3.5" />}
            value={courseCount !== null ? String(courseCount) : "—"}
            label="Enrolled"
            colorClass="bg-primary/8 text-primary ring-primary/15"
          />
          <StatChip
            icon={<Sparkles className="size-3.5" />}
            value={String(progress.xp)}
            label="XP"
            colorClass="bg-accent/10 text-accent-foreground ring-accent/20"
          />
          <StatChip
            icon={<Flame className="size-3.5 text-orange-500" />}
            value={String(progress.streak)}
            label="Streak"
            colorClass="bg-orange-50 text-orange-700 ring-orange-100 dark:bg-orange-950/30 dark:text-orange-300 dark:ring-orange-900/40"
          />
        </div>
      </div>

      {/* Bottom date bar */}
      <div className="border-border/50 border-t px-5 py-2.5 sm:px-6">
        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  )
}

type StatChipProps = {
  icon: React.ReactNode
  value: string
  label: string
  colorClass: string
}

function StatChip({ icon, value, label, colorClass }: StatChipProps) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 ring-1 ${colorClass}`}
    >
      {icon}
      <span className="text-sm leading-none font-bold">{value}</span>
      <span className="text-[10px] font-semibold tracking-wide uppercase opacity-70">
        {label}
      </span>
    </div>
  )
}
