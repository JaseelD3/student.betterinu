"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  FileText,
  ShieldAlert,
  HeartPulse,
  BookOpen,
  Paperclip,
  BadgeCheck,
  IdCard,
} from "lucide-react"
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import RoboLoader from "@/components/loading/robo-loader"
import { studentApi } from "@/lib/api-client"
import { PageWrapper } from "@/components/layout/page-wrapper"

// ─── Types ────────────────────────────────────────────────────────────────────

type StudentStatus = "active" | "inactive" | "pending"
type StudentType = "online" | "offline"

interface Student {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  gender?: string | null
  date_of_birth?: string | null
  student_type?: StudentType | null
  student_code?: string | null
  status?: StudentStatus | null
  profile_image_url?: string | null
  highest_qualification?: string | null
  current_status?: string | null
  year_of_passing?: string | number | null
  emergency_contact_name?: string | null
  emergency_contact_relation?: string | null
  emergency_contact_phone?: string | null
  id_proof_url?: string | null
  certification_url?: string | null
  created_at?: string | null
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    cls: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-rose-500",
    cls: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    cls: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40",
  },
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function formatDate(d?: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function capitalize(s?: string | null) {
  if (!s) return null
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ")
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StudentAvatar({
  url,
  name,
}: {
  url?: string | null
  name: string
}) {
  return (
    <UIAvatar className="size-20 ring-3 ring-background shadow-lg">
      {url && <AvatarImage src={url} alt={name} className="object-cover" />}
      <AvatarFallback className="bg-primary text-blue-200 text-2xl font-normal">
        {getInitials(name)}
      </AvatarFallback>
    </UIAvatar>
  )
}

// Panel with labelled header
function Panel({
  title,
  icon: Icon,
  children,
  className,
  headClassName,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
  headClassName?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card  border-primary/20 ",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b border-border/60 px-5 py-3",
          headClassName
        )}
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

// Single labelled info row inside a panel
function InfoRow({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  const display =
    value !== undefined && value !== null && value !== "" ? value : null

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 border-b border-border/50 px-5 py-3 last:border-0 hover:bg-muted/40 transition-colors">
      <span className="text-xs text-muted-foreground/80">
        {label}
      </span>
      {display !== null ? (
        <span
          className={cn(
            "text-sm font-medium text-foreground text-left sm:text-right"
          )}
        >
          {display}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground/40">—</span>
      )}
    </div>
  )
}

// Compact stat card
function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value?: string | number | null
  sub?: string | null
}) {
  return (
    <div className="relative overflow-hidden rounded-md border border-border bg-card px-5 pb-4 pt-5  border-primary/20 ">
      {/* top accent line */}
      <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground/60">
        {label}
      </p>
      <p className="text-lg leading-tight text-foreground font-semibold">
        {value ?? <span className="text-muted-foreground/40 text-sm font-normal">—</span>}
      </p>
      {sub && (
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      )}
    </div>
  )
}

