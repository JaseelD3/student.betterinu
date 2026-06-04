"use client"

import { Sparkles } from "lucide-react"

import type { CourseId } from "@/types"
import { EnrollButton } from "./enroll-button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type EnrollCtaCardProps = {
  courseId: CourseId
}

export function EnrollCtaCard({ courseId }: EnrollCtaCardProps) {
  return (
    <Card>
      {/* <CardContent className="flex flex-col items-center gap-2 pt-5 text-center">
        <div className="from-primary/10 to-accent/5 flex size-10 items-center justify-center rounded-full bg-gradient-to-br">
          <Sparkles className="text-primary size-5" aria-hidden />
        </div>
        <p className="text-foreground text-sm font-semibold">
          Ready to start learning?
        </p>
        <p className="text-muted-foreground text-xs">
          Enroll now and get instant access to all course materials.
        </p>
      </CardContent> */}
      <Separator />
      <CardFooter className="pt-4">
        <EnrollButton courseId={courseId} size="md" className="w-full" />
      </CardFooter>
    </Card>
  )
}
