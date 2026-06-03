import type { ReactNode } from "react"

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <main className="text-foreground min-h-screen bg-transparent px-4 pt-[72px] pb-16 sm:px-6 lg:px-8">
      {children}
    </main>
  )
}
