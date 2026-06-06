import { AlertCircle, AlertTriangle } from "lucide-react"
import type {
  StudentFeeEnrollment,
  StudentInstallment,
} from "@/lib/services/student-fee-service"
import { fmt, fmtDate } from "./fee-utils"

export function ReminderBanners({
  enrollments,
}: {
  enrollments: StudentFeeEnrollment[]
}) {
  let overdueCount = 0
  let nextDueInstallment: StudentInstallment | null = null
  let nextDueEnrollmentTitle = ""

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sevenDaysLater = new Date(today)
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

  for (const enr of enrollments) {
    for (const inst of enr.installments) {
      if (inst.status === "paid" || inst.status === "waived") continue
      if (inst.status === "overdue") {
        overdueCount++
        continue
      }
      const dueDate = new Date(inst.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      if (dueDate <= sevenDaysLater && inst.remainingBalance > 0) {
        if (!nextDueInstallment || dueDate < new Date(nextDueInstallment.dueDate)) {
          nextDueInstallment = inst
          nextDueEnrollmentTitle = enr.courseTitle
        }
      }
    }
  }

  if (overdueCount === 0 && !nextDueInstallment) return null

  return (
    <div className="space-y-3">
      {overdueCount > 0 && (
        <div className="flex items-start gap-3 rounded-md border border-status-rejected/30 bg-status-rejected/10 px-4 py-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-status-rejected-foreground" />
          <div>
            <p className="text-sm font-bold text-status-rejected-foreground">
              You have {overdueCount} overdue payment{overdueCount > 1 ? "s" : ""}
            </p>
            <p className="mt-0.5 text-xs text-status-rejected-foreground/80">
              Please contact the admin at the earliest to avoid further penalties.
            </p>
          </div>
        </div>
      )}
      {nextDueInstallment && (
        <div className="flex items-start gap-3 rounded-md border border-status-pending/30 bg-status-pending/10 px-4 py-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-status-pending-foreground" />
          <div>
            <p className="text-sm font-bold text-status-pending-foreground">
              Upcoming payment reminder
            </p>
            <p className="mt-0.5 text-xs text-status-pending-foreground/80">
              Your next installment of{" "}
              <span className="font-semibold">
                {fmt(nextDueInstallment.remainingBalance)}
              </span>{" "}
              for{" "}
              <span className="font-semibold">{nextDueEnrollmentTitle}</span>{" "}
              is due on{" "}
              <span className="font-semibold">
                {fmtDate(nextDueInstallment.dueDate)}
              </span>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
