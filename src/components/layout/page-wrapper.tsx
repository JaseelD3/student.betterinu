import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type PageWrapperProps = {
  children: ReactNode
  /**
   * By default every page gets `p-4 sm:p-6` so content never touches the
   * viewport edges or the sticky header.  Set `noPadding` to opt out (e.g.
   * the Learn page handles its own padding because of the flush sidebar).
   */
  noPadding?: boolean
  className?: string
}

/**
 * PageWrapper
 * ──────────────────────────────────────────────────────────────────────────
 * Universal page-content container.  Sits directly inside `SidebarInset`
 * (which already provides the scrollable region).
 *
 * • Consistent horizontal + vertical padding across every page
 * • Smooth scrolling is set on <html> via globals.css
 * • Extra bottom padding so content clears the mobile bottom nav
 */
export function PageWrapper({ children, noPadding = false, className }: PageWrapperProps) {
  return (
    <div
      className={cn(
        "flex flex-1 w-full flex-col",
        !noPadding && "p-4 pb-20 sm:p-5 sm:pb-20 md:pb-5",
        className
      )}
    >
      {children}
    </div>
  )
}
