import { AlertCircle, AlertTriangle } from "lucide-react"
import type {
  StudentFeeEnrollment,
  StudentInstallment,
} from "@/lib/services/student-fee-service"
import { fmt, fmtDate } from "./fee-utils"

export function ReminderBanners({ enrollments }: { enrollments: StudentFeeEnrollment[] }) {
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
      if (inst.status === "overdue") { overdueCount++; continue }
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
    <div className="flex flex-col gap-2.5">
      {overdueCount > 0 && (
        <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
          <div className="mt-0.5 h-full w-0.5 self-stretch rounded-full bg-destructive shrink-0" />
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-bold text-destructive">
              {overdueCount} overdue payment{overdueCount > 1 ? "s" : ""}
            </p>
            <p className="mt-0.5 text-xs text-destructive/80">
              Please contact the admin at the earliest to avoid further penalties.
            </p>
          </div>
        </div>
      )}

      {nextDueInstallment && (
        <div className="flex items-start gap-3 rounded-md border border-warning/30 bg-warning/10 px-4 py-3">
          <div className="mt-0.5 h-full w-0.5 self-stretch rounded-full bg-warning shrink-0" />
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <div>
            <p className="text-sm font-bold text-warning">
              Upcoming payment reminder
            </p>
            <p className="mt-0.5 text-xs text-warning/80">
              Your next installment of{" "}
              <span className="font-semibold">{fmt(nextDueInstallment.remainingBalance)}</span>{" "}
              for <span className="font-semibold">{nextDueEnrollmentTitle}</span> is due on{" "}
              <span className="font-semibold">{fmtDate(nextDueInstallment.dueDate)}</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
