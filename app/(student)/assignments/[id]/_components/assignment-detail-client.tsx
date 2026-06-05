"use client"

import Link from "next/link"
import { AlertCircle, FileSearch } from "lucide-react"

import { useStandaloneAssignment } from "@/lib/hooks/use-assignments"
import { Button } from "@/components/ui/button"

import { AssignmentDetailSkeleton } from "./assignment-detail-skeleton"
import { AssignmentHero } from "./assignment-hero"
import { AssignmentInstructions } from "./assignment-instructions"
import { AssignmentSubmissionPanel } from "./assignment-submission-panel"
import type { StatusKey } from "../../_components/status-badge"

type AssignmentDetailClientProps = {
  id: string
}

export function AssignmentDetailClient({ id }: AssignmentDetailClientProps) {
  const {
    data: assignment,
    isLoading,
    isError,
    error,
  } = useStandaloneAssignment(id)

  if (isLoading) {
    return <AssignmentDetailSkeleton />
  }

  if (isError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive size-6" aria-hidden />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">
            Could not load assignment
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {error instanceof Error ? error.message : "Something went wrong."}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/assignments">Back to My Tasks</Link>
        </Button>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8 text-center">
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
    )
  }

  // assignment fields are snake_case from the actual API
  const a = assignment as any

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Hero */}
      <AssignmentHero
        title={a.title}
        scope={a.scope}
        courseTitle={a.course_title}
        dueDate={a.due_date}
        totalMarks={a.total_marks}
        submittedAt={a.submitted_at}
        submissionStatus={
          (a.submission_status as StatusKey | null) ?? null
        }
      />

      {/* Instructions + reference materials */}
      <AssignmentInstructions
        instructions={a.instructions}
        attachedFiles={a.attached_files ?? []}
        referenceLinks={a.reference_links ?? []}
      />

      {/* Submission panel */}
      <AssignmentSubmissionPanel
        assignmentId={a.assignment_id}
        allowedSubmissionTypes={a.allowed_submission_types ?? ["text"]}
        submissionStatus={(a.submission_status as StatusKey | null) ?? null}
        submittedText={a.submitted_text}
        submittedFiles={a.submitted_files}
        feedback={a.feedback}
      />
    </div>
  )
}
