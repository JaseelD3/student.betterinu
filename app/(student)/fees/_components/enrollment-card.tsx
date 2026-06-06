import { CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import type { StudentFeeEnrollment } from "@/lib/services/student-fee-service"
import { fmt } from "./fee-utils"
import { InstallmentTimelineNode } from "./installment-timeline-node"
import { PaymentHistory } from "./payment-history"

export function EnrollmentCard({ enrollment }: { enrollment: StudentFeeEnrollment }) {
  const isInstallment = enrollment.paymentType === "installment"
  const pct =
    enrollment.totalAmount > 0
      ? Math.min(Math.round((enrollment.paidAmount / enrollment.totalAmount) * 100), 100)
      : 0
  const hasWaiver = enrollment.totalWaiverReduction > 0

  return (
    <div className="flex flex-col gap-3">

      {/* ── Main card ──────────────────────────────────────── */}
      <div className="overflow-hidden rounded-md border border-border bg-card">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <CreditCard className="size-3.5" />
            </div>
            <p className="truncate text-sm font-bold text-foreground">
              {enrollment.courseTitle}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {isInstallment ? "Installment" : "One-time"}
            </span>
            {enrollment.isPlanCustomized && (
              <span className="rounded-md border border-primary/30 bg-primary/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Custom
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5">

          {/* 3-col fee stats */}
          <div className="mb-5 grid grid-cols-3 divide-x divide-border">
            <div className="pr-5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Total Fee
              </p>
              <p className="text-xl font-black text-foreground">
                {fmt(enrollment.totalAmount)}
              </p>
              {hasWaiver && (
                <p className="mt-1 text-[11px] text-muted-foreground line-through">
                  {fmt(enrollment.originalTotalAmount)}
                </p>
              )}
            </div>

            <div className="px-5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Paid
              </p>
              <p className="text-xl font-black text-accent">
                {fmt(enrollment.paidAmount)}
              </p>
            </div>

            <div className="pl-5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Outstanding
              </p>
              <p
                className={cn(
                  "text-xl font-black",
                  enrollment.outstandingBalance > 0
                    ? enrollment.installments.some((inst) => inst.status === "overdue")
                      ? "text-status-rejected-foreground"
                      : "text-status-pending-foreground"
                    : "text-status-approved-foreground"
                )}
              >
                {fmt(enrollment.outstandingBalance)}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Payment progress</span>
              <span className="text-xs font-bold text-foreground">{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" indicatorClassName="bg-primary" />
          </div>

          {/* Waiver strip */}
          {hasWaiver && (
            <div className="mt-4 flex flex-wrap gap-4 rounded-md border border-success/25 bg-success/8 px-3.5 py-2.5">
              <span className="text-[11px] text-muted-foreground">
                Original:{" "}
                <span className="font-medium text-foreground line-through">
                  {fmt(enrollment.originalTotalAmount)}
                </span>
              </span>
              <span className="text-[11px] font-bold text-success">
                Waiver: −{fmt(enrollment.totalWaiverReduction)}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Payable:{" "}
                <span className="font-semibold text-foreground">
                  {fmt(enrollment.totalAmount)}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Installment Timeline ───────────────────────────── */}
      {isInstallment && (
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <div className="border-b border-border px-5 py-3.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Installment Timeline
            </p>
          </div>
          <div className="px-5 py-4">
            {enrollment.installments.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
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
          </div>
        </div>
      )}

      {/* ── Payment History ────────────────────────────────── */}
      {enrollment.paymentLogs.length > 0 && (
        <PaymentHistory logs={enrollment.paymentLogs} />
      )}
    </div>
  )
}
