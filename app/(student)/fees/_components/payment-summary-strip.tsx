import { AlertCircle, CalendarDays } from "lucide-react"
import type {
  StudentFeeEnrollment,
  StudentInstallment,
} from "@/lib/services/student-fee-service"
import { fmt, fmtDate } from "./fee-utils"

export function PaymentSummaryStrip({ enrollments }: { enrollments: StudentFeeEnrollment[] }) {
  let nextInst: StudentInstallment | null = null
  let nextEnrTitle = ""

  for (const enr of enrollments) {
    for (const inst of enr.installments) {
      if (inst.status === "paid" || inst.status === "waived") continue
      const due = new Date(inst.dueDate)
      if (!nextInst || due < new Date(nextInst.dueDate)) {
        nextInst = inst
        nextEnrTitle = enr.courseTitle
      }
    }
  }

  const overdueCount = enrollments.reduce(
    (n, e) => n + e.installments.filter((i) => i.status === "overdue").length,
    0
  )

  if (!nextInst && overdueCount === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-md border border-border bg-card px-5 py-3.5 ">
      {nextInst && (
        <div className="flex flex-1 items-center gap-3 min-w-[180px]">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Next Due
            </p>
            <p className="text-sm font-bold text-foreground">
              {fmt(nextInst.remainingBalance)}{" "}
              <span className="font-normal text-muted-foreground">
                — {fmtDate(nextInst.dueDate)}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground">{nextEnrTitle}</p>
          </div>
        </div>
      )}

      {overdueCount > 0 && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          <AlertCircle className="size-3.5 shrink-0 text-destructive" />
          <p className="text-xs font-bold text-destructive">
            {overdueCount} overdue — contact admin
          </p>
        </div>
      )}
    </div>
  )
}
