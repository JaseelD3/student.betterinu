"use client"

import { useState } from "react"
import {
  Send,
  RefreshCw,
  FileUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileViewer } from "@/components/ui/FileViewer"
import { FileUploader } from "@/components/ui/FileUploader"
import type { AttachedFile } from "@/components/ui/FileUploader"
import RoboLoader from "@/components/loading/robo-loader"
import { useSubmitStandaloneAssignment } from "@/lib/hooks/use-assignments"
import { StatusBadge, type StatusKey } from "../../_components/status-badge"

type AssignmentSubmissionPanelProps = {
  assignmentId: string
  allowedSubmissionTypes: string[]
  submissionStatus: StatusKey | null
  submittedText: string | null
  submittedFiles: any[] | null
  feedback: string | null
}

export function AssignmentSubmissionPanel({
  assignmentId,
  allowedSubmissionTypes,
  submissionStatus,
  submittedText,
  submittedFiles,
  feedback,
}: AssignmentSubmissionPanelProps) {
  const [text, setText] = useState(
    submissionStatus === "rejected" ? (submittedText ?? "") : "",
  )
  const [files, setFiles] = useState<AttachedFile[]>([])
  const [submitError, setSubmitError] = useState("")

  const submitMutation = useSubmitStandaloneAssignment(assignmentId)

  const types = allowedSubmissionTypes.length > 0 ? allowedSubmissionTypes : ["text"]
  const isApproved = submissionStatus === "approved"
  const isPending = submissionStatus === "pending"
  const isRejected = submissionStatus === "rejected"
  const hasSubmission = submissionStatus !== null

  async function handleSubmit() {
    if (types.includes("text") && !text.trim() && files.length === 0) {
      setSubmitError("Please enter your answer or upload a file before submitting.")
      return
    }
    setSubmitError("")
    submitMutation.mutate(
      {
        submittedText: text,
        submittedFiles: files.map((f) => ({
          url: f.url,
          name: f.name,
          type: f.type,
        })),
      },
      {
        onError: (err) =>
          setSubmitError(err instanceof Error ? err.message : "Submission failed."),
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Approved banner ── */}
      {isApproved && (
        <Card className="border-status-approved-foreground/20 bg-status-approved p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="text-status-approved-foreground mt-0.5 size-5 shrink-0"
              aria-hidden
            />
            <div>
              <p className="text-status-approved-foreground text-sm font-bold">
                Assignment Approved
              </p>
              {feedback && (
                <p className="text-status-approved-foreground/80 mt-1 text-xs leading-relaxed">
                  {feedback}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* ── Rejected feedback ── */}
      {isRejected && feedback && (
        <Card className="border-status-rejected-foreground/20 bg-status-rejected p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="text-status-rejected-foreground mt-0.5 size-5 shrink-0"
              aria-hidden
            />
            <div>
              <p className="text-status-rejected-foreground mb-1 text-[10px] font-bold uppercase tracking-widest">
                Instructor Feedback
              </p>
              <p className="text-status-rejected-foreground text-sm leading-relaxed">
                {feedback}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ── Previous submission (read-only — pending / approved) ── */}
      {hasSubmission && (isPending || isApproved) && (
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              Your Submission
            </p>
            <StatusBadge status={submissionStatus!} />
          </div>

          {submittedText && (
            <div className="bg-muted/50 border-border rounded-md border p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {submittedText}
            </div>
          )}

          {(submittedFiles ?? []).length > 0 && (
            <div className="mt-4">
              <FileViewer
                files={submittedFiles!}
                title="Your Uploaded Files"
              />
            </div>
          )}
        </Card>
      )}

      {/* ── Submission / Resubmission form ── */}
      {!isApproved && (
        <Card className="p-5">
          <p className="text-muted-foreground mb-4 text-[10px] font-bold uppercase tracking-widest">
            {isRejected
              ? "Resubmit Your Answer"
              : isPending
                ? "Edit & Resubmit"
                : "Your Answer"}
          </p>

          {/* Revision notice for rejected */}
          {isRejected && hasSubmission && (
            <div className="bg-status-pending border-status-pending-foreground/20 text-status-pending-foreground mb-4 rounded-md border px-4 py-3 text-xs font-medium leading-relaxed">
              Your previous submission was returned for revision. Update your
              answer below and resubmit.
            </div>
          )}

          {/* Text answer */}
          {types.includes("text") && !isPending && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your answer here…"
              rows={6}
              className={cn(
                "border-border bg-muted/30 text-foreground focus:border-primary focus:ring-primary/20 mb-4 w-full resize-y rounded-md border p-4 text-sm outline-none focus:ring-1",
              )}
            />
          )}

          {/* File upload */}
          {(types.includes("file") || types.includes("image")) && !isPending && (
            <div className="mb-4">
              <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-semibold">
                <FileUp className="size-3.5" aria-hidden />
                Upload Files
              </p>
              <FileUploader
                folder={`standalone-submissions/${assignmentId}`}
                files={files}
                onChange={setFiles}
              />
            </div>
          )}

          {/* Previously submitted files (rejected state) */}
          {isRejected && (submittedFiles ?? []).length > 0 && (
            <div className="mb-4">
              <FileViewer
                files={submittedFiles!}
                title="Previously Submitted Files"
              />
            </div>
          )}

          {/* Error */}
          {submitError && (
            <div className="bg-destructive/10 text-destructive mb-4 rounded-md px-4 py-3 text-sm">
              {submitError}
            </div>
          )}

          {/* Submit button */}
          {!isPending && (
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="w-full"
              size="default"
            >
              {submitMutation.isPending ? (
                <RoboLoader size="xs" className="text-current" />
              ) : isRejected ? (
                <RefreshCw className="size-4" aria-hidden />
              ) : (
                <Send className="size-4" aria-hidden />
              )}
              {submitMutation.isPending
                ? "Submitting…"
                : isRejected
                  ? "Resubmit"
                  : "Submit Assignment"}
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
