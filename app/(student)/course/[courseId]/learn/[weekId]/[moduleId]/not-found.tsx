import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-muted-foreground text-sm">Lesson not found.</p>
      <Button asChild variant="outline" size="sm">
        <Link href="..">Back to curriculum</Link>
      </Button>
    </div>
  )
}
