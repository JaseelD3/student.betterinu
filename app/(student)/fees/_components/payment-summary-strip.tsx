import { CalendarDays, MessageSquareWarning } from "lucide-react"
import type {
  StudentFeeEnrollment,
  StudentInstallment,
} from "@/lib/services/student-fee-service"
import { fmt, fmtDate } from "./fee-utils"

export function PaymentSummaryStrip({
  enrollments,
}: {
  enrollments: StudentFeeEnrollment[]
}) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  let nextInst: StudentInstallment | null = null
  let nextEnrTitle = ""

  for (const enr of enrollments) {
    for (const inst of enr.installments) {
      if (inst.status === "paid" || inst.status === "waived") continue
      const due = new Date(inst.dueDate)
      due.setHours(0, 0, 0, 0)
      if (!nextInst || due < new Date(nextInst.dueDate)) {
        nextInst = inst
        nextEnrTitle = enr.courseTitle
      }
    }
  }

  const hasOverdue = enrollments.some((e) =>
    e.installments.some((i) => i.status === "overdue")
  )
  const overdueCount = enrollments.reduce(
    (count, e) =>
      count + e.installments.filter((i) => i.status === "overdue").length,
    0
  )

  if (!nextInst && !hasOverdue) return null

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border bg-card px-4 py-3 shadow-xs">
      {nextInst && (
        <div className="flex flex-1 items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <CalendarDays className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase">
              Next Due
            </p>
            <p className="text-sm font-bold text-foreground">
              {fmt(nextInst.remainingBalance)}{" "}
              <span className="font-normal text-muted-foreground">
                — {fmtDate(nextInst.dueDate)}
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground">{nextEnrTitle}</p>
          </div>
        </div>
      )}

      {hasOverdue && (
        <div className="flex items-center gap-2 rounded-md border border-status-rejected/30 bg-status-rejected/10 px-3 py-2">
          <MessageSquareWarning className="size-4 shrink-0 text-status-rejected-foreground" />
          <p className="text-xs font-semibold text-status-rejected-foreground">
            {overdueCount} overdue — please contact admin
          </p>
        </div>
      )}
    </div>
  )
}
