"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronsUpDown, LogOut, UserCircle, KeyRound } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStudentProfile } from "@/lib/hooks/use-profile"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChangePasswordModal } from "@/components/shared/change-password-modal"
import { getClientAuth } from "@/lib/firebase-client"

function getInitials(name: string | null | undefined) {
  if (!name) return "S"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const pathname = usePathname()
  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const { data: profile } = useStudentProfile()
  const avatarUrl = profile?.avatar_url ?? (profile as any)?.profile_image_url ?? null

  useEffect(() => {
    return getClientAuth().onAuthStateChanged((user) => {
      setName(user?.displayName ?? null)
      setEmail(user?.email ?? null)
    })
  }, [])

  async function handleSignOut() {
    await getClientAuth().signOut()
    window.location.href = "/login"
  }

  const displayName = name ?? "Student"
  const displayEmail = email ?? ""

  return (
    <>
      <SidebarMenu className="border-sidebar-border/30 border-t px-1  pb-1">
        <SidebarMenuItem>
          <Popover>
            <PopoverTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:border-primary group/user w-full border shadow-2xs transition-all duration-250 ease-in-out"
              >
                <Avatar className="border-primary-foreground/30 size-8 rounded-md border shadow-inner transition-colors">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />}
                  <AvatarFallback className="from-primary-foreground/20 via-primary-foreground/10 text-primary-foreground rounded-md bg-gradient-to-br to-transparent text-xs font-black tracking-wider transition-all duration-300 group-hover/user:scale-105">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-0.5 grid flex-1 text-left text-sm leading-tight">
                  <span className="text-primary-foreground truncate font-semibold transition-colors">
                    {displayName}
                  </span>
                  <span className="text-primary-foreground/80 truncate text-[10px] font-medium tracking-wide transition-colors">
                    {displayEmail}
                  </span>
                </div>
                <ChevronsUpDown className="text-primary-foreground/80 ml-auto size-3.5 transition-all duration-300 group-hover/user:translate-y-[-1px]" />
              </SidebarMenuButton>
            </PopoverTrigger>

            <PopoverContent
              className="w-[--radix-popover-trigger-width] min-w-56 rounded-lg p-1 bg-popover text-popover-foreground border shadow-md"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <div className="flex items-center gap-2 px-2.5 py-2 text-left text-sm">
                <Avatar className="border-primary/15 size-8 rounded-md border shadow-inner">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />}
                  <AvatarFallback className="from-primary/20 via-primary/10 text-primary rounded-md bg-gradient-to-br to-transparent text-xs font-black tracking-wider">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-foreground">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {displayEmail}
                  </span>
                </div>
              </div>

              <div className="-mx-1 h-px bg-border" />

              <div className="flex flex-col gap-1 ">
                <Link
                  href="/profile"
                  className={cn(
                    "group flex w-full items-center gap-2 border-b  rounded-sm px-2.5 py-1.5 text-sm font-medium transition-colors text-left",
                    pathname === "/profile"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary hover:text-primary-foreground text-foreground"
                  )}
                >
                  <UserCircle className={cn("size-4", pathname === "/profile" ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary-foreground")} />
                  <span>Account</span>
                </Link>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="group hover:bg-primary hover:text-primary-foreground text-foreground flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm font-medium transition-colors text-left"
                >
                  <KeyRound className="size-4 text-muted-foreground group-hover:text-primary-foreground" />
                  <span>Change Password</span>
                </button>
              </div>

              <div className="-mx-1 h-px bg-border" />

              <div className="py-1">
                <button
                  onClick={handleSignOut}
                  className="hover:bg-destructive/10 hover:text-destructive text-destructive flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors text-left"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </SidebarMenuItem>
      </SidebarMenu>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  )
}
