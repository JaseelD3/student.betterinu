"use client"

import { Button } from "@/components/ui/button"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LoginError({ error, reset }: ErrorProps) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="border-border bg-card w-full max-w-md space-y-4 rounded-md border p-8 text-center shadow-sm">
        <p className="text-foreground text-sm font-semibold">
          Something went wrong
        </p>
        <p className="text-muted-foreground text-sm">{error.message}</p>
        <Button variant="outline" size="sm" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  )
}
