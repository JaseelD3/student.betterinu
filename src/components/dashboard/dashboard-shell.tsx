"use client"

import { Separator } from "@/components/ui/separator"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { ContinueLearningSection } from "@/components/dashboard/continue-learning-section"
import { UpcomingDeadlinesSection } from "@/components/dashboard/upcoming-deadlines-section"
import { RecentActivitySection } from "@/components/dashboard/recent-activity-section"
import {
  useDashboardCourses,
  useDashboardAssignments,
} from "@/lib/hooks/use-dashboard"
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

export function DashboardShell() {
  const { student } = useAuthStore()
  const firstName = student?.name?.split(" ")[0] ?? null

  const { data: courses, isLoading: isLoadingCourses } = useDashboardCourses()
  const { data: assignments, isLoading: isLoadingAssignments } =
    useDashboardAssignments()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-foreground text-2xl font-semibold sm:text-3xl">
          {getGreeting()}
          {firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm">{formatDate()}</p>
      </header>

      <Separator />

      {/* ── Stats row ────────────────────────────────────────────────── */}
      <DashboardStats
        courses={courses}
        assignments={assignments}
        isLoadingCourses={isLoadingCourses}
        isLoadingAssignments={isLoadingAssignments}
      />

      {/* ── Two-column section ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left — 65% */}
        <ContinueLearningSection
          courses={courses}
          isLoading={isLoadingCourses}
        />

        {/* Right — 35% */}
        <UpcomingDeadlinesSection
          assignments={assignments}
          isLoading={isLoadingAssignments}
        />
      </div>

      <Separator />

      {/* ── Recent activity feed ─────────────────────────────────────── */}
      <RecentActivitySection
        courses={courses}
        assignments={assignments}
        isLoading={isLoadingCourses || isLoadingAssignments}
      />
    </div>
  )
}
