"use client"

import { Lock } from "lucide-react"
import type { Week } from "@/types"
import { notify } from "@/lib/utils"

export function LockedWeekCard({
  week,
  previousWeekNumber,
}: {
  week: Week
  previousWeekNumber: number
}) {
  return (
    <button
      aria-disabled="true"
      className="group border-border relative w-full cursor-default overflow-hidden rounded-md border border-dashed bg-card/60 px-4 py-3 text-left transition-all hover:border-muted-foreground/40"
      onClick={() => notify(`Complete Week ${previousWeekNumber} first.`)}
      type="button"
    >
      {/* Blurred content */}
      <div className="flex items-center gap-3 opacity-40 blur-[1.5px] transition-all group-hover:blur-[0.5px]">
        <span className="bg-muted text-muted-foreground grid size-8 shrink-0 place-items-center rounded-md">
          <Lock className="size-4" aria-hidden />
        </span>
        <div>
          <p className="font-heading text-foreground text-sm font-bold leading-snug">
            {week.title}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Complete Week {previousWeekNumber} to unlock
          </p>
        </div>
      </div>

      {/* Centered lock badge */}
      <span className="absolute inset-0 grid place-items-center">
        <span className="border-border text-primary bg-card inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold shadow-sm">
          <Lock className="size-3 animate-lock-pulse" aria-hidden />
          Locked
        </span>
      </span>
    </button>
  )
}
