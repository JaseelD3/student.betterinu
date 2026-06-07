"use client"

import Link from "next/link"
import { FileText, Clock, ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

import { useCourseAssignments } from "@/lib/hooks/use-assignments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
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

export function DashboardAssignmentsWidget() {
  const { data: assignments, isLoading } = useCourseAssignments()

  // Show only pending/unsubmitted, sorted by due date
  const pending = (assignments ?? [])
    .filter((a) => !a.submission || a.submission.status === "rejected")
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
    .slice(0, 4)

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
              pending.length > 0
                ? "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900"
                : "bg-muted text-muted-foreground"
            )}>
              {pending.length} pending
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-4 pt-0 flex flex-col gap-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-md" />)}
          </div>
        ) : pending.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center gap-2 pb-8 min-h-[120px]">
            <CheckCircle2 className="size-7 text-muted-foreground/30" />
            <p className="text-xs font-semibold text-foreground">All caught up!</p>
            <p className="text-[10px] text-muted-foreground">No pending course tasks.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {pending.map((a) => {
                const overdue = isOverdue(a.dueDate)
                const wasRejected = a.submission?.status === "rejected"
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "flex items-start justify-between gap-2 rounded-md border p-3",
                      overdue
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-border bg-muted/40"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.courseTitle}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {wasRejected && (
                        <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
                          <XCircle className="mr-0.5 inline size-2.5" />
                          Rejected
                        </Badge>
                      )}
                      {a.dueDate && (
                        <span className={cn(
                          "flex items-center gap-0.5 text-[10px]",
                          overdue ? "text-destructive font-semibold" : "text-muted-foreground"
                        )}>
                          {overdue
                            ? <AlertCircle className="size-3" />
                            : <Clock className="size-3" />
                          }
                          {fmtDate(a.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
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
