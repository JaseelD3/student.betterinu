import type { Metadata } from "next"

import { PageWrapper } from "@/components/layout/page-wrapper"
import { AttendanceClient } from "./_components/attendance-client"

export const metadata: Metadata = {
  title: "My Attendance | Betterinu",
  description: "View your monthly attendance, punch-in history, and leave records.",
}

export default function AttendancePage() {
  return (
    <PageWrapper>
      <AttendanceClient />
    </PageWrapper>
  )
}
