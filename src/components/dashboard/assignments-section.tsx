"use client"

import Link from "next/link"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  MessageSquare,
  ClipboardList,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { AssignmentSubmission } from "@/lib/api-client"
import type { StandaloneAssignment } from "@/lib/api-client"
import type { Course } from "@/types"

type AssignmentsSectionProps = {
  courses: Course[] | undefined
  submissions: AssignmentSubmission[] | undefined
  standaloneTasks: StandaloneAssignment[] | undefined
  isLoading: boolean
}

const STATUS_CONFIG = {
  todo: {
    Icon: AlertCircle,
    label: "To Do",
    cls: "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-900/30",
    dot: "bg-blue-400",
  },
  pending: {
    Icon: Clock,
    label: "In Review",
    cls: "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900/30",
    dot: "bg-amber-400",
  },
  approved: {
    Icon: CheckCircle2,
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900/30",
    dot: "bg-emerald-500",
  },
  rejected: {
    Icon: XCircle,
    label: "Revise",
    cls: "bg-red-50 text-red-700 ring-red-100 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900/30",
    dot: "bg-red-400",
  },
}

function fmtDate(iso: string | null | undefined) {
  if (!iso) return null
  const d = new Date(iso)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0)
    return { label: `${Math.abs(diffDays)}d overdue`, isOverdue: true }
  if (diffDays === 0) return { label: "Due today", isOverdue: false }
  return { label: `Due in ${diffDays}d`, isOverdue: false }
}

export function AssignmentsSection({
  courses,
  submissions,
  standaloneTasks,
  isLoading,
}: AssignmentsSectionProps) {
  // Build flat assignment list from course structure + submissions
  type FlatItem = {
    id: string
    title: string
    courseTitle: string
    href: string
    status: "todo" | "pending" | "approved" | "rejected"
    dueDate: string | null
    feedback?: string | null
  }

  const courseItems: FlatItem[] = []
  if (courses && submissions) {
    courses.forEach((course) => {
      course.weeks?.forEach((week) => {
        week.days?.forEach((day) => {
          day.subModules?.forEach((sm) => {
            if (sm.type !== "assignment") return
            const sub = submissions.find((s) => s.assignment_id === sm.id)
            courseItems.push({
              id: sub?.id ?? `unsub-${sm.id}`,
              title: sm.title || "Assignment",
              courseTitle: course.title,
              href: `/course/${course.id}/learn/${week.id}/${sm.id}`,
              status: sub ? sub.status : "todo",
              dueDate: sm.assignmentData?.dueDate ?? null,
              feedback: sub?.feedback,
            })
          })
        })
      })
    })
  }

  // Standalone tasks
  const standaloneItems: FlatItem[] =
    standaloneTasks?.map((t) => ({
      id: t.assignment_id,
      title: t.title,
      courseTitle: t.course_title ?? "Standalone Task",
      href: `/assignments/${t.assignment_id}`,
      status: (t.submission_status ?? "todo") as FlatItem["status"],
      dueDate: t.due_date,
      feedback: null,
    })) ?? []

  const allItems = [...courseItems, ...standaloneItems]

  const overdue = allItems.filter((i) => {
    const d = fmtDate(i.dueDate)
    return d?.isOverdue && i.status === "todo"
  })
  const upcoming = allItems.filter((i) => {
    const d = fmtDate(i.dueDate)
    return d && !d.isOverdue && i.status === "todo"
  })
  const withFeedback = allItems.filter(
    (i) => i.feedback && i.status === "rejected"
  )

  // Status breakdown counts
  const counts = {
    todo: allItems.filter((i) => i.status === "todo").length,
    pending: allItems.filter((i) => i.status === "pending").length,
    approved: allItems.filter((i) => i.status === "approved").length,
    rejected: allItems.filter((i) => i.status === "rejected").length,
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-foreground text-sm font-bold tracking-wide">
          Assignments
        </h2>
        <Link
          href="/assignments"
          className="text-primary text-[11px] font-semibold hover:underline"
        >
          View all →
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Status breakdown */}
          <div className="grid grid-cols-4 gap-1.5">
            {(Object.entries(counts) as [keyof typeof counts, number][]).map(
              ([status, count]) => {
                const cfg = STATUS_CONFIG[status]
                return (
                  <div
                    key={status}
                    className={`flex flex-col items-center gap-1 rounded-md py-2 ring-1 ${cfg.cls}`}
                  >
                    <span className="text-base leading-none font-bold">
                      {count}
                    </span>
                    <span className="text-[9px] font-semibold tracking-wide uppercase opacity-70">
                      {cfg.label}
                    </span>
                  </div>
                )
              }
            )}
          </div>

          {/* Overdue — always show at top */}
          {overdue.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-destructive flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase">
                <AlertCircle className="size-3" />
                Overdue ({overdue.length})
              </p>
              {overdue.map((item) => (
                <AssignmentRow key={item.id} item={item} isOverdue />
              ))}
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                Upcoming
              </p>
              {upcoming.slice(0, 3).map((item) => (
                <AssignmentRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Recent feedback */}
          {withFeedback.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase">
                <MessageSquare className="size-3" />
                Feedback Received
              </p>
              {withFeedback.slice(0, 2).map((item) => (
                <FeedbackRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* All done state */}
          {allItems.length === 0 && (
            <div className="bg-card ring-foreground/10 ring-dashed flex flex-col items-center justify-center gap-2 rounded-md py-10 ring-1">
              <ClipboardList className="text-muted-foreground size-8" />
              <p className="text-muted-foreground text-xs">
                No assignments yet.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

// ── Row components ─────────────────────────────────────────────────────────────

type FlatItemShape = {
  id: string
  title: string
  courseTitle: string
  href: string
  status: "todo" | "pending" | "approved" | "rejected"
  dueDate: string | null
  feedback?: string | null
}

function AssignmentRow({
  item,
  isOverdue = false,
}: {
  item: FlatItemShape
  isOverdue?: boolean
}) {
  const cfg = STATUS_CONFIG[item.status]
  const due = fmtDate(item.dueDate)

  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 rounded-md px-3 py-2.5 ring-1 transition-all duration-200 hover:shadow-sm ${isOverdue
        ? "bg-destructive/5 ring-destructive/20 hover:ring-destructive/30"
        : "bg-card ring-foreground/8 hover:ring-primary/20"
        }`}
    >
      <span className={`size-2 shrink-0 rounded-full ${cfg.dot}`} />
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-xs font-semibold">
          {item.title}
        </p>
        <p className="text-muted-foreground truncate text-[10px]">
          {item.courseTitle}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ring-1 ${cfg.cls}`}
        >
          {cfg.label}
        </span>
        {due && (
          <span
            className={`text-[9px] font-medium ${due.isOverdue ? "text-destructive" : "text-muted-foreground"
              }`}
          >
            {due.label}
          </span>
        )}
      </div>
      <ChevronRight className="text-muted-foreground size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}

function FeedbackRow({ item }: { item: FlatItemShape }) {
  return (
    <Link
      href={item.href}
      className="group bg-card ring-foreground/8 hover:ring-primary/20 flex flex-col gap-1.5 rounded-md px-3 py-2.5 ring-1 transition-all duration-200 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <p className="text-foreground truncate text-xs font-semibold">
          {item.title}
        </p>
        <span className="text-muted-foreground text-[10px]">
          {item.courseTitle}
        </span>
      </div>
      {item.feedback && (
        <p className="text-muted-foreground line-clamp-2 text-[11px] italic">
          &ldquo;{item.feedback}&rdquo;
        </p>
      )}
    </Link>
  )
}
