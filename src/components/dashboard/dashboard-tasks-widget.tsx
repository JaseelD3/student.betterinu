"use client"

import Link from "next/link"
import { ListTodo, Clock, ArrowRight, CheckCircle2, AlertCircle, Circle } from "lucide-react"

import { useStandaloneAssignments } from "@/lib/hooks/use-assignments"
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
        dot: "bg-sky-500",
        label: "To Do",
        text: "text-sky-600",
      }
  }
}

export function DashboardTasksWidget() {
  const { data: tasks, isLoading } = useStandaloneAssignments()

  // Show latest 3 tasks regardless of status, sorted by created_at desc
  const latest = (tasks ?? [])
    .sort((a, b) => {
      const da = (a as any).created_at ?? ""
      const db = (b as any).created_at ?? ""
      return db.localeCompare(da)
    })
    .slice(0, 3)

  const pendingCount = (tasks ?? []).filter(
    (t) => !t.submission_id || t.submission_status === "rejected"
  ).length

  return (
    <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg py-0 gap-3 overflow-hidden flex flex-col h-full bg-white dark:bg-card">
      <CardHeader className="px-5 py-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            <ListTodo className="size-3.5 text-sky-500" />
            My Tasks
          </CardTitle>
          {!isLoading && (
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold",
              pendingCount > 0
                ? "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900"
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
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
          </div>
        ) : latest.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center gap-2 pb-8 min-h-[120px]">
            <CheckCircle2 className="size-7 text-muted-foreground/30" />
            <p className="text-xs font-semibold text-foreground">No tasks yet!</p>
            <p className="text-[10px] text-muted-foreground">You have no assigned tasks.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {latest.map((t) => {
                const overdue = isOverdue(t.due_date)
                const s = getStatusStyle(t.submission_status, overdue)
                return (
                  <div
                    key={t.assignment_id}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md border p-3",
                      s.border, s.bg
                    )}
                  >
                    <div className="min-w-0 flex-1 flex items-center gap-2">
                      <span className={cn("size-1.5 shrink-0 rounded-full", s.dot)} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">{t.title}</p>
                        {t.course_title && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">{t.course_title}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className={cn("text-[9px] font-bold uppercase tracking-wide", s.text)}>
                        {s.label}
                      </span>
                      {t.due_date && (
                        <span className={cn(
                          "flex items-center gap-0.5 text-[10px]",
                          overdue ? "text-destructive font-semibold" : "text-muted-foreground"
                        )}>
                          {overdue
                            ? <AlertCircle className="size-3" />
                            : <Clock className="size-3" />
                          }
                          {fmtDate(t.due_date)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <Button asChild variant="outline" size="lg" className="w-full mt-auto gap-1 text-xs">
              <Link href="/assignments?tab=other">
                View my tasks <ArrowRight className="size-3" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
