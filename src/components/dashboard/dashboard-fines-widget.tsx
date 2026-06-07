"use client"

import Link from "next/link"
import { BadgeAlert, AlertTriangle, CheckCheck, MinusCircle, ArrowRight } from "lucide-react"

import { useFines } from "@/lib/hooks/use-attendance"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function DashboardFinesWidget() {
  const { data: finesData, isLoading } = useFines()
  const allFines = finesData?.fines ?? []
  const pendingFines = allFines.filter((f) => f.status === "pending")
  const recentFines = allFines.slice(0, 4)
  const totalPending = pendingFines.reduce((s, f) => s + Number(f.fine_amount), 0)

  return (
    <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg py-0 gap-3 overflow-hidden flex flex-col h-full bg-white dark:bg-card">
      <CardHeader className="px-5 py-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            <BadgeAlert className={cn(
              "size-3.5",
              pendingFines.length > 0 ? "text-amber-500" : "text-muted-foreground"
            )} />
            Active Fines
          </CardTitle>
          {!isLoading && pendingFines.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400">
              <AlertTriangle className="size-2.5" />
              {pendingFines.length} Unpaid
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-4 pt-0 flex flex-col gap-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
          </div>
        ) : allFines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center gap-2 pb-8 min-h-[120px]">
            <CheckCheck className="size-7 text-muted-foreground/30" />
            <p className="text-xs font-semibold text-foreground">No active fines</p>
            <p className="text-[10px] text-muted-foreground">Your record is clean!</p>
          </div>
        ) : (
          <>
            {/* Pending total banner */}
            {pendingFines.length > 0 && (
              <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 px-3 py-2.5">
                <AlertTriangle className="size-3.5 shrink-0 text-amber-600 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-400">
                    ₹{totalPending.toLocaleString("en-IN")} due
                  </p>
                  <p className="text-[10px] text-amber-700 dark:text-amber-500">
                    {pendingFines.length} unpaid fine{pendingFines.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {recentFines.map((fine) => {
                const isAbsent = fine.fine_type === "absent"
                const dateLabel = isAbsent && fine.absent_date
                  ? new Date(fine.absent_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                  : fine.period_label
                return (
                  <div key={fine.id} className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground">{isAbsent ? "Absence Fine" : "Leave Fine"}</p>
                      <p className="text-[10px] text-muted-foreground">{dateLabel}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className={cn(
                        "text-xs font-bold",
                        fine.status === "pending" && "text-amber-700",
                        fine.status === "paid" && "text-green-700 dark:text-green-400",
                        fine.status === "waived" && "line-through text-muted-foreground"
                      )}>
                        ₹{Number(fine.fine_amount).toLocaleString("en-IN")}
                      </span>
                      <span className={cn(
                        "rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase",
                        fine.status === "pending" && "bg-amber-50 text-amber-700 border-amber-200",
                        fine.status === "paid" && "bg-green-50 text-green-700 border-green-200",
                        fine.status === "waived" && "bg-slate-50 text-slate-500 border-slate-200"
                      )}>
                        {fine.status === "paid" && <CheckCheck className="mr-0.5 inline size-2.5" />}
                        {fine.status === "waived" && <MinusCircle className="mr-0.5 inline size-2.5" />}
                        {fine.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <Button asChild variant="outline" size="lg" className="w-full mt-auto gap-1 text-xs">
              <Link href="/fees#fines">
                View all fines <ArrowRight className="size-3" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
