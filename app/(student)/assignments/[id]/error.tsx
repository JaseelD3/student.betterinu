"use client"

import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageWrapper } from "@/components/layout/page-wrapper"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <PageWrapper>
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive size-6" aria-hidden />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">
            Could not load assignment
          </p>
          <p className="text-muted-foreground mt-1 text-xs">{error.message}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/assignments">Back to My Tasks</Link>
          </Button>
        </div>
      </div>
    </PageWrapper>
  )
}
