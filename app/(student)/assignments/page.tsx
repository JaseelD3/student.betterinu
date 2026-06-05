import type { Metadata } from "next"

import { PageWrapper } from "@/components/layout/page-wrapper"
import { AssignmentsClient } from "./_components/assignments-client"

export const metadata: Metadata = {
  title: "My Tasks | Betterinu",
  description: "View and manage all assignments given to you by your instructors.",
}

export default function AssignmentsPage() {
  return (
    <PageWrapper>
      <AssignmentsClient />
    </PageWrapper>
  )
}
