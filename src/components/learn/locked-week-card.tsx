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
      className="group border-default hover:border-strong relative w-full cursor-default overflow-hidden rounded-md border border-dashed bg-white/70 p-5 text-left transition-all"
      onClick={() => notify(`Complete Week ${previousWeekNumber} first.`)}
      type="button"
    >
      <div className="flex items-center gap-4 opacity-40 blur-[1.5px] transition-all group-hover:blur-[0.5px]">
        <span className="bg-subtle text-muted grid size-10 shrink-0 place-items-center rounded-sm">
          <Lock className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-foreground text-base font-bold">
            {week.title}
          </h3>
          <p className="text-secondary mt-0.5 text-xs">
            Complete Week {previousWeekNumber} to unlock
          </p>
        </div>
      </div>

      <span className="absolute inset-0 grid place-items-center">
        <span className="border-default text-primary inline-flex items-center gap-2 rounded-sm border bg-white/90 px-3 py-1.5 text-xs font-bold shadow-sm">
          <Lock className="animate-lock-pulse size-3.5" aria-hidden />
          Locked
        </span>
      </span>
    </button>
  )
}
