import {
  AlertCircle,
  Check,
  Clock,
  Minus,
} from "lucide-react"
import type {
  StudentFeeEnrollment,
  StudentInstallment,
} from "@/lib/services/student-fee-service"

export function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n)
}

export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function fmtMode(mode: string) {
  const MAP: Record<string, string> = {
    cash: "Cash",
    upi: "UPI",
    bank_transfer: "Bank Transfer",
    cheque: "Cheque",
    other: "Other",
  }
  return MAP[mode] ?? mode
}

type InstStatus = StudentInstallment["status"]

export const STATUS_CFG: Record<
  InstStatus,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    dotCls: string
    badgeCls: string
    rowCls: string
    lineCls: string
  }
> = {
  paid: {
    label: "Paid",
    icon: Check,
    dotCls: "bg-transparent border-accent text-accent",
    badgeCls: "bg-status-approved/15 text-status-approved-foreground border-status-approved/30",
    rowCls: "",
    lineCls: "bg-accent/60",
  },
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    dotCls: "bg-transparent border-status-todo text-status-todo",
    badgeCls: "bg-status-todo/15 text-status-todo-foreground border-status-todo/30",
    rowCls: "",
    lineCls: "bg-border",
  },
  partially_paid: {
    label: "Partial",
    icon: Minus,
    dotCls: "bg-transparent border-status-pending text-status-pending",
    badgeCls: "bg-status-pending/15 text-status-pending-foreground border-status-pending/30",
    rowCls: "ring-1 ring-status-pending/40 bg-status-pending/5",
    lineCls: "bg-status-pending/50",
  },
  overdue: {
    label: "Overdue",
    icon: AlertCircle,
    dotCls: "bg-transparent border-status-rejected text-status-rejected",
    badgeCls: "bg-status-rejected/15 text-status-rejected-foreground border-status-rejected/30",
    rowCls: "ring-1 ring-status-rejected/40 bg-status-rejected/5",
    lineCls: "bg-status-rejected/40",
  },
  waived: {
    label: "Waived",
    icon: Check,
    dotCls: "bg-transparent border-purple-400 text-purple-500 dark:text-purple-400",
    badgeCls: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30",
    rowCls: "",
    lineCls: "bg-purple-200 dark:bg-purple-800",
  },
}

export function computeOverallStatus(
  enrollments: StudentFeeEnrollment[]
): { label: string; cls: string } {
  const hasOverdue = enrollments.some((e) =>
    e.installments.some((i) => i.status === "overdue")
  )
  if (hasOverdue)
    return {
      label: "Overdue",
      cls: "bg-status-rejected/15 text-status-rejected-foreground border-status-rejected/40",
    }
  const hasPartial = enrollments.some((e) =>
    e.installments.some((i) => i.status === "partially_paid")
  )
  if (hasPartial)
    return {
      label: "Partial",
      cls: "bg-status-pending/15 text-status-pending-foreground border-status-pending/40",
    }
  const allPaid = enrollments.every((e) => e.outstandingBalance === 0)
  if (allPaid)
    return {
      label: "Fully Paid",
      cls: "bg-status-approved/15 text-status-approved-foreground border-status-approved/40",
    }
  return {
    label: "Up to date",
    cls: "bg-status-todo/15 text-status-todo-foreground border-status-todo/40",
  }
}
