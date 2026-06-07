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
  ExternalLink,
} from "lucide-react"
import Image from "next/image"
import type { CourseId, SubModule } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
    cls: "assignment-status-pending",
  },
  approved: {
    Icon: CheckCircle2,
    label: "Approved",
    cls: "assignment-status-approved",
  },
  rejected: {
    Icon: XCircle,
    label: "Rejected — please revise and resubmit",
    cls: "assignment-status-rejected",
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
      <Card className="shadow-none border-0">
        <CardHeader className="px-6 py-5 pb-2">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-orange-500/10">
              <ClipboardCheck className="size-5 text-orange-500" />
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">
                Assignment
              </p>
              <CardTitle className="font-display text-lg font-bold">
                {title}
              </CardTitle>
            </div>
          </div>

        {/* Meta row */}
        <div className="mt-2 flex flex-wrap gap-3">
          {dueDate && (
            <Badge variant="secondary" className="gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400">
              <CalendarClock className="size-3.5" />
              Due: {new Date(dueDate).toLocaleString()}
            </Badge>
          )}
          {totalMarks !== undefined && (
            <Badge variant="secondary" className="gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400">
              <Trophy className="size-3.5" />
              {totalMarks} marks
            </Badge>
          )}
          <div className="flex flex-wrap items-center gap-1.5">
            {allowedTypes.map((t) => (
              <Badge key={t} variant="outline" className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider">
                {t}
              </Badge>
            ))}
          </div>
        </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2">

        {/* Instructions */}
        {instructions && (
          <div
            className="assignment-instructions rich-content max-w-none"
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
          <div className="mt-5 space-y-3 border-t border-border pt-5">
            <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              Reference Links
            </p>
            <div className="space-y-2">
              {assignmentData!.referenceLinks!.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-default bg-background hover:border-primary flex w-full items-start gap-4 rounded-sm border px-3 py-3 -xs transition-all hover:shadow-sm"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-teal-100 bg-teal-50">
                    {link.url ? (
                      <Image
                        src={`https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(link.url).hostname } catch { return '' } })()}&sz=128`}
                        alt=""
                        width={48}
                        height={48}
                        unoptimized
                        className="size-10 object-contain"
                      />
                    ) : (
                      <Link2 className="size-6 text-teal-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                      {link.label || link.url}
                    </p>
                    <p className="text-muted-foreground/80 mt-1 truncate text-[10px]">
                      {link.url}
                    </p>
                  </div>
                  <ExternalLink className="text-muted-foreground group-hover:text-primary mt-1 size-4 shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
        </CardContent>
      </Card>

      {/* Status Banner */}
      {submission && status && (
        <div className={`flex items-start gap-3 rounded-md  px-4 ${status.cls}`}>
          <status.Icon className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-sm font-bold">
              {status.label}
            </p>
            <p className="mt-0.5 text-xs opacity-80">
              Submitted {new Date(submission.submitted_at).toLocaleString()}
            </p>
            {submission.feedback && (
              <p className="mt-2 rounded-md border border-current/20 bg-black/5 px-3 py-2 text-sm">
                <strong>Instructor Feedback:</strong> {submission.feedback}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Approved state */}
      {submission?.status === "approved" ? (
        <div className="assignment-approved-block flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle2 className="mb-3 size-12" />
          <p className="font-display text-xl font-bold">
            Assignment Approved!
          </p>
          <p className="mt-1 text-sm opacity-80">
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
        <Card className="shadow-xs">
          <CardHeader className="px-6 py-0">
            <CardTitle className="text-lg pb-0 mb-0 font-bold">
              {canEdit
                ? submission?.status === "rejected"
                  ? "Resubmit Your Work"
                  : "Submit Your Work"
                : "Your Submission"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6 pt-0">

          {/* Text response */}
          {allowedTypes.includes("text") && (
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                Text Response
              </Label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!canEdit || submitting}
                placeholder="Write your answer here..."
                rows={8}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm -xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              />
            </div>
          )}

          {/* URL submission */}
          {allowedTypes.includes("url") && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  Links / URLs
                </Label>
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
                <p className="text-muted-foreground text-xs italic">
                  Click "Add Link" to submit URLs.
                </p>
              )}

              {links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    type="url"
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...links]
                      newLinks[idx] = e.target.value
                      setLinks(newLinks)
                    }}
                    disabled={!canEdit || submitting}
                    placeholder="https://..."
                  />
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() =>
                        setLinks(links.filter((_, i) => i !== idx))
                      }
                      className="text-muted-foreground shrink-0 p-2 transition-colors hover:text-red-500"
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
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                {allowedTypes.includes("image") &&
                !allowedTypes.includes("file")
                  ? "Image Upload"
                  : "File Upload"}
              </Label>
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
        </CardContent>
        </Card>
      )}
    </div>
  )
}
