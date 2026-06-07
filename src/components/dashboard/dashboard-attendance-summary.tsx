"use client"

import { Users, Clock, AlertCircle, Calendar, TrendingUp } from "lucide-react"

import { useAttendanceHistory } from "@/lib/hooks/use-attendance"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

type StatPillProps = {
  label: string
  value: number
  colorClass: string
  bgClass: string
  borderClass: string
}

function StatPill({ label, value, colorClass, bgClass, borderClass }: StatPillProps) {
  return (
    <div className={cn(
      "flex flex-col items-center rounded-md border px-3 py-2 min-w-0",
      bgClass, borderClass
    )}>
      <span className={cn("text-base font-black", colorClass)}>{value}</span>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground mt-0.5">{label}</span>
    </div>
  )
}

export function DashboardAttendanceSummary() {
  const now = new Date()
  const { data, isLoading } = useAttendanceHistory(now.getFullYear(), now.getMonth() + 1)
  const summary = data?.summary

  const monthName = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" })

  const pct = summary?.percentage ?? 0
  const pctColor =
    pct >= 75 ? "text-green-600 dark:text-green-400" :
      pct >= 60 ? "text-amber-600 dark:text-amber-400" :
        "text-destructive"
  const progressColor =
    pct >= 75 ? "bg-primary" :
      pct >= 60 ? "bg-amber-400" :
        "bg-destructive"

  return (
    <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg py-0 gap-3 overflow-hidden bg-white dark:bg-card">
      <CardHeader className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            <Calendar className="size-3.5 text-primary" />
            This Month's Attendance
          </CardTitle>
          <span className="text-[10px] text-muted-foreground">{monthName}</span>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-5 pt-0">
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 flex-1 rounded-md" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 rounded-md" />)}
            </div>
          </div>
        ) : !summary ? (
          <div className="flex flex-col items-center py-6 gap-2 text-center">
            <Users className="size-7 text-muted-foreground/30" />
            <p className="text-xs font-semibold text-foreground">No attendance data</p>
            <p className="text-[10px] text-muted-foreground">Attendance for this month will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Big % + progress bar */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center shrink-0 w-16">
                <span className={cn("text-3xl font-black", pctColor)}>{pct}%</span>
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">Rate</span>
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">Attendance rate this month</span>
                  <TrendingUp className={cn("size-3.5", pctColor)} />
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", progressColor)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {pct < 75 && (
                  <p className="text-[10px] text-amber-600 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    Below 75% minimum attendance
                  </p>
                )}
              </div>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-4 gap-2">
              <StatPill
                label="Present"
                value={summary.present}
                colorClass="text-green-700 dark:text-green-400"
                bgClass="bg-green-50 dark:bg-green-950/30"
                borderClass="border-green-200 dark:border-green-900"
              />
              <StatPill
                label="Late"
                value={summary.late}
                colorClass="text-amber-700 dark:text-amber-400"
                bgClass="bg-amber-50 dark:bg-amber-950/30"
                borderClass="border-amber-200 dark:border-amber-900"
              />
              <StatPill
                label="Absent"
                value={summary.absent}
                colorClass="text-destructive"
                bgClass="bg-destructive/5"
                borderClass="border-destructive/20"
              />
              <StatPill
                label="Leave"
                value={summary.leave}
                colorClass="text-sky-700 dark:text-sky-400"
                bgClass="bg-sky-50 dark:bg-sky-950/30"
                borderClass="border-sky-200 dark:border-sky-900"
              />
            </div>

            {/* Extra: half day + early checkout */}
            {(summary.halfDay > 0 || summary.earlyCheckout > 0) && (
              <div className="flex gap-2 text-[10px] text-muted-foreground border-t border-border pt-2">
                {summary.halfDay > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {summary.halfDay} half-day{summary.halfDay > 1 ? "s" : ""}
                  </span>
                )}
                {summary.earlyCheckout > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {summary.earlyCheckout} early checkout{summary.earlyCheckout > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
