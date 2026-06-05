import { CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function CompletionBadge({ complete }: { complete: boolean }) {
  return complete ? (
    <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1 flex items-center text-[11px] font-semibold">
      <CheckCircle2 className="size-3 shrink-0" aria-hidden />
      <span className="pt-0.5">Complete</span>
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="bg-muted text-foreground border-transparent text-[11px] font-semibold"
    >
      In progress
    </Badge>
  )
}
