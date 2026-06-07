"use client"

import Link from "next/link"
import { CreditCard, ArrowRight, AlertCircle, Clock, CheckCircle2 } from "lucide-react"

import { useStudentFee } from "@/lib/hooks/useStudentFee"
import type { StudentInstallment } from "@/lib/services/student-fee-service"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function isUrgent(inst: StudentInstallment): boolean {
  if (inst.status === "paid" || inst.status === "waived") return false
  if (inst.status === "overdue") return true
  const due = new Date(inst.dueDate)
  const sevenDays = new Date()
  sevenDays.setDate(sevenDays.getDate() + 7)
  return due <= sevenDays
}

export function DashboardFeeSummary() {
  const { data: enrollments, isLoading } = useStudentFee()

  const totalOutstanding = (enrollments ?? []).reduce((s, e) => s + e.outstandingBalance, 0)
  const totalPaid = (enrollments ?? []).reduce((s, e) => s + e.paidAmount, 0)
  const grandTotal = (enrollments ?? []).reduce((s, e) => s + e.totalAmount, 0)
  const pct = grandTotal > 0 ? Math.min(Math.round((totalPaid / grandTotal) * 100), 100) : 0

  const urgentInstallments = (enrollments ?? [])
    .flatMap((e) => e.installments.filter(isUrgent).map((inst) => ({ inst, courseTitle: e.courseTitle })))
    .slice(0, 3)

  const hasUrgent = urgentInstallments.length > 0
  const allPaid = grandTotal > 0 && totalOutstanding === 0

  return (
    <Card className="border-none shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-lg py-0 gap-3 overflow-hidden bg-white dark:bg-card">
      <CardHeader className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            <CreditCard className={cn(
              "size-3.5",
              hasUrgent ? "text-destructive" : "text-primary"
            )} />
            Fee Summary
          </CardTitle>
          {!isLoading && hasUrgent && (
            <Badge variant="destructive" className="text-[9px] px-2">
              Action Required
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-5 pt-0">
        {isLoading ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-md" />)}
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ) : (enrollments ?? []).length === 0 ? (
          <div className="flex flex-col items-center py-6 gap-2 text-center">
            <CreditCard className="size-7 text-muted-foreground/30" />
            <p className="text-xs font-semibold text-foreground">No fee records</p>
            <p className="text-[10px] text-muted-foreground">Contact admin for fee details.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="pr-4">
                <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Total</p>
                <p className="text-lg font-black text-foreground">{fmt(grandTotal)}</p>
              </div>
              <div className="px-4">
                <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Paid</p>
                <p className="text-lg font-black text-primary">{fmt(totalPaid)}</p>
              </div>
              <div className="pl-4">
                <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Due</p>
                <p className={cn(
                  "text-lg font-black",
                  totalOutstanding > 0
                    ? hasUrgent ? "text-destructive" : "text-amber-600 dark:text-amber-400"
                    : "text-primary"
                )}>
                  {fmt(totalOutstanding)}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground">Payment progress</span>
                <span className="text-[10px] font-bold text-foreground">{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>

            {/* Urgent installments */}
            {hasUrgent && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Urgent</p>
                {urgentInstallments.map(({ inst, courseTitle }) => (
                  <div
                    key={inst.id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-md border p-3",
                      inst.status === "overdue"
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {inst.status === "overdue"
                        ? <AlertCircle className="size-3.5 shrink-0 text-destructive" />
                        : <Clock className="size-3.5 shrink-0 text-amber-600" />
                      }
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{fmt(inst.remainingBalance)}</p>
                        <p className="text-[10px] text-muted-foreground">{courseTitle} · {fmtDate(inst.dueDate)}</p>
                      </div>
                    </div>
                    <Badge
                      variant={inst.status === "overdue" ? "destructive" : "secondary"}
                      className="shrink-0 text-[9px]"
                    >
                      {inst.status === "overdue" ? "Overdue" : "Due Soon"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {allPaid && (
              <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900 px-3 py-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <p className="text-xs font-semibold text-green-700 dark:text-green-400">All fees paid — great work!</p>
              </div>
            )}

            <Button asChild variant="outline" size="lg" className="w-full gap-1 text-xs">
              <Link href="/fees">
                View full fee details <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
