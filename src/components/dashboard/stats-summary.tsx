"use client"

import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  DollarSign,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useProgress } from "@/lib/hooks/useProgress"
import type { DashboardAssignment } from "@/types/dashboard"
import type { FeeDetail } from "@/types/fee"

type StatsSummaryProps = {
  submissions: DashboardAssignment[] | undefined
  feeEnrollments: FeeDetail | undefined
  isLoadingSubmissions: boolean
  isLoadingFee: boolean
}

export function StatsSummary({
  submissions,
  feeEnrollments,
  isLoadingSubmissions,
  isLoadingFee,
}: StatsSummaryProps) {
  const { progress } = useProgress()

  const totalSubmitted = submissions?.length ?? 0
  const totalApproved =
    submissions?.filter((s) => s.status === "approved").length ?? 0
  const totalPending =
    submissions?.filter((s) => s.status === "pending").length ?? 0

  const totalPaid = feeEnrollments?.paidAmount ?? 0
  const totalOutstanding = feeEnrollments?.outstandingBalance ?? 0

  const stats = [
    {
      id: "completed",
      Icon: CheckCircle2,
      label: "Lessons Completed",
      value: progress.completedSubModules.length,
      sub: `${progress.completedDays.length} days done`,
      accent: "from-emerald-500/10 to-emerald-500/5 ring-emerald-500/15",
      iconClass: "text-emerald-600 dark:text-emerald-400",
      isLoading: false,
    },
    {
      id: "assignments",
      Icon: ClipboardList,
      label: "Assignments Submitted",
      value: isLoadingSubmissions ? null : totalSubmitted,
      sub: isLoadingSubmissions
        ? ""
        : `${totalApproved} approved · ${totalPending} in review`,
      accent: "from-blue-500/10 to-blue-500/5 ring-blue-500/15",
      iconClass: "text-blue-600 dark:text-blue-400",
      isLoading: isLoadingSubmissions,
    },
    {
      id: "approved",
      Icon: BookOpenCheck,
      label: "Approved vs Pending",
      value: isLoadingSubmissions ? null : `${totalApproved}/${totalSubmitted}`,
      sub: isLoadingSubmissions
        ? ""
        : totalSubmitted > 0
          ? `${Math.round((totalApproved / totalSubmitted) * 100)}% approval rate`
          : "No submissions yet",
      accent: "from-primary/10 to-primary/5 ring-primary/15",
      iconClass: "text-primary",
      isLoading: isLoadingSubmissions,
    },
    {
      id: "fee",
      Icon: DollarSign,
      label: "Fees Paid",
      value: isLoadingFee ? null : `₹${totalPaid.toLocaleString("en-IN")}`,
      sub: isLoadingFee
        ? ""
        : totalOutstanding > 0
          ? `₹${totalOutstanding.toLocaleString("en-IN")} outstanding`
          : "No outstanding balance",
      accent:
        totalOutstanding > 0
          ? "from-amber-500/10 to-amber-500/5 ring-amber-500/15"
          : "from-emerald-500/10 to-emerald-500/5 ring-emerald-500/15",
      iconClass:
        totalOutstanding > 0
          ? "text-amber-600 dark:text-amber-400"
          : "text-emerald-600 dark:text-emerald-400",
      isLoading: isLoadingFee,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(
        ({ id, Icon, label, value, sub, accent, iconClass, isLoading }) => (
          <div
            key={id}
            className={`rounded-md bg-gradient-to-br p-4 ring-1 ${accent} flex flex-col gap-2`}
          >
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                {label}
              </p>
              <Icon className={`size-4 ${iconClass}`} />
            </div>

            {isLoading ? (
              <div className="space-y-1.5">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <p className="font-display text-foreground text-2xl leading-none font-bold">
                  {value ?? "—"}
                </p>
                <p className="text-muted-foreground text-[11px]">{sub}</p>
              </>
            )}
          </div>
        )
      )}
    </div>
  )
}
