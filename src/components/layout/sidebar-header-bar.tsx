"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/shared/theme-toggle"

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/courses": "My Courses",
  "/assignments": "Assignments",
  "/profile": "My Profile",
  "/support": "Support",
  "/about": "About",
}

function getPageLabel(pathname: string): string {
  // Exact match first
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname]

  // Prefix match (e.g. /course/[id]/learn/…)
  if (pathname.startsWith("/course")) return "My Courses"
  if (pathname.startsWith("/quiz")) return "Quiz"
  if (pathname.startsWith("/assignments")) return "Assignments"

  return "Betterinu"
}

export function SidebarHeaderBar() {
  const pathname = usePathname()
  const label = getPageLabel(pathname)

  return (
    <header className="border-sidebar-border bg-sidebar sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
      <div className="flex items-center gap-2">
        {/* SidebarTrigger only shown on desktop; mobile uses bottom nav */}
        <SidebarTrigger className="-ml-1 hidden md:flex" />
        <Separator
          orientation="vertical"
          className="mr-2 hidden h-4 md:block"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
