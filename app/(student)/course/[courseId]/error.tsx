"use client"

import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-0 w-full flex-col items-center justify-center gap-4 p-8">
      <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive size-6" aria-hidden />
      </div>
      <div className="text-center">
        <p className="text-foreground text-sm font-semibold">
          Something went wrong
        </p>
        <p className="text-muted-foreground mt-1 text-xs">{error.message}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
