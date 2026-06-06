import type { Metadata } from "next"

import { PageWrapper } from "@/components/layout/page-wrapper"
import { FeesClient } from "./_components/fees-client"

export const metadata: Metadata = {
  title: "My Fees | Betterinu",
  description: "View your fee plan, installment timeline, and payment history.",
}

export default function FeesPage() {
  return (
    <PageWrapper>
      <FeesClient />
    </PageWrapper>
  )
}
