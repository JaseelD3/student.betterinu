"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  LifeBuoy,
  CalendarDays,
  Wallet,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useCourses } from "@/lib/hooks/use-courses"

const NAV_MAIN = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Assignments", href: "/assignments", icon: ClipboardList },
  { title: "Attendance", href: "/attendance", icon: CalendarDays },
  { title: "Fees and fines", href: "/fees", icon: Wallet },
]

const NAV_SECONDARY = [{ title: "Support", href: "/support", icon: LifeBuoy }]

export function NavMain() {
  const pathname = usePathname()
  const { data: courses = [] } = useCourses()
  const isCoursesActive = pathname.startsWith("/course")

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="text-sidebar-foreground/45 px-3 text-[10px] font-bold tracking-wider uppercase select-none">
          Learning
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1.5">
            {/* Dashboard */}
            {NAV_MAIN.slice(0, 1).map((item) => {
              const isActive = pathname === "/"
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      "group/btn relative h-10 rounded-sm transition-all duration-200 ease-in-out",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground pl-3 font-bold shadow-md"
                        : "text-sidebar-foreground/70 hover:text-primary pl-3 hover:bg-transparent active:bg-transparent"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "size-4.5 transition-all duration-200 ease-out",
                          isActive
                            ? "text-primary-foreground scale-110"
                            : "text-sidebar-foreground/50 group-hover/btn:text-primary group-hover/btn:scale-105"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm tracking-tight transition-colors duration-200",
                          isActive ? "text-primary-foreground font-bold" : "font-semibold"
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}

            {/* My Course — direct link to the single enrolled course */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="My Course"
                className={cn(
                  "group/btn relative h-10 rounded-sm transition-all duration-200 ease-in-out",
                  isCoursesActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground pl-3 font-bold shadow-md"
                    : "text-sidebar-foreground/70 hover:text-primary pl-3 hover:bg-transparent active:bg-transparent",
                  !courses[0] && "opacity-50 pointer-events-none"
                )}
              >
                <Link
                  href={courses[0] ? `/course/${courses[0].id}` : "#"}
                  className="flex items-center gap-3"
                  aria-disabled={!courses[0]}
                  tabIndex={!courses[0] ? -1 : 0}
                >
                  <BookOpen
                    className={cn(
                      "size-4.5 transition-all duration-200 ease-out",
                      isCoursesActive
                        ? "text-primary-foreground scale-110"
                        : "text-sidebar-foreground/50 group-hover/btn:text-primary group-hover/btn:scale-105"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm tracking-tight transition-colors duration-200",
                      isCoursesActive ? "text-primary-foreground font-bold" : "font-semibold"
                    )}
                  >
                    My Course
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Rest of nav items */}
            {NAV_MAIN.slice(1).map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      "group/btn relative h-10 rounded-sm transition-all duration-200 ease-in-out",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground pl-3 font-bold shadow-md"
                        : "text-sidebar-foreground/70 hover:text-primary pl-3 hover:bg-transparent active:bg-transparent"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "size-4.5 transition-all duration-200 ease-out",
                          isActive
                            ? "text-primary-foreground scale-110"
                            : "text-sidebar-foreground/50 group-hover/btn:text-primary group-hover/btn:scale-105"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm tracking-tight transition-colors duration-200",
                          isActive ? "text-primary-foreground font-bold" : "font-semibold"
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="mt-auto">
        {/* <SidebarGroupLabel className="text-sidebar-foreground/45 px-3 text-[10px] font-bold tracking-wider uppercase select-none">
          Support
        </SidebarGroupLabel> */}
        <SidebarGroupContent>
          <SidebarMenu className="gap-1.5">
            {NAV_SECONDARY.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      "group/btn relative h-10 rounded-sm transition-all duration-200 ease-in-out",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground pl-3 font-bold shadow-md"
                        : "text-sidebar-foreground/70 hover:text-primary pl-3 hover:bg-transparent active:bg-transparent"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "size-4.5 transition-all duration-200 ease-out",
                          isActive
                            ? "text-primary-foreground scale-110"
                            : "text-sidebar-foreground/50 group-hover/btn:text-primary group-hover/btn:scale-105"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm tracking-tight transition-colors duration-200",
                          isActive ? "text-primary-foreground font-bold" : "font-semibold"
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
