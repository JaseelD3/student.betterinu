"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function QuizQuestion({
  question,
  index,
  total,
  selected,
  onSelect,
}: {
  question: any
  index: number
  total: number
  selected?: string
  onSelect: (answer: string) => void
}) {
  const isText = question.type === "text"
  const options = question.options || []

  return (
    <div className="border-default bg-surface rounded-md border p-5">
      <p className="text-muted text-sm font-bold uppercase">
        Q {index + 1} of {total}
      </p>
      <h2 className="font-display mt-3 text-xl leading-8 font-bold">
        {question.question}
      </h2>

      <div className="mt-6 grid gap-3">
        {isText ? (
          <input
            type="text"
            className="border-default bg-subtle text-foreground focus:border-focus focus:ring-focus w-full rounded-md border p-4 outline-none focus:ring-1"
            placeholder="Type your answer here..."
            value={selected || ""}
            onChange={(e) => onSelect(e.target.value)}
          />
        ) : (
          options.map((option: string) => {
            const isSelected = selected === option
            return (
              <Button
                className={cn(
                  "h-auto justify-start py-4 text-left",
                  isSelected &&
                    "border-focus bg-primary text-primary-foreground"
                )}
                key={option}
                onClick={() => onSelect(option)}
                type="button"
                variant="secondary"
              >
                {option}
              </Button>
            )
          })
        )}
      </div>
    </div>
  )
}
