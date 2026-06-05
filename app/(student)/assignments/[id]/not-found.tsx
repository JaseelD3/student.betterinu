import Link from "next/link"
import { FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageWrapper } from "@/components/layout/page-wrapper"

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
          <FileSearch className="text-muted-foreground size-6" aria-hidden />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">
            Assignment not found
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            This task may no longer be available.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/assignments">Back to My Tasks</Link>
        </Button>
      </div>
    </PageWrapper>
  )
}
