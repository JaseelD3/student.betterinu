"use client"

import { useEffect, useCallback, useState } from "react"
import {
  X,
  BookOpen,
  Globe,
  CalendarClock,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  RefreshCw,
  FileUp,
  ExternalLink,
  ClipboardCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileViewer } from "@/components/ui/FileViewer"
import { FileUploader } from "@/components/ui/FileUploader"
import type { AttachedFile } from "@/components/ui/FileUploader"
import RoboLoader from "@/components/loading/robo-loader"
import { StatusBadge, STATUS_LABEL, type StatusKey } from "./status-badge"
import { useStandaloneAssignment, useSubmitStandaloneAssignment } from "@/lib/hooks/use-assignments"
import { Skeleton } from "@/components/ui/skeleton"

// ── Date formatter ────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

// ── Submission form ──────────────────────────────────────────────────────────
function SubmissionForm({
  assignmentId,
  allowedSubmissionTypes,
  submissionStatus,
  submittedText,
  submittedFiles,
  feedback,
  text,
  setText,
  files,
  setFiles,
  submitError,
}: {
  assignmentId: string
  allowedSubmissionTypes: string[]
  submissionStatus: StatusKey | null
  submittedText: string | null
  submittedFiles: any[] | null
  feedback: string | null
  text: string
  setText: (v: string) => void
  files: AttachedFile[]
  setFiles: (v: AttachedFile[]) => void
  submitError: string
}) {
  const types = allowedSubmissionTypes.length > 0 ? allowedSubmissionTypes : ["text"]
  const isApproved = submissionStatus === "approved"
  const isPending = submissionStatus === "pending"
  const isRejected = submissionStatus === "rejected"
  const hasSubmission = submissionStatus !== null

  return (
    <div className="flex flex-col gap-4">
      {/* Approved banner */}
      {isApproved && (
        <div className="flex items-start gap-3 rounded-md border border-status-approved-foreground/20 bg-status-approved px-4 py-3">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-status-approved-foreground" aria-hidden />
          <div>
            <p className="text-sm font-bold text-status-approved-foreground">Assignment Approved</p>
            {feedback && (
              <p className="mt-0.5 text-xs leading-relaxed text-status-approved-foreground/80">{feedback}</p>
            )}
          </div>
        </div>
      )}

      {/* Rejected feedback */}
      {isRejected && feedback && (
        <div className="flex items-start gap-3 rounded-md border border-status-rejected-foreground/20 bg-status-rejected px-4 py-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-status-rejected-foreground" aria-hidden />
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-status-rejected-foreground">
              Instructor Feedback
            </p>
            <p className="text-sm leading-relaxed text-status-rejected-foreground">{feedback}</p>
          </div>
        </div>
      )}

      {/* Previous submission read-only */}
      {hasSubmission && (isPending || isApproved) && (
        <div className="rounded-md border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Your Submission
            </p>
            <StatusBadge status={submissionStatus!} />
          </div>
          {submittedText && (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {submittedText}
            </div>
          )}
          {(submittedFiles ?? []).length > 0 && (
            <div className="mt-3">
              <FileViewer files={submittedFiles!} title="Your Uploaded Files" />
            </div>
          )}
        </div>
      )}

      {/* Submission / re-submission form */}
      {!isApproved && (
        <div className="rounded-md border border-border bg-card p-4">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {isRejected ? "Resubmit Your Answer" : isPending ? "Edit & Resubmit" : "Your Answer"}
          </p>

          {isRejected && hasSubmission && (
            <div className="mb-4 rounded-lg border border-status-pending-foreground/20 bg-status-pending px-3 py-2.5 text-xs font-medium leading-relaxed text-status-pending-foreground">
              Your previous submission was returned for revision. Update your answer below and resubmit.
            </div>
          )}

          {types.includes("text") && !isPending && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your answer here…"
              rows={5}
              className="mb-4 w-full resize-y rounded-lg border border-border bg-muted/30 p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          )}

          {(types.includes("file") || types.includes("image")) && !isPending && (
            <div className="mb-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
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

          {isRejected && (submittedFiles ?? []).length > 0 && (
            <div className="mb-4">
              <FileViewer files={submittedFiles!} title="Previously Submitted Files" />
            </div>
          )}

          {submitError && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              {submitError}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Modal ────────────────────────────────────────────────────────────────
type TaskDetailModalProps = {
  assignmentId: string
  onClose: () => void
}

export function TaskDetailModal({ assignmentId, onClose }: TaskDetailModalProps) {
  const { data: assignment, isLoading, isError, error } = useStandaloneAssignment(assignmentId)

  const [text, setText] = useState("")
  const [files, setFiles] = useState<AttachedFile[]>([])
  const [submitError, setSubmitError] = useState("")
  const [loadedAssignmentId, setLoadedAssignmentId] = useState<string | null>(null)

  const submitMutation = useSubmitStandaloneAssignment(assignmentId)

  const a = assignment as any

  useEffect(() => {
    if (a && a.assignment_id !== loadedAssignmentId) {
      setLoadedAssignmentId(a.assignment_id)
      setText(a.submission_status === "rejected" ? (a.submitted_text ?? "") : "")
      setFiles([])
      setSubmitError("")
    }
  }, [a, loadedAssignmentId])

  // Lock body scroll & ESC to close
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose() },
    [onClose]
  )
  useEffect(() => {
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [handleKey])

  const status: StatusKey = a?.submission_status ?? "todo"
  const statusLabel = STATUS_LABEL[status]

  const handleSubmit = useCallback(async () => {
    if (!a) return
    const types = (a.allowed_submission_types ?? []).length > 0 ? a.allowed_submission_types : ["text"]
    if (types.includes("text") && !text.trim() && files.length === 0) {
      setSubmitError("Please enter your answer or upload a file before submitting.")
      return
    }
    setSubmitError("")
    submitMutation.mutate(
      {
        submittedText: text,
        submittedFiles: files.map((f) => ({ url: f.url, name: f.name, type: f.type })),
      },
      {
        onError: (err) =>
          setSubmitError(err instanceof Error ? err.message : "Submission failed."),
      }
    )
  }, [a, text, files, submitMutation])

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 lg:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Task details"
    >
      {/* Dim */}
      <div
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-10 flex w-full flex-col overflow-hidden bg-background",
          "sm:rounded-md sm:border sm:border-border sm:shadow-2xl",
          "max-h-[96dvh] sm:max-h-[90dvh] sm:max-w-2xl",
          // mobile: slides up from bottom edge
          "rounded-t-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── FIXED HEADER ── */}
        <div className="shrink-0 border-b border-border bg-card">
          {/* Mobile drag handle */}
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-border" />
          </div>

          <div className="flex items-start gap-3 px-4 py-3 sm:px-5">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              {/* Title */}
              <h2 className="text-base font-bold leading-snug text-foreground">
                {isLoading ? (
                  <Skeleton className="h-5 w-3/4 rounded" />
                ) : isError ? (
                  "Task Details"
                ) : (
                  a?.title ?? "Task Details"
                )}
              </h2>

              {/* Type pill + status */}
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                {isLoading ? (
                  <>
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </>
                ) : (
                  !isError && a && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase">
                      {a.scope === "common" ? (
                        <><Globe className="size-3" aria-hidden />Common Task</>
                      ) : (
                        <><BookOpen className="size-3" aria-hidden />{a.course_title || "Course Task"}</>
                      )}
                    </span>
                  )
                )}
                {!isLoading && !isError && a?.submission_status && (
                  <StatusBadge status={status} />
                )}
              </div>

              {/* Meta chips */}
              {isLoading ? (
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              ) : (
                !isError && a && (
                  <div className="flex flex-wrap items-center gap-2">
                    {a.due_date && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <CalendarClock className="size-3" aria-hidden />
                        Due {fmtDate(a.due_date)}
                      </span>
                    )}
                    {a.total_marks && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Star className="size-3" aria-hidden />
                        {a.total_marks} marks
                      </span>
                    )}
                    {a.submitted_at && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="size-3" aria-hidden />
                        Submitted {fmtDate(a.submitted_at)}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close task details"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-minimal">
          {isLoading ? (
            <div className="space-y-5 px-4 py-5 sm:px-5">
              {/* Instructions Skeleton */}
              <div className="rounded-md border border-border bg-card p-4 space-y-3">
                <Skeleton className="h-3.5 w-24 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-11/12 rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                </div>
              </div>

              {/* Reference materials Skeleton */}
              <div className="rounded-md border border-border bg-card p-4 space-y-3">
                <Skeleton className="h-3.5 w-32 rounded" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-10 w-36 rounded-md" />
                  <Skeleton className="h-10 w-36 rounded-md" />
                </div>
              </div>

              {/* Submission panel Skeleton */}
              <div className="rounded-md border border-border bg-card p-4 space-y-4">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-28 w-full rounded-lg" />
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
              </div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="size-5 text-destructive" aria-hidden />
              </div>
              <p className="text-sm font-semibold text-foreground">Could not load task</p>
              <p className="text-xs text-muted-foreground">
                {error instanceof Error ? error.message : "Something went wrong."}
              </p>
            </div>
          ) : !a ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <ClipboardCheck className="size-5 text-muted-foreground" aria-hidden />
              </div>
              <p className="text-sm font-semibold text-foreground">Task not found</p>
            </div>
          ) : (
            <div className="space-y-5 px-4 py-5 sm:px-5">
              {/* Instructions */}
              {a.instructions && (
                <div className="rounded-md border border-border bg-card p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Instructions
                  </p>
                  <div
                    className="rich-content text-sm leading-relaxed text-foreground"
                    dangerouslySetInnerHTML={{ __html: a.instructions }}
                  />
                </div>
              )}

              {/* Reference files */}
              {(a.attached_files ?? []).length > 0 && (
                <FileViewer files={a.attached_files} title="Reference Materials" />
              )}

              {/* Reference links */}
              {(a.reference_links ?? []).length > 0 && (
                <div className="rounded-md border border-border bg-card p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Reference Links
                  </p>
                  <div className="flex flex-col gap-2">
                    {(a.reference_links as { label: string; url: string }[]).map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="min-w-0 truncate">{link.label || link.url}</span>
                        <ExternalLink className="size-3 shrink-0 opacity-60" aria-hidden />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission panel */}
              <SubmissionForm
                assignmentId={a.assignment_id}
                allowedSubmissionTypes={a.allowed_submission_types ?? ["text"]}
                submissionStatus={(a.submission_status as StatusKey | null) ?? null}
                submittedText={a.submitted_text}
                submittedFiles={a.submitted_files}
                feedback={a.feedback}
                text={text}
                setText={setText}
                files={files}
                setFiles={setFiles}
                submitError={submitError}
              />
            </div>
          )}
        </div>

        {/* ── FIXED FOOTER ── */}
        <div className="shrink-0 border-t border-border bg-card px-4 py-3 sm:px-5">
          <div className="flex items-center justify-end gap-2.5">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-20 rounded-md" />
                <Skeleton className="h-10 w-36 rounded-md" />
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onClose}
                >
                  Close
                </Button>

                {!isError && a && status !== "approved" && status !== "pending" && (
                  <Button
                    onClick={handleSubmit}
                    disabled={submitMutation.isPending}
                    size="lg"
                    className="flex items-center gap-1.5"
                  >
                    {submitMutation.isPending ? (
                      <RoboLoader size="xs" className="text-current" />
                    ) : status === "rejected" ? (
                      <RefreshCw className="size-4" aria-hidden />
                    ) : (
                      <Send className="size-4" aria-hidden />
                    )}
                    {submitMutation.isPending
                      ? "Submitting…"
                      : status === "rejected"
                        ? "Resubmit"
                        : "Submit Assignment"}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
