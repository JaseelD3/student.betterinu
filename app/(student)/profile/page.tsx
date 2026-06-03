"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  CreditCard,
  UserCheck,
} from "lucide-react"
import RoboLoader from "@/components/loading/robo-loader"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Avatar as UIDAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { StudentFeeSection } from "@/components/student/fee/student-fee-section"
import { studentApi } from "@/lib/api-client"

const STATUS_CFG = {
  active: {
    label: "Active",
    cls: "bg-green-50 text-green-700 border-green-200",
  },
  inactive: { label: "Inactive", cls: "bg-red-50 text-red-700 border-red-200" },
  pending: {
    label: "Pending",
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
} as const

const STUDENT_TYPE_CFG = {
  online: { label: "Online Student" },
  offline: { label: "Offline Student" },
} as const

function Avatar({ url, name }: { url?: string; name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
  return (
    <UIDAvatar className="size-24 shadow-md ring-4 ring-white">
      {url && <AvatarImage src={url} alt={name} className="object-cover" />}
      <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
        {initials}
      </AvatarFallback>
    </UIDAvatar>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value?: string | number | null
}) {
  const displayValue =
    value !== undefined && value !== null && value !== "" ? value : "-"

  return (
    <div className="border-default flex items-start gap-3 border-b py-3 last:border-0">
      <div className="bg-subtle mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md">
        <Icon className="text-primary size-4" />
      </div>
      <div>
        <p className="text-muted mb-0.5 text-xs font-medium">{label}</p>
        <p className="text-foreground text-sm font-semibold">{displayValue}</p>
      </div>
    </div>
  )
}

function SectionCard({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn("gap-0 pb-1", className)}>
      <CardHeader className="border-default border-b pb-3">
        <CardTitle className="text-muted text-xs font-bold tracking-wider uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function StudentProfilePage() {
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    studentApi
      .getProfile()
      .then((data) => {
        setStudent(data)
      })
      .catch((err) => {
        setError(err.message || "An error occurred")
      })
      .finally(() => {
        setLoading(false)
      })
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
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-default flex flex-col items-center justify-center rounded-md border border-dashed bg-white py-20 text-center shadow-sm">
          <ShieldAlert className="mb-4 size-10 text-red-500" />
          <h3 className="text-foreground text-lg font-bold">
            Failed to load profile
          </h3>
          <p className="text-muted mt-2 text-sm">
            {error || "Please sign in again."}
          </p>
          <Link
            href="/"
            className="text-primary mt-6 text-sm font-bold hover:underline"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  const statusCfg =
    STATUS_CFG[student.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.active
  const typeCfg = STUDENT_TYPE_CFG[
    student.student_type as keyof typeof STUDENT_TYPE_CFG
  ] ?? { label: "Student" }

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : undefined

  const renderDocRow = (url: string, label: string) => (
    <div className="border-default bg-elevated/40 hover:bg-elevated flex items-center justify-between gap-3 rounded-md border p-3 transition-colors">
      <div className="flex min-w-0 items-center gap-3">
        <div className="bg-primary/5 border-primary/10 flex size-10 shrink-0 items-center justify-center rounded-md border">
          <FileText className="text-primary size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-bold">{label}</p>
          <p className="text-muted truncate text-xs">Uploaded Attachment</p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-primary border-default hover:bg-subtle inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-white px-3 py-2 text-xs font-bold transition-colors hover:underline"
      >
        View File
      </a>
    </div>
  )

  return (
    <div className="bg-subtle mt-16 min-h-screen w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-secondary hover:text-primary mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>

        {/* Page header */}
        <div className="border-default mb-6 flex flex-wrap items-center justify-between gap-4 rounded-md border bg-white p-5">
          <div className="flex items-center gap-5">
            <Avatar url={student.profile_image_url} name={student.name} />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-foreground text-2xl font-bold tracking-tight">
                  {student.name}
                </h1>
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${statusCfg.cls}`}
                >
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-secondary mt-1 text-sm">{student.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="bg-subtle border-default text-muted rounded-md border px-2 py-0.5 font-mono text-[11px]">
                  ID: {student.student_code || student.id.slice(0, 8)}
                </span>
                <span className="border-default text-secondary rounded-md border px-2 py-0.5 text-[11px] font-semibold">
                  {typeCfg.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Cards Grid */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <SectionCard title="Contact Information" className="h-full">
              <InfoRow
                icon={Mail}
                label="Email Address"
                value={student.email}
              />
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={student.phone}
              />
              <InfoRow icon={MapPin} label="Address" value={student.address} />
            </SectionCard>
          </div>

          {/* Personal Info */}
          <div className="lg:col-span-1">
            <SectionCard title="Personal Information" className="h-full">
              <InfoRow icon={User} label="Gender" value={student.gender} />
              <InfoRow
                icon={Calendar}
                label="Date of Birth"
                value={formatDate(student.date_of_birth)}
              />
              <InfoRow
                icon={UserCheck}
                label="Student Type"
                value={
                  student.student_type
                    ? student.student_type.charAt(0).toUpperCase() +
                      student.student_type.slice(1)
                    : null
                }
              />
            </SectionCard>
          </div>

          {/* Academic Info */}
          <div className="lg:col-span-2">
            <SectionCard title="Academic Profile" className="h-full">
              <InfoRow
                icon={User}
                label="Highest Qualification"
                value={student.highest_qualification}
              />
              <InfoRow
                icon={User}
                label="Current Status"
                value={
                  student.current_status
                    ? student.current_status.charAt(0).toUpperCase() +
                      student.current_status.slice(1).replace("_", " ")
                    : null
                }
              />
              <InfoRow
                icon={Calendar}
                label="Year of Passing"
                value={student.year_of_passing}
              />
            </SectionCard>
          </div>

          {/* Emergency Contact */}
          <div className="flex h-full flex-col gap-6 lg:col-span-1">
            <SectionCard title="Emergency Contact" className="flex-1">
              <InfoRow
                icon={User}
                label="Contact Name"
                value={student.emergency_contact_name}
              />
              <InfoRow
                icon={User}
                label="Relationship"
                value={student.emergency_contact_relation}
              />
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={student.emergency_contact_phone}
              />
            </SectionCard>
          </div>
        </div>

        {/* Documents Section */}
        {(student.certification_url || student.id_proof_url) && (
          <div className="mt-6">
            <SectionCard title="Uploaded Documents">
              <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
                {student.id_proof_url &&
                  renderDocRow(student.id_proof_url, "Government ID Proof")}
                {student.certification_url &&
                  renderDocRow(
                    student.certification_url,
                    "Qualification Certificate"
                  )}
              </div>
            </SectionCard>
          </div>
        )}

        {/* Fee Section */}
        <div className="mt-6">
          <Card>
            <CardHeader className="border-default border-b pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary size-4" />
                <CardTitle className="text-muted text-xs font-bold tracking-wider uppercase">
                  Fee & Payments
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <StudentFeeSection />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
