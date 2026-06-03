"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="from-sidebar via-sidebar to-sidebar/98 border-sidebar-border/40 border-r bg-gradient-to-b shadow-[1px_0_10px_-5px_rgba(0,0,0,0.05)] transition-all"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border/30 flex h-14 items-center justify-center border-b p-0 select-none">
        <Link
          href="/"
          className="group/logo flex h-full w-full items-center justify-center"
        >
          {state === "collapsed" ? (
            <div className="from-primary/20 to-sidebar-accent border-primary/10 group-hover/logo:border-primary/20 flex aspect-square size-9 items-center justify-center overflow-hidden rounded-md border bg-gradient-to-tr shadow-inner transition-all duration-300 group-hover/logo:scale-105">
              <Image
                src="/logo.svg"
                alt="Betterinu Logo Symbol"
                width={102}
                height={36}
                className="h-9 w-auto min-w-[102px] object-cover object-left dark:hidden"
                unoptimized
              />
              <Image
                src="/logo-dark.svg"
                alt="Betterinu Logo Symbol"
                width={102}
                height={36}
                className="hidden h-9 w-auto min-w-[102px] object-cover object-left dark:block"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-start px-3 transition-transform duration-300 group-hover/logo:translate-x-0.5">
              <Image
                src="/logo.svg"
                alt="Betterinu Logo"
                width={140}
                height={40}
                className="h-10 w-auto object-contain dark:hidden"
                unoptimized
              />
              <Image
                src="/logo-dark.svg"
                alt="Betterinu Logo"
                width={140}
                height={40}
                className="hidden h-10 w-auto object-contain dark:block"
                unoptimized
              />
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
