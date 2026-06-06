import { CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { StudentFeeEnrollment } from "@/lib/services/student-fee-service"
import { InstallmentTimelineNode } from "./installment-timeline-node"
import { PaymentHistory } from "./payment-history"
import { fmt } from "./fee-utils"

export function EnrollmentCard({
  enrollment,
}: {
  enrollment: StudentFeeEnrollment
}) {
  const isInstallment = enrollment.paymentType === "installment"
  const pct =
    enrollment.totalAmount > 0
      ? Math.min(
          Math.round(
            (enrollment.paidAmount / enrollment.totalAmount) * 100
          ),
          100
        )
      : 0
  const hasWaiver = enrollment.totalWaiverReduction > 0

  return (
    <div className="space-y-4">
      {/* Enrollment Header */}
      <Card className="gap-0">
        <CardHeader className="border-b pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">
                {enrollment.courseTitle}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-semibold capitalize">
                {isInstallment ? "Installment Plan" : "One-time Payment"}
              </Badge>
              {enrollment.isPlanCustomized && (
                <Badge
                  variant="outline"
                  className="border-status-todo/30 bg-status-todo/10 text-[10px] font-semibold text-status-todo-foreground"
                >
                  Custom Plan
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Fee summary numbers */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Total Fee</p>
              <p className="text-lg font-black text-foreground">{fmt(enrollment.totalAmount)}</p>
              {hasWaiver && (
                <p className="text-[10px] text-muted-foreground line-through">
                  {fmt(enrollment.originalTotalAmount)}
                </p>
              )}
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Paid</p>
              <p className="text-lg font-black text-status-approved-foreground">{fmt(enrollment.paidAmount)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Outstanding</p>
              <p className={cn("text-lg font-black", enrollment.outstandingBalance > 0 ? "text-status-pending-foreground" : "text-status-approved-foreground")}>
                {fmt(enrollment.outstandingBalance)}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Payment progress</span>
              <span className="font-bold text-foreground">{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" indicatorClassName="bg-accent" />
          </div>

          {/* Waiver summary */}
          {hasWaiver && (
            <div className="mt-3 flex flex-wrap gap-3 rounded-md bg-status-approved/10 border border-status-approved/30 px-3 py-2 text-[11px] text-muted-foreground">
              <span>
                Original:{" "}
                <span className="font-medium text-foreground line-through">
                  {fmt(enrollment.originalTotalAmount)}
                </span>
              </span>
              <span className="font-semibold text-status-approved-foreground">
                Waiver: −{fmt(enrollment.totalWaiverReduction)}
              </span>
              <span>
                Payable:{" "}
                <span className="font-semibold text-foreground">
                  {fmt(enrollment.totalAmount)}
                </span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Installment Timeline */}
      {isInstallment && (
        <Card className="gap-0">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Installment Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {enrollment.installments.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No installments found.
              </p>
            ) : (
              enrollment.installments.map((inst, idx) => (
                <InstallmentTimelineNode
                  key={inst.id}
                  installment={inst}
                  total={enrollment.installments.length}
                  isLast={idx === enrollment.installments.length - 1}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {enrollment.paymentLogs.length > 0 && (
        <PaymentHistory logs={enrollment.paymentLogs} />
      )}
    </div>
  )
}