// Document attachment row
function DocRow({ url, label, sub }: { url: string; label: string; sub: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-border/50 px-5 py-4 last:border-0 hover:bg-muted/40 transition-colors">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
        <FileText className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 rounded-md border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
      >
        View File
      </a>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentProfilePage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    studentApi
      .getProfile()
      .then((data: Student) => setStudent(data))
      .catch((err: Error) => setError(err.message || "An error occurred"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <RoboLoader size="md" caption="Loading your profile..." />
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-card py-20 text-center">
          <ShieldAlert className="mb-4 size-10 text-destructive" />
          <h3 className="text-lg font-bold">Failed to load profile</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? "Please sign in again."}
          </p>
          <Link
            href="/"
            className="mt-6 text-sm font-bold text-primary hover:underline"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  const statusCfg =
    STATUS_CFG[(student.status ?? "active") as keyof typeof STATUS_CFG] ??
    STATUS_CFG.active

  const enrolledDate = formatDate(student.created_at)

  const hasDocs = !!(student.id_proof_url || student.certification_url)

  return (
    <PageWrapper className="bg-muted/30 pb-20 md:pb-8">
      <div className="mx-auto w-full  space-y-3">

        {/* ── Hero Card ─────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-md border border-border bg-card  border-primary/20 ">
          {/* Stripe */}
          <div className="relative h-12 bg-muted/40">
            <span className="absolute right-5 top-4 text-xs tracking-widest uppercase text-muted-foreground/50 font-semibold">
              Betterinu LMS · Student Record
            </span>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="-mt-6 mb-4 flex items-end justify-between">
              <StudentAvatar url={student.profile_image_url} name={student.name} />
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
                  statusCfg.cls
                )}
              >
                <span className={cn("size-1.5 rounded-full", statusCfg.dot)} />
                {statusCfg.label}
              </span>
            </div>

            {/* Name, email & meta tags row */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              {/* Left: Name / email */}
              <div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
                  {student.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{student.email}</p>
              </div>

              {/* Right: Meta tags */}
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                {(student.student_code || student.id) && (
                  <span className="rounded-md border border-border/60 bg-muted/60 px-3 py-1 text-xs text-muted-foreground font-medium">
                    <span className="font-bold text-foreground">ID</span>
                    {" · "}
                    {student.student_code ?? student.id.slice(0, 8)}
                  </span>
                )}
                {student.student_type && (
                  <span className="rounded-md border border-border/60 bg-muted/60 px-3 py-1 text-xs text-muted-foreground font-medium">
                    <span className="font-bold text-foreground">Type</span>
                    {" · "}
                    {capitalize(student.student_type)}
                  </span>
                )}
                {enrolledDate && (
                  <span className="rounded-md border border-border/60 bg-muted/60 px-3 py-1 text-xs text-muted-foreground font-medium">
                    <span className="font-bold text-foreground">Enrolled</span>
                    {" · "}
                    {enrolledDate}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat Strip ────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Qualification"
            value={student.highest_qualification}
            sub="Highest degree"
          />
          <StatCard
            label="Year of Passing"
            value={student.year_of_passing}
            sub="Graduation year"
          />
          <StatCard
            label="Current Status"
            value={capitalize(student.current_status)}
            sub="Academic / professional"
          />
        </div>

        {/* ── Contact + Personal ────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Panel title="Contact Information" icon={Mail}>
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Phone" value={student.phone} />
            <InfoRow label="Address" value={student.address} />
          </Panel>

          <Panel title="Personal Information" icon={User}>
            <InfoRow label="Gender" value={capitalize(student.gender)} />
            <InfoRow
              label="Date of Birth"
              value={formatDate(student.date_of_birth)}
            />
            <InfoRow
              label="Student Type"
              value={capitalize(student.student_type)}
            />
          </Panel>
        </div>

        {/* ── Emergency Contact ─────────────────────────────────── */}
        <div className="overflow-hidden rounded-md border border-border bg-card  border-primary/20 ">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/60 px-5 py-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <HeartPulse className="size-4" />
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Emergency Contact
            </span>
          </div>

          {/* 3-col horizontal on md+, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="border-b border-border/50 px-5 py-4 md:border-b-0 md:border-r">
              <p className="mb-1 text-xs text-muted-foreground/80">Contact Name</p>
              <p className="text-sm font-medium text-foreground">
                {student.emergency_contact_name ?? (
                  <span className="text-muted-foreground/40">—</span>
                )}
              </p>
            </div>
            <div className="border-b border-border/50 px-5 py-4 md:border-b-0 md:border-r">
              <p className="mb-1 text-xs text-muted-foreground/80">Relationship</p>
              <p className="text-sm font-medium text-foreground">
                {student.emergency_contact_relation ?? (
                  <span className="text-muted-foreground/40">—</span>
                )}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="mb-1 text-xs text-muted-foreground/80">Phone</p>
              <p className="text-sm font-medium text-foreground">
                {student.emergency_contact_phone ?? (
                  <span className="text-muted-foreground/40">—</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ── Documents ─────────────────────────────────────────── */}
        {hasDocs && (
          <Panel title="Uploaded Documents" icon={Paperclip}>
            {student.id_proof_url && (
              <DocRow
                url={student.id_proof_url}
                label="Government ID Proof"
                sub="Identity document · Uploaded attachment"
              />
            )}
            {student.certification_url && (
              <DocRow
                url={student.certification_url}
                label="Qualification Certificate"
                sub="Academic certificate · Uploaded attachment"
              />
            )}
          </Panel>
        )}

      </div>
    </PageWrapper>
  )
}