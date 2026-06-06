"use client"

import { useState } from "react"
import { CalendarDays } from "lucide-react"
import { toast } from "sonner"

import { useApplyLeave } from "@/lib/hooks/use-attendance"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type LeaveApplyModalProps = {
  year: number
  month: number
  onClose: () => void
}

export function LeaveApplyModal({ year, month, onClose }: LeaveApplyModalProps) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [date, setDate] = useState<Date | undefined>(tomorrow)
  const [reason, setReason] = useState("")

  const { mutate, isPending, error } = useApplyLeave(year, month)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !reason.trim()) return

    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    const dateStr = `${y}-${m}-${d}`

    mutate(
      { date: dateStr, reason: reason.trim() },
      {
        onSuccess: () => {
          toast.success("Leave request submitted")
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open title="Apply for Leave" onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to submit"}
          </p>
        )}

        <div className="space-y-1.5">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-input bg-background hover:bg-muted/50 text-foreground"
              >
                <CalendarDays className="mr-2 size-4 text-muted-foreground" />
                {date ? (
                  date.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                ) : (
                  <span className="text-muted-foreground">Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="leave-reason">Reason</Label>
          <textarea
            id="leave-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Family function, medical appointment…"
            required
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? "Submitting…" : "Submit Request"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
