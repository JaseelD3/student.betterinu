import Link from "next/link"
import { BookX } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-0 w-full flex-col items-center justify-center gap-4 p-8">
      <div className="bg-muted flex size-12 items-center justify-center rounded-full">
        <BookX className="text-muted-foreground size-6" aria-hidden />
      </div>
      <div className="text-center">
        <p className="text-foreground text-sm font-semibold">
          Course not found
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          This course doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  )
}
