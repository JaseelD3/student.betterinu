import { CheckCircle2 } from "lucide-react"

import type { Course } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type OutcomesCardProps = {
  course: Course
}

export function OutcomesCard({ course }: OutcomesCardProps) {
  if (!course.outcomes || course.outcomes.length === 0) return null

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-foreground text-sm font-bold">
          What you&apos;ll learn
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="flex flex-col gap-2.5">
          {course.outcomes.map((outcome, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs">
              <CheckCircle2
                className="text-primary mt-0.5 size-3.5 shrink-0"
                aria-hidden
              />
              <span className="text-foreground leading-relaxed">{outcome}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
