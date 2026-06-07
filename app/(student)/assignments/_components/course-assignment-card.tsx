import Link from "next/link"
import { BookOpen, CalendarClock } from "lucide-react"

import { cn } from "@/lib/utils"
import { StatusBadge, type StatusKey } from "./status-badge"

// ── Types (snake_case from actual API) ───────────────────────────────────────
export type CourseAssignmentRow = {
  submission_id: string
  assignment_id: string
  course_id: string
  week_id: string
  day_id: string
  module_id: string
  title: string
  due_date: string | null
  scope: "course"
  course_title: string
  submission_status: "pending" | "approved" | "rejected"
  submitted_at: string
  feedback: string | null
  marks_obtained: number | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

// ── Component ────────────────────────────────────────────────────────────────
export function CourseAssignmentCard({
  assignment: a,
}: {
  assignment: CourseAssignmentRow
}) {
  const status = (a.submission_status ?? "pending") as StatusKey
  const isApproved = status === "approved"
  const isPending = status === "pending"
  const isRejected = status === "rejected"

  // Build the deep-link to the lesson in the course learn page
  const lessonHref =
    a.course_id && a.week_id && a.module_id
      ? `/course/${a.course_id}/learn/${a.week_id}/${a.module_id}`
      : null

  const inner = (
    <div
      className={cn(
        "flex flex-col h-full w-full justify-between gap-2.5 rounded-md border p-4 transition-all hover:shadow-xs",
        lessonHref && "cursor-pointer hover:border-primary/40",
        isApproved && "border-accent/50 bg-accent/10",
        isPending && "border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20",
        isRejected && "border-rose-200 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-950/20",
        !isApproved && !isPending && !isRejected && "border-border bg-card"
      )}
    >
      {/* Top Section: Title & Badges */}
      <div className="space-y-2 w-full min-w-0">
        <h3 className="text-foreground text-lg font-bold leading-snug min-w-0 truncate">
          {a.title}
        </h3>

        {/* Course name pill */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
          <BookOpen className="size-3 shrink-0" />
          <span className="truncate">{a.course_title}</span>
        </div>

        {/* Badge Row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Bottom Section: Meta details */}
      <div className="space-y-2 w-full">
        <div className="text-muted-foreground flex flex-col gap-1 text-[11px]">
          {a.due_date ? (
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-3.5 shrink-0" aria-hidden />
              Due {fmtDate(a.due_date)}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 opacity-70">
              <CalendarClock className="size-3.5 shrink-0" aria-hidden />
              No due date
            </span>
          )}
        </div>
        {a.marks_obtained != null && (
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground">
            🏆 {a.marks_obtained} marks
          </span>
        )}
      </div>
    </div>
  )

  if (lessonHref) {
    return <Link href={lessonHref}>{inner}</Link>
  }
  return inner
}
