import { CalendarDays, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { StudentInstallment } from "@/lib/services/student-fee-service"
import { STATUS_CFG, fmt, fmtDate } from "./fee-utils"

export function InstallmentTimelineNode({
  installment,
  total,
  isLast,
}: {
  installment: StudentInstallment
  total: number
  isLast: boolean
}) {
  const cfg = STATUS_CFG[installment.status]
  const StatusIcon = cfg.icon
  const hasWaiver = installment.waiverReduction > 0

  return (
    <div className="flex gap-4">
      {/* Timeline track */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            cfg.dotCls
          )}
        >
          <StatusIcon className="size-3.5 text-white" />
        </div>
        {!isLast && <div className={cn("mt-1 w-0.5 flex-1 min-h-8", cfg.lineCls)} />}
      </div>

      {/* Card */}
      <div
        className={cn(
          "mb-4 flex-1 rounded-md border bg-card p-3.5 shadow-xs transition-all",
          cfg.rowCls
        )}
      >
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-foreground">
              Installment {installment.installmentNumber} of {total}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              <CalendarDays className="size-3" />
              Due {fmtDate(installment.dueDate)}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide",
              cfg.badgeCls
            )}
          >
            <StatusIcon className="size-2.5" />
            {cfg.label}
          </Badge>
        </div>

        {/* Amounts */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-muted/40 p-2">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase">
              Amount Due
            </p>
            <p className="text-sm font-black text-foreground">
              {fmt(installment.totalAmount)}
            </p>
            {hasWaiver && (
              <p className="text-[9px] text-muted-foreground line-through">
                {fmt(
                  installment.totalAmount +
                    installment.waiverReduction +
                    installment.overpaymentReduction
                )}
              </p>
            )}
          </div>
          <div className="rounded-md bg-muted/40 p-2">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase">
              Paid
            </p>
            <p className="text-sm font-black text-status-approved-foreground">
              {fmt(installment.paidAmount)}
            </p>
          </div>
          <div className="rounded-md bg-muted/40 p-2">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase">
              Balance
            </p>
            <p
              className={cn(
                "text-sm font-black",
                installment.remainingBalance > 0
                  ? installment.status === "overdue"
                    ? "text-status-rejected-foreground"
                    : "text-status-pending-foreground"
                  : "text-status-approved-foreground"
              )}
            >
              {fmt(installment.remainingBalance)}
            </p>
          </div>
        </div>

        {/* Progress */}
        {installment.totalAmount > 0 && installment.status !== "waived" && (
          <div className="mt-2.5 flex items-center gap-2">
            <Progress
              value={Math.min(
                Math.round(
                  (installment.paidAmount / installment.totalAmount) * 100
                ),
                100
              )}
              className="h-1 flex-1"
            />
            <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
              {Math.min(
                Math.round(
                  (installment.paidAmount / installment.totalAmount) * 100
                ),
                100
              )}
              %
            </span>
          </div>
        )}

        {/* Waiver note */}
        {hasWaiver && (
          <div className="mt-2 flex items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1 text-[10px] text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/20 dark:text-purple-400">
            <Gift className="size-3 shrink-0" />
            <span>
              Fee waiver of{" "}
              <span className="font-semibold">
                {fmt(installment.waiverReduction)}
              </span>{" "}
              applied
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
