"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  UserCircle,
  LifeBuoy,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_MAIN = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "My Courses", href: "/courses", icon: BookOpen },
  { title: "Assignments", href: "/assignments", icon: ClipboardList },
  { title: "My Profile", href: "/profile", icon: UserCircle },
]

const NAV_SECONDARY = [
  { title: "Support", href: "/support", icon: LifeBuoy },
]

export function NavMain() {
  const pathname = usePathname()

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="px-3 text-[10px] font-bold tracking-wider text-sidebar-foreground/45 uppercase select-none">
          Learning
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1.5">
            {NAV_MAIN.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      "h-10 relative transition-all duration-200 ease-in-out group/btn rounded-sm",
                      isActive
                        ? "bg-primary text-primary-foreground font-bold pl-3 shadow-md hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-sidebar-foreground/70 hover:text-primary pl-3 hover:bg-transparent active:bg-transparent"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={cn(
                        "size-4.5 transition-all duration-200 ease-out",
                        isActive 
                          ? "text-primary-foreground scale-110" 
                          : "text-sidebar-foreground/50 group-hover/btn:text-primary group-hover/btn:scale-105"
                      )} />
                      <span className={cn(
                        "transition-colors duration-200 text-sm tracking-tight",
                        isActive ? "text-primary-foreground font-bold" : "font-semibold"
                      )}>
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

      {/* Bottom secondary nav */}
      <SidebarGroup className="mt-auto">
        <SidebarGroupLabel className="px-3 text-[10px] font-bold tracking-wider text-sidebar-foreground/45 uppercase select-none">
          Support
        </SidebarGroupLabel>
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
                      "h-10 relative transition-all duration-200 ease-in-out group/btn rounded-sm",
                      isActive
                        ? "bg-primary text-primary-foreground font-bold pl-3 shadow-md hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-sidebar-foreground/70 hover:text-primary pl-3 hover:bg-transparent active:bg-transparent"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={cn(
                        "size-4.5 transition-all duration-200 ease-out",
                        isActive 
                          ? "text-primary-foreground scale-110" 
                          : "text-sidebar-foreground/50 group-hover/btn:text-primary group-hover/btn:scale-105"
                      )} />
                      <span className={cn(
                        "transition-colors duration-200 text-sm tracking-tight",
                        isActive ? "text-primary-foreground font-bold" : "font-semibold"
                      )}>
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
