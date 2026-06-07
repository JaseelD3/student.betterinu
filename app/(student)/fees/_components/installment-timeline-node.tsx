import { CalendarDays, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
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

  const pct = installment.status === "waived"
    ? 100
    : (installment.totalAmount > 0
        ? Math.min(Math.round((installment.paidAmount / installment.totalAmount) * 100), 100)
        : 0)

  return (
    <div className="flex gap-3">

      {/* ── Timeline track ───────────────────────────────── */}
      <div className="flex flex-col items-center pt-0.5">
        <div
          className={cn(
            "flex size-5 md:size-7 shrink-0 items-center justify-center rounded-full border-2",
            cfg.dotCls
          )}
        >
          <StatusIcon className="size-2.5 md:size-3" />
        </div>
        {!isLast && (
          <div className={cn("mt-1 w-px flex-1 min-h-8", cfg.lineCls)} />
        )}
      </div>

      {/* ── Card ─────────────────────────────────────────── */}
      <div
        className={cn(
          "mb-4 flex-1 overflow-hidden rounded-md border bg-card transition-all",
          cfg.rowCls
        )}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-bold text-foreground">
              Installment {installment.installmentNumber}
              <span className="font-normal text-muted-foreground"> of {total}</span>
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3" />
              Due {fmtDate(installment.dueDate)}
            </p>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
              cfg.badgeCls
            )}
          >
            <StatusIcon className="size-2.5" />
            {cfg.label}
          </span>
        </div>

        {/* Amounts — 3 col with dividers */}
        <div className="grid grid-cols-3 divide-x divide-border px-0">
          {/* Amount Due */}
          <div className="flex flex-col gap-0.5 px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              Amount Due
            </p>
            <p className="text-base font-black text-foreground">
              {fmt(installment.totalAmount)}
            </p>
            {hasWaiver && (
              <p className="text-[10px] text-muted-foreground line-through">
                {fmt(installment.totalAmount + installment.waiverReduction + installment.overpaymentReduction)}
              </p>
            )}
          </div>

          {/* Paid */}
          <div className="flex flex-col gap-0.5 px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              Paid
            </p>
            <p className="text-base font-black text-accent">
              {fmt(installment.paidAmount)}
            </p>
          </div>

          {/* Balance */}
          <div className="flex flex-col gap-0.5 px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              Balance
            </p>
            <p
              className={cn(
                "text-base font-black",
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

        {/* Progress + waiver — bottom section */}
        {(installment.totalAmount > 0 || installment.status === "waived" || hasWaiver) && (
          <div className="flex flex-col gap-2 border-t border-border px-4 py-3">
            {/* Progress bar */}
            {(installment.totalAmount > 0 || installment.status === "waived") && (
              <div className="flex items-center gap-2.5">
                <Progress
                  value={pct}
                  className="h-1 flex-1"
                  indicatorClassName="bg-primary"
                />
                <span className="w-8 shrink-0 text-right text-[10px] font-semibold text-muted-foreground">
                  {pct}%
                </span>
              </div>
            )}

            {/* Waiver note */}
            {hasWaiver && (
              <div className="flex items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-[10px] text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/20 dark:text-purple-400">
                <Gift className="size-3 shrink-0" />
                Fee waiver of{" "}
                <span className="font-semibold">{fmt(installment.waiverReduction)}</span>{" "}
                applied
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}