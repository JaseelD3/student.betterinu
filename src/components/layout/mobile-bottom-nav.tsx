"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  UserCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { title: "Home", href: "/", icon: LayoutDashboard },
  { title: "Courses", href: "/courses", icon: BookOpen },
  { title: "Tasks", href: "/assignments", icon: ClipboardList },
  { title: "Profile", href: "/profile", icon: UserCircle },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="border-sidebar-border bg-sidebar/90 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t px-2 backdrop-blur-md md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 rounded-md py-2 text-[10px] font-medium transition-colors",
              isActive
                ? "text-sidebar-primary"
                : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
            )}
          >
            <item.icon
              className={cn(
                "size-5 transition-transform",
                isActive && "scale-110"
              )}
            />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
