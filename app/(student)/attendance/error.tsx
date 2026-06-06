"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageWrapper } from "@/components/layout/page-wrapper"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <PageWrapper>
      <div className="flex min-h-0 w-full flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Dashboard</Link>
          </Button>
        </div>
      </div>
    </PageWrapper>
  )
}
