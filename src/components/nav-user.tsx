"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronsUpDown, LogOut, UserCircle, KeyRound } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [showChangePassword, setShowChangePassword] = useState(false)

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
      <SidebarMenu className="border-t border-sidebar-border/30 pt-4 px-1 pb-1">
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full border border-sidebar-border/40 bg-sidebar-accent/30 shadow-2xs hover:bg-sidebar-accent/70 hover:border-sidebar-border/80 data-[state=open]:bg-sidebar-accent data-[state=open]:border-sidebar-border/80 transition-all duration-250 ease-in-out group/user"
              >
                <Avatar className="size-8 rounded-xl border border-primary/15 shadow-inner">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary rounded-xl text-xs font-black tracking-wider transition-transform group-hover/user:scale-105 duration-300">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight ml-0.5">
                  <span className="truncate font-semibold text-foreground/90 group-hover/user:text-foreground">{displayName}</span>
                  <span className="text-muted-foreground/75 truncate text-[10px] font-medium tracking-wide">
                    {displayEmail}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-3.5 text-muted-foreground/60 transition-transform duration-300 group-hover/user:translate-y-[-1px]" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-xl border border-primary/15 shadow-inner">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary rounded-xl text-xs font-black tracking-wider">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {displayEmail}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserCircle />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowChangePassword(true)}
                >
                  <KeyRound />
                  Change Password
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  )
}
