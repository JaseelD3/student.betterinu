"use client"

import {
  CheckCircle2,
  Clock,
  BookOpen,
  ClipboardList,
  Activity,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { DashboardAssignment } from "@/types/dashboard"
import type { DashboardCourse } from "@/types/dashboard"

/** A lightweight activity event derived from what the hooks already return */
type ActivityEvent = {
  id: string
  icon: React.ElementType
  description: string
  detail: string
  timeAgo: string
  iconClass: string
}

function getTimeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

function buildActivityFeed(
  courses: DashboardCourse[] | undefined,
  assignments: DashboardAssignment[] | undefined
): ActivityEvent[] {
  const events: ActivityEvent[] = []

  // Enrolled courses — use enrolledAt date
  courses?.forEach((c) => {
    if (c.enrolledAt) {
      events.push({
        id: `enroll-${c.id}`,
        icon: BookOpen,
        description: "Enrolled in course",
        detail: c.title,
        timeAgo: getTimeAgo(c.enrolledAt),
        iconClass: "text-primary",
      })
    }
  })

  // Submitted assignments
  assignments
    ?.filter((a) => a.status !== "todo")
    .forEach((a) => {
      const isApproved = a.status === "approved"
      const isRejected = a.status === "rejected"
      events.push({
        id: `assign-${a.id}`,
        icon: isApproved
          ? CheckCircle2
          : isRejected
            ? ClipboardList
            : Clock,
        description: isApproved
          ? "Assignment approved"
          : isRejected
            ? "Assignment needs revision"
            : "Assignment submitted",
        detail: `${a.title} · ${a.courseTitle}`,
        timeAgo: "",
        iconClass: isApproved
          ? "text-primary"
          : isRejected
            ? "text-destructive"
            : "text-muted-foreground",
      })
    })

  return events.slice(0, 8)
}

type RecentActivitySectionProps = {
  courses: DashboardCourse[] | undefined
  assignments: DashboardAssignment[] | undefined
  isLoading: boolean
}

export function RecentActivitySection({
  courses,
  assignments,
  isLoading,
}: RecentActivitySectionProps) {
  const feed = buildActivityFeed(courses, assignments)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Activity className="text-muted-foreground size-4" />
        <h2 className="font-display text-foreground text-base font-semibold">
          Recent Activity
        </h2>
      </div>

      {isLoading ? (
        <div className="bg-card ring-foreground/10 flex flex-col rounded-md ring-1">
          {[1, 2, 3, 4].map((i, idx) => (
            <div key={i}>
              <div className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-7 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-2.5 w-56" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
              {idx < 3 && <Separator />}
            </div>
          ))}
        </div>
      ) : feed.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-xs">
          No activity yet. Start a lesson to see your progress here.
        </p>
      ) : (
        <div className="bg-card ring-foreground/10 flex flex-col rounded-md ring-1">
          {feed.map((event, idx) => {
            const Icon = event.icon
            return (
              <div key={event.id}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full">
                    <Icon
                      className={cn("size-3.5", event.iconClass)}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-xs font-medium">
                      {event.description}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {event.detail}
                    </p>
                  </div>
                  {event.timeAgo && (
                    <span className="text-muted-foreground shrink-0 text-[10px]">
                      {event.timeAgo}
                    </span>
                  )}
                </div>
                {idx < feed.length - 1 && <Separator />}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
