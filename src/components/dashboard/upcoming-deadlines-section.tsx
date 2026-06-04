"use client"

import Link from "next/link"
import { CalendarClock, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { DashboardAssignment } from "@/types/dashboard"

type DeadlineItemProps = {
  assignment: DashboardAssignment
}

function formatDueDate(iso: string | null): {
  label: string
  isOverdue: boolean
  isDueToday: boolean
} {
  if (!iso) return { label: "No due date", isOverdue: false, isDueToday: false }
  const due = new Date(iso)
  const now = new Date()
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0)
    return { label: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isDueToday: false }
  if (diffDays === 0)
    return { label: "Due today", isOverdue: false, isDueToday: true }
  if (diffDays === 1)
    return { label: "Due tomorrow", isOverdue: false, isDueToday: false }
  return {
    label: `Due in ${diffDays}d`,
    isOverdue: false,
    isDueToday: false,
  }
}

export function DeadlineItem({ assignment }: DeadlineItemProps) {
  const due = formatDueDate(assignment.dueDate)
  const href = `/course/${assignment.courseId}/assignments/${assignment.id}`

  const badgeVariant = due.isOverdue
    ? "destructive"
    : due.isDueToday
      ? "default"
      : "outline"

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
        "hover:bg-muted/50"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-xs font-medium">
          {assignment.title}
        </p>
        <p className="text-muted-foreground truncate text-xs">
          {assignment.courseTitle}
        </p>
      </div>
      <Badge variant={badgeVariant} className="shrink-0 text-[10px]">
        {due.label}
      </Badge>
      <ChevronRight className="text-muted-foreground size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}

type UpcomingDeadlinesSectionProps = {
  assignments: DashboardAssignment[] | undefined
  isLoading: boolean
}

export function UpcomingDeadlinesSection({
  assignments,
  isLoading,
}: UpcomingDeadlinesSectionProps) {
  /** Show overdue first, then upcoming sorted by date */
  const relevant = (assignments ?? [])
    .filter(
      (a) =>
        a.dueDate !== null &&
        (a.status === "todo" || a.status === "pending") &&
        (a.isOverdue ||
          new Date(a.dueDate).getTime() > Date.now())
    )
    .sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CalendarClock className="text-muted-foreground size-4" />
        <h2 className="font-display text-foreground text-base font-semibold">
          Upcoming Deadlines
        </h2>
      </div>

      {isLoading ? (
        <div className="bg-card ring-foreground/10 flex flex-col rounded-md ring-1">
          {[1, 2, 3, 4].map((i, idx) => (
            <div key={i}>
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              {idx < 3 && <Separator />}
            </div>
          ))}
        </div>
      ) : relevant.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-xs">
          No upcoming deadlines — you&apos;re all clear!
        </p>
      ) : (
        <div className="bg-card ring-foreground/10 flex flex-col rounded-md ring-1">
          {relevant.map((a, idx) => (
            <div key={a.id}>
              <DeadlineItem assignment={a} />
              {idx < relevant.length - 1 && (
                <Separator className="mx-3 w-auto" />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
