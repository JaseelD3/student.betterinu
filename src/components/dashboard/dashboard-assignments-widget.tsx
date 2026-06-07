"use client"

import Link from "next/link"
import { FileText, Clock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

import { useCourseAssignments } from "@/lib/hooks/use-assignments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function fmtDate(d?: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })
}

function isOverdue(dueDate?: string | null) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

type StatusStyle = {
  border: string
  bg: string
  dot: string
  label: string
  text: string
}

function getStatusStyle(status: string | null, overdue: boolean): StatusStyle {
  if (overdue && !status) {
    return {
      border: "border-red-200",
      bg: "bg-red-50",
      dot: "bg-red-500",
      label: "Overdue",
      text: "text-red-600",
    }
  }
  switch (status) {
    case "approved":
      return {
        border: "border-emerald-200",
        bg: "bg-emerald-50",
        dot: "bg-emerald-500",
        label: "Approved",
        text: "text-emerald-700",
      }
    case "pending":
      return {
        border: "border-amber-200",
        bg: "bg-amber-50",
        dot: "bg-amber-500",
        label: "In Review",
        text: "text-amber-700",
      }
    case "rejected":
      return {
        border: "border-red-200",
        bg: "bg-red-50",
        dot: "bg-red-500",
        label: "Rejected",
        text: "text-red-600",
      }
    default:
      return {
        border: "border-border",
        bg: "bg-muted/40",
        dot: "bg-violet-500",
        label: "To Do",
        text: "text-violet-600",
      }
  }
}

export function DashboardAssignmentsWidget() {
  const { data: assignments, isLoading } = useCourseAssignments()

  // Show latest 3 course tasks sorted by submission date (most recent first), then by assignment id
  const latest = (assignments ?? [])
    .sort((a, b) => {
      const da = (a as any).submitted_at ?? (a as any).created_at ?? ""
      const db = (b as any).submitted_at ?? (b as any).created_at ?? ""
      return db.localeCompare(da)
    })
    .slice(0, 3)

  const pendingCount = (assignments ?? []).filter(
    (a) => !a.submission_status || a.submission_status === "rejected"
  ).length

  return (
    <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg py-0 gap-3 overflow-hidden flex flex-col h-full bg-white dark:bg-card">
      <CardHeader className="px-5 py-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            <FileText className="size-3.5 text-violet-500" />
            Course Tasks
          </CardTitle>
          {!isLoading && (
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold",
              pendingCount > 0
                ? "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900"
                : "bg-muted text-muted-foreground"
            )}>
              {pendingCount} pending
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-4 pt-0 flex flex-col gap-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-md" />)}
          </div>
        ) : latest.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center gap-2 pb-8 min-h-[120px]">
            <CheckCircle2 className="size-7 text-muted-foreground/30" />
            <p className="text-xs font-semibold text-foreground">No course tasks yet!</p>
            <p className="text-[10px] text-muted-foreground">Your course tasks will appear here.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {latest.map((a) => {
                const overdue = isOverdue(a.due_date)
                const s = getStatusStyle(a.submission_status, overdue)
                const moduleId = (a as any).module_id ?? a.assignment_id
                const lessonHref =
                  a.course_id && a.week_id && moduleId
                    ? `/course/${a.course_id}/learn/${a.week_id}/${moduleId}`
                    : null
                return (
                  <Link
                    key={a.assignment_id}
                    href={lessonHref ?? "#"}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md border p-3 transition-all",
                      lessonHref && "hover:border-primary/40 hover:shadow-xs cursor-pointer",
                      s.border, s.bg
                    )}
                  >
                    <div className="min-w-0 flex-1 flex items-center gap-2">
                      <span className={cn("size-1.5 shrink-0 rounded-full", s.dot)} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">{a.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{a.course_title}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className={cn("text-[9px] font-bold uppercase tracking-wide", s.text)}>
                        {s.label}
                      </span>
                      {a.due_date && (
                        <span className={cn(
                          "flex items-center gap-0.5 text-[10px]",
                          overdue ? "text-destructive font-semibold" : "text-muted-foreground"
                        )}>
                          {overdue
                            ? <AlertCircle className="size-3" />
                            : <Clock className="size-3" />
                          }
                          {fmtDate(a.due_date)}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
            <Button asChild variant="outline" size="lg" className="w-full mt-auto gap-1 text-xs">
              <Link href="/assignments?tab=course">
                View all course tasks <ArrowRight className="size-3" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
