"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  BookOpen,
  CalendarClock,
  FileUp,
  RefreshCw,
} from "lucide-react"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { FileViewer } from "@/components/ui/FileViewer"
import { FileUploader } from "@/components/ui/FileUploader"
import type { AttachedFile } from "@/components/ui/FileUploader"
import RoboLoader from "@/components/loading/robo-loader"
import { studentApi } from "@/lib/api-client"

interface AssignmentDetail {
  assignment_id: string
  title: string
  instructions: string
  due_date: string | null
  total_marks: number | null
  allowed_submission_types: string[]
  attached_files: any[]
  reference_links: { label: string; url: string }[]
  scope: "course" | "common"
  course_title: string | null
  submission_id: string | null
  submitted_text: string | null
  submitted_files: any[] | null
  submitted_at: string | null
  submission_status: "pending" | "approved" | "rejected" | null
  feedback: string | null
}

const STATUS_CFG = {
  pending: {
    Icon: Clock,
    label: "Under Review",
    cls: "bg-amber-50 border-amber-200 text-amber-700",
  },
  approved: {
    Icon: CheckCircle2,
    label: "Approved",
    cls: "bg-green-50 border-green-200 text-green-700",
  },
  rejected: {
    Icon: XCircle,
    label: "Needs Revision",
    cls: "bg-red-50 border-red-200 text-red-600",
  },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submittedText, setSubmittedText] = useState("")
  const [submittedFiles, setSubmittedFiles] = useState<AttachedFile[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  async function load() {
    setLoading(true)
    try {
      const data = await studentApi.listStandaloneAssignments()
      const found = (data.assignments ?? []).find(
        (a: AssignmentDetail) => a.assignment_id === id
      )
      setAssignment(found ?? null)
      // Pre-fill text if resubmitting (rejected state)
      if (found?.submission_status === "rejected" && found?.submitted_text) {
        setSubmittedText(found.submitted_text)
      } else {
        setSubmittedText("")
      }
      setSubmittedFiles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  async function handleSubmit() {
    if (!assignment) return
    const types = assignment.allowed_submission_types || ["text"]
    if (
      types.includes("text") &&
      !submittedText.trim() &&
      submittedFiles.length === 0
    ) {
      setSubmitError("Please enter your answer before submitting.")
      return
    }
    setSubmitting(true)
    setSubmitError("")
    try {
      await studentApi.submitStandaloneAssignment(id, {
        submittedText,
        submittedFiles: submittedFiles.map((f) => ({
          url: f.url,
          name: f.name,
          type: f.type,
        })),
      })
      // Reload to immediately reflect pending status and show the submitted content
      await load()
    } catch (e: any) {
      setSubmitError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return (
      <PageWrapper>
        <div className="flex h-64 items-center justify-center">
          <RoboLoader size="md" />
        </div>
      </PageWrapper>
    )

  if (!assignment)
    return (
      <PageWrapper>
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <AlertCircle className="size-8 text-red-500" />
          <p className="text-foreground font-semibold">Assignment not found</p>
          <Link
            href="/assignments"
            className="text-primary text-sm hover:underline"
          >
            Back to My Tasks
          </Link>
        </div>
      </PageWrapper>
    )

  const types = assignment.allowed_submission_types || ["text"]
  const statusCfg = assignment.submission_status
    ? STATUS_CFG[assignment.submission_status]
    : null
  const hasSubmission = !!assignment.submission_id
  const isApproved = assignment.submission_status === "approved"
  const isPending = assignment.submission_status === "pending"
  const isRejected = assignment.submission_status === "rejected"

  return (
    <PageWrapper>
      <div className="mx-auto max-w-3xl px-4 pt-8 pb-16">
        {/* Back */}
        <Link
          href="/assignments"
          className="text-muted hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ChevronLeft className="size-4" /> My Tasks
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${assignment.scope === "common"
                ? "border-purple-200 bg-purple-50 text-purple-700"
                : "border-blue-200 bg-blue-50 text-blue-700"
                }`}
            >
              {assignment.scope === "common" ? (
                <>
                  <Globe className="size-3" />
                  Common
                </>
              ) : (
                <>
                  <BookOpen className="size-3" />
                  {assignment.course_title}
                </>
              )}
            </span>
            {statusCfg && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${statusCfg.cls}`}
              >
                <statusCfg.Icon size={11} />
                {statusCfg.label}
              </span>
            )}
          </div>
          <h1 className="text-foreground text-2xl font-bold">
            {assignment.title}
          </h1>
          <div className="text-muted mt-2 flex flex-wrap gap-4 text-xs">
            {assignment.due_date && (
              <span className="flex items-center gap-1">
                <CalendarClock className="size-3.5" /> Due{" "}
                {fmtDate(assignment.due_date)}
              </span>
            )}
            {assignment.total_marks && (
              <span>{assignment.total_marks} marks</span>
            )}
            {assignment.submitted_at && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> Submitted{" "}
                {fmtDate(assignment.submitted_at)}
              </span>
            )}
          </div>
        </div>

        {/* Instructions */}
        {assignment.instructions && (
          <div className="border-default mb-5 rounded-md border bg-white p-5 shadow-sm">
            <p className="text-muted mb-3 text-[10px] font-bold tracking-widest uppercase">
              Instructions
            </p>
            <div
              className="text-secondary rich-content text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: assignment.instructions }}
            />
          </div>
        )}

        {/* Reference files */}
        {(assignment.attached_files || []).length > 0 && (
          <div className="mb-5">
            <FileViewer
              files={assignment.attached_files}
              title="Reference Materials"
            />
          </div>
        )}

        {/* Reference links */}
        {(assignment.reference_links || []).length > 0 && (
          <div className="border-default mb-5 rounded-md border bg-white p-5 shadow-sm">
            <p className="text-muted mb-3 text-[10px] font-bold tracking-widest uppercase">
              Reference Links
            </p>
            <div className="space-y-2">
              {assignment.reference_links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary flex items-center gap-2 text-sm hover:underline"
                >
                  <span className="bg-primary size-1.5 rounded-full" />
                  {link.label || link.url}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Instructor Feedback ── */}
        {isRejected && assignment.feedback && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-5">
            <p className="mb-2 text-[10px] font-bold tracking-widest text-red-600 uppercase">
              Instructor Feedback
            </p>
            <p className="text-sm text-red-800">{assignment.feedback}</p>
          </div>
        )}

        {/* ── Approved banner ── */}
        {isApproved && (
          <div className="mb-5 flex items-center gap-3 rounded-md border border-green-200 bg-green-50 p-5">
            <CheckCircle2 className="size-5 shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-800">
                Assignment Approved
              </p>
              {assignment.feedback && (
                <p className="mt-0.5 text-xs text-green-700">
                  {assignment.feedback}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Your Previous Submission (read-only view for pending/approved) ── */}
        {hasSubmission && (isPending || isApproved) && (
          <div className="border-default mb-5 space-y-4 rounded-md border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-muted text-[10px] font-bold tracking-widest uppercase">
                Your Submission
              </p>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusCfg?.cls}`}
              >
                {statusCfg && <statusCfg.Icon size={11} />}
                {statusCfg?.label}
              </span>
            </div>
            {assignment.submitted_text && (
              <div className="border-default bg-surface text-foreground rounded-md border p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {assignment.submitted_text}
              </div>
            )}
            {(assignment.submitted_files || []).length > 0 && (
              <FileViewer
                files={assignment.submitted_files!}
                title="Your Uploaded Files"
              />
            )}
          </div>
        )}

        {/* ── Submission / Resubmission Form ── */}
        {!isApproved && (
          <div className="border-default space-y-4 rounded-md border bg-white p-5 shadow-sm">
            <p className="text-muted text-[10px] font-bold tracking-widest uppercase">
              {isRejected
                ? "Resubmit Your Answer"
                : isPending
                  ? "Edit & Resubmit"
                  : "Your Answer"}
            </p>

            {/* Show previous submission inline for rejected (editable) */}
            {isRejected && hasSubmission && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
                Your previous submission was returned for revision. Update your
                answer below and resubmit.
              </div>
            )}

            {types.includes("text") && !isPending && (
              <textarea
                value={submittedText}
                onChange={(e) => setSubmittedText(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                className="border-default bg-surface text-foreground focus:border-primary focus:ring-primary/20 w-full resize-y rounded-md border p-4 text-sm outline-none focus:ring-1"
              />
            )}

            {(types.includes("file") || types.includes("image")) &&
              !isPending && (
                <div>
                  <p className="text-muted mb-2 flex items-center gap-1.5 text-xs font-semibold">
                    <FileUp className="size-3.5" /> Upload Files
                  </p>
                  <FileUploader
                    folder={`standalone-submissions/${id}`}
                    files={submittedFiles}
                    onChange={setSubmittedFiles}
                  />
                </div>
              )}

            {/* Show previously submitted files for rejected state */}
            {isRejected && (assignment.submitted_files || []).length > 0 && (
              <FileViewer
                files={assignment.submitted_files!}
                title="Previously Submitted Files"
              />
            )}

            {submitError && (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </p>
            )}

            {!isPending && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-primary flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? (
                  <RoboLoader size="xs" className="text-current" />
                ) : isRejected ? (
                  <RefreshCw className="size-4" />
                ) : (
                  <Send className="size-4" />
                )}
                {submitting
                  ? "Submitting…"
                  : isRejected
                    ? "Resubmit"
                    : "Submit Assignment"}
              </button>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
