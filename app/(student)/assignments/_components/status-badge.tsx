import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

// ── Status variant config using CSS tokens only ──────────────────────────────
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
  {
    variants: {
      status: {
        todo: "bg-blue-50/80 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30",
        pending:
          "bg-amber-50/80 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
        approved:
          "bg-emerald-50/80 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30",
        rejected:
          "bg-rose-50/80 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30",
      },
    },
    defaultVariants: { status: "todo" },
  },
)

const STATUS_ICON = {
  todo: AlertCircle,
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
} as const

const STATUS_LABEL = {
  todo: "To Do",
  pending: "Under Review",
  approved: "Approved",
  rejected: "Needs Revision",
} as const

type StatusKey = keyof typeof STATUS_LABEL

type StatusBadgeProps = VariantProps<typeof badgeVariants> & {
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = (status ?? "todo") as StatusKey
  const Icon = STATUS_ICON[key]

  return (
    <span className={cn(badgeVariants({ status: key }), className)}>
      <Icon className="size-3" aria-hidden />
      {STATUS_LABEL[key]}
    </span>
  )
}

export { STATUS_LABEL, STATUS_ICON, type StatusKey }
