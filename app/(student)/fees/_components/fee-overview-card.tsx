import { Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { StudentFeeEnrollment } from "@/lib/services/student-fee-service"
import { fmt, computeOverallStatus } from "./fee-utils"

export function FeeOverviewCard({
  enrollments,
}: {
  enrollments: StudentFeeEnrollment[]
}) {
  const totalFee = enrollments.reduce((s, e) => s + e.totalAmount, 0)
  const totalPaid = enrollments.reduce((s, e) => s + e.paidAmount, 0)
  const totalBalance = enrollments.reduce(
    (s, e) => s + e.outstandingBalance,
    0
  )
  const pct = totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0
  const status = computeOverallStatus(enrollments)

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent shadow-sm ring-1 ring-primary/15">
      <CardContent className="p-5 sm:p-6">
        {/* Status badge */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
              <Wallet className="size-4.5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Fee Overview
              </p>
            </div>
          </div>
          <span
            className={cn(
              "rounded-md border px-2.5 py-0.5 text-xs font-bold",
              status.cls
            )}
          >
            {status.label}
          </span>
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              Total Fee
            </p>
            <p className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
              {fmt(totalFee)}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              Paid
            </p>
            <p className="text-xl font-black tracking-tight text-accent sm:text-2xl">
              {fmt(totalPaid)}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              Balance
            </p>
            <p
              className={cn(
                "text-xl font-black tracking-tight sm:text-2xl",
                totalBalance > 0
                  ? enrollments.some((e) =>
                      e.installments.some((i) => i.status === "overdue")
                    )
                    ? "text-status-rejected-foreground"
                    : "text-status-pending-foreground"
                  : "text-status-approved-foreground"
              )}
            >
              {fmt(totalBalance)}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Payment progress </span>
            <span className="font-bold text-foreground">{pct}%</span>
          </div>
          <Progress value={pct} className="h-2.5 rounded-full" indicatorClassName="bg-accent" />
        </div>
      </CardContent>
    </Card>
  )
}
