import { ExternalLink } from "lucide-react"

import { Card } from "@/components/ui/card"
import { FileViewer } from "@/components/ui/FileViewer"

type ReferenceLink = { label: string; url: string }

type AssignmentInstructionsProps = {
  instructions: string | null
  attachedFiles: any[]
  referenceLinks: ReferenceLink[]
}

export function AssignmentInstructions({
  instructions,
  attachedFiles,
  referenceLinks,
}: AssignmentInstructionsProps) {
  const hasContent =
    instructions || attachedFiles.length > 0 || referenceLinks.length > 0
  if (!hasContent) return null

  return (
    <div className="flex flex-col gap-4">
      {/* Instructions */}
      {instructions && (
        <Card className="p-5">
          <p className="text-muted-foreground mb-3 text-[10px] font-bold uppercase tracking-widest">
            Instructions
          </p>
          <div
            className="rich-content text-foreground text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: instructions }}
          />
        </Card>
      )}

      {/* Reference files */}
      {attachedFiles.length > 0 && (
        <FileViewer files={attachedFiles} title="Reference Materials" />
      )}

      {/* Reference links */}
      {referenceLinks.length > 0 && (
        <Card className="p-5">
          <p className="text-muted-foreground mb-3 text-[10px] font-bold uppercase tracking-widest">
            Reference Links
          </p>
          <div className="flex flex-col gap-2">
            {referenceLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm transition-colors hover:underline"
              >
                <span className="bg-primary size-1.5 shrink-0 rounded-full" />
                <span className="min-w-0 truncate">{link.label || link.url}</span>
                <ExternalLink className="size-3 shrink-0 opacity-60" aria-hidden />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
