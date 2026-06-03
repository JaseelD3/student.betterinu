"use client"

import { useEffect, useState } from "react"
import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Send,
  XCircle,
  Link2,
  FileUp,
  ImageIcon,
  AlignLeft,
  CalendarClock,
  Trophy,
  Plus,
} from "lucide-react"
import type { CourseId, SubModule } from "@/types"
import { Button } from "@/components/ui/button"
import RoboLoader from "@/components/loading/robo-loader"
import { FileUploader } from "@/components/ui/FileUploader"
import { FileViewer } from "@/components/ui/FileViewer"
import type { AttachedFile } from "@/components/ui/FileUploader"
import { studentApi } from "@/lib/api-client"

interface Submission {
  id: string
  status: "pending" | "approved" | "rejected"
  submitted_text: string
  submitted_at: string
  feedback?: string
  submitted_files?: AttachedFile[]
}

interface AssignmentViewerProps {
  module: SubModule
  courseId: CourseId
  weekId: string
  dayId: string
  onApprovedComplete?: () => void
}

const STATUS_CONFIG = {
  pending: {
    Icon: Clock,
    label: "Pending Review",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
  approved: {
    Icon: CheckCircle2,
    label: "Approved",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
  },
  rejected: {
    Icon: XCircle,
    label: "Rejected — please revise and resubmit",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
  },
}

const SUBMISSION_TYPE_ICONS: Record<string, any> = {
  text: AlignLeft,
  file: FileUp,
  image: ImageIcon,
  url: Link2,
}

export function AssignmentViewer({
  module,
  courseId,
  weekId,
  dayId,
  onApprovedComplete,
}: AssignmentViewerProps) {
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [text, setText] = useState("")
  const [links, setLinks] = useState<string[]>([])
  const [files, setFiles] = useState<AttachedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Get the rich assignmentData if available (new format), otherwise fallback
  const assignmentData = module.assignmentData
  const title = assignmentData?.title || module.title
  const instructions = assignmentData?.instructions || module.description || ""
  const dueDate = assignmentData?.dueDate
  const totalMarks = assignmentData?.totalMarks
  const allowedTypes = assignmentData?.allowedSubmissionTypes || ["text"]

  useEffect(() => {
    setLoading(true)
    studentApi
      .listAssignments({ assignmentId: module.id, courseId })
      .then(({ submission }) => {
        setSubmission(submission ?? null)
        if (submission) {
          if (submission.status === "approved" && onApprovedComplete) {
            onApprovedComplete()
          }
          setText(submission.submitted_text || "")
          setFiles(submission.submitted_files ?? [])
          // try to extract links if they were previously appended
          const textContent = submission.submitted_text || ""
          setText(textContent)
        }
      })
      .finally(() => setLoading(false))
  }, [module.id, courseId])

  async function handleSubmit() {
    let finalText = text.trim()
    const validLinks = links.filter((l) => l.trim() !== "")

    if (allowedTypes.includes("url") && validLinks.length > 0) {
      const linksText = validLinks.map((l) => l).join("\n")
      finalText = finalText ? `${finalText}\n\nLinks:\n${linksText}` : linksText
    }

    if (!finalText && files.length === 0) {
      setError("Please provide a response before submitting.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const data = await studentApi.submitAssignment({
        assignmentId: module.id,
        courseId,
        weekId,
        dayId,
        submittedText: finalText || "(see attached files)",
        submittedFiles: files,
      })
      setSubmission(data.submission)
      setSuccess(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const status = submission
    ? STATUS_CONFIG[submission.status as keyof typeof STATUS_CONFIG]
    : null
  const canEdit = !submission || submission.status === "rejected"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <RoboLoader size="md" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Assignment Header Card */}
      <div className="border-default bg-surface rounded-md border p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-orange-100">
            <ClipboardCheck className="size-5 text-orange-600" />
          </span>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-orange-600 uppercase">
              Assignment
            </p>
            <h2 className="font-display text-foreground text-lg font-bold">
              {title}
            </h2>
          </div>
        </div>

        {/* Meta row */}
        <div className="mb-4 flex flex-wrap gap-3">
          {dueDate && (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <CalendarClock className="size-3.5" />
              Due: {new Date(dueDate).toLocaleString()}
            </div>
          )}
          {totalMarks !== undefined && (
            <div className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <Trophy className="size-3.5" />
              {totalMarks} marks
            </div>
          )}
          <div className="flex flex-wrap items-center gap-1.5">
            {allowedTypes.map((t) => {
              const Icon = SUBMISSION_TYPE_ICONS[t] || AlignLeft
              return (
                <span
                  key={t}
                  className="bg-surface border-default text-muted flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase"
                >
                  <Icon className="size-3" />
                  {t}
                </span>
              )
            })}
          </div>
        </div>

        {/* Instructions */}
        {instructions && (
          <div
            className="prose prose-sm text-secondary max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: instructions }}
          />
        )}

        {/* Reference files — from assignmentData (new) or legacy module.attachedFiles */}
        {(() => {
          const files = assignmentData?.attachedFiles?.length
            ? assignmentData.attachedFiles
            : module.attachedFiles
          return files?.length ? (
            <div className="border-default mt-5 border-t pt-5">
              <FileViewer files={files} title="Reference Materials" />
            </div>
          ) : null
        })()}

        {/* Reference links */}
        {(assignmentData?.referenceLinks || []).length > 0 && (
          <div className="border-default mt-4 space-y-2 border-t pt-4">
            <p className="text-muted text-xs font-bold tracking-widest uppercase">
              Reference Links
            </p>
            <div className="flex flex-wrap gap-2">
              {assignmentData!.referenceLinks!.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-default text-primary hover:border-primary flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-semibold transition-all hover:shadow-sm"
                >
                  <Link2 className="size-3 shrink-0" />
                  {link.label || link.url}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Banner */}
      {submission && status && (
        <div
          className={`flex items-start gap-3 rounded-md border p-4 ${status.bg}`}
        >
          <status.Icon className={`mt-0.5 size-5 shrink-0 ${status.color}`} />
          <div>
            <p className={`text-sm font-bold ${status.color}`}>
              {status.label}
            </p>
            <p className="text-muted mt-0.5 text-xs">
              Submitted {new Date(submission.submitted_at).toLocaleString()}
            </p>
            {submission.feedback && (
              <p className="text-foreground border-default mt-2 rounded-md border bg-white/60 px-3 py-2 text-sm">
                <strong>Instructor Feedback:</strong> {submission.feedback}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Approved state */}
      {submission?.status === "approved" ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-green-200 bg-green-50 py-10 text-center">
          <CheckCircle2 className="mb-3 size-12 text-green-600" />
          <p className="font-display text-primary text-xl font-bold">
            Assignment Approved!
          </p>
          <p className="mt-1 text-sm text-green-600">
            Your work has been reviewed and approved. Next content is unlocked.
          </p>
          {submission.submitted_files?.length ? (
            <div className="mt-6 w-full max-w-md text-left">
              <FileViewer
                files={submission.submitted_files}
                title="Your Submitted Files"
              />
            </div>
          ) : null}
        </div>
      ) : (
        /* Submission form */
        <div className="border-default space-y-5 rounded-md border bg-white p-6 shadow-sm">
          <h3 className="text-foreground text-sm font-bold">
            {canEdit
              ? submission?.status === "rejected"
                ? "Resubmit Your Work"
                : "Submit Your Work"
              : "Your Submission"}
          </h3>

          {/* Text response */}
          {allowedTypes.includes("text") && (
            <div>
              <label className="text-muted mb-1 block text-xs font-bold tracking-widest uppercase">
                Text Response
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!canEdit || submitting}
                placeholder="Write your answer here..."
                rows={8}
                className="border-default bg-surface text-foreground focus:border-primary focus:ring-primary/20 w-full resize-y rounded-md border p-4 text-sm leading-relaxed outline-none focus:ring-1 disabled:opacity-60"
              />
            </div>
          )}

          {/* URL submission */}
          {allowedTypes.includes("url") && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-muted block text-xs font-bold tracking-widest uppercase">
                  Links / URLs
                </label>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => setLinks([...links, ""])}
                    className="text-primary flex items-center gap-1 text-[10px] font-bold hover:underline"
                  >
                    <Plus className="size-3" /> Add Link
                  </button>
                )}
              </div>

              {links.length === 0 && canEdit && (
                <p className="text-muted text-xs italic">
                  Click "Add Link" to submit URLs.
                </p>
              )}

              {links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...links]
                      newLinks[idx] = e.target.value
                      setLinks(newLinks)
                    }}
                    disabled={!canEdit || submitting}
                    placeholder="https://..."
                    className="border-default bg-surface focus:border-primary focus:ring-primary/20 flex-1 rounded-md border px-4 py-2.5 text-sm outline-none focus:ring-1 disabled:opacity-60"
                  />
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() =>
                        setLinks(links.filter((_, i) => i !== idx))
                      }
                      className="text-muted shrink-0 p-2 transition-colors hover:text-red-500"
                    >
                      <XCircle className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* File / image upload */}
          {(allowedTypes.includes("file") ||
            allowedTypes.includes("image")) && (
              <div>
                <label className="text-muted mb-1 block text-xs font-bold tracking-widest uppercase">
                  {allowedTypes.includes("image") &&
                    !allowedTypes.includes("file")
                    ? "Image Upload"
                    : "File Upload"}
                </label>
                {canEdit ? (
                  <FileUploader
                    folder={`submissions/${module.id}`}
                    files={files}
                    onChange={setFiles}
                    accept={
                      allowedTypes.includes("image") &&
                        !allowedTypes.includes("file")
                        ? "image/*"
                        : undefined
                    }
                  />
                ) : (
                  <FileViewer files={files} title="Your Submitted Files" />
                )}
              </div>
            )}

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
              {error}
            </p>
          )}

          {success && !error && (
            <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-600">
              ✓ Submitted successfully! Your assignment is now pending review.
            </p>
          )}

          {canEdit && (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="gap-2 font-bold"
            >
              {submitting ? (
                <RoboLoader size="xs" />
              ) : (
                <Send className="size-4" />
              )}
              {submitting
                ? "Submitting…"
                : submission?.status === "rejected"
                  ? "Resubmit"
                  : "Submit Assignment"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
