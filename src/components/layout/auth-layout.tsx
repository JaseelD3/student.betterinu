import Image from "next/image"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/shared/theme-toggle"

type AuthLayoutProps = {
  children: React.ReactNode
}

/**
 * Centered two-column auth shell.
 * Left: card with form content. Right: branding image (desktop only).
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="dark:bg-background relative flex min-h-screen w-full bg-white">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="grid min-h-screen w-full md:grid-cols-2">
        {/* Left: branding image — desktop only */}
        <div className="relative hidden p-6 md:block lg:p-5">
          <div className="from-primary/90 via-accent/80 to-secondary/60 relative h-full w-full overflow-hidden rounded-md bg-gradient-to-br">
            <Image
              src="/betty-img.png"
              alt="Betterinu Login Branding"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right: slot for form */}
        <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-20">
          <Card className="border-border/50 mx-auto w-full max-w-sm rounded-md border p-6 sm:p-8 md:border-0 md:shadow-none md:ring-0">
            {children}
          </Card>
        </div>
      </div>
    </main>
  )
}
