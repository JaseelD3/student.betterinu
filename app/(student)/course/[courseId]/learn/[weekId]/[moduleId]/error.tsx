"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-muted-foreground text-sm">
        {error.message || "Failed to load lesson."}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="..">Back to course</Link>
        </Button>
      </div>
    </div>
  )
}
