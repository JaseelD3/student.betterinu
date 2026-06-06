import type { Metadata } from "next"
import "./globals.css"
import { Sora, Lato, JetBrains_Mono } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/context/query-provider"
import { ThemeProvider } from "@/context/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
})

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Betterinu LMS",
  description:
    "A weekly skill-building LMS — courses, quizzes, progress, XP, and streaks.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Betterinu LMS",
    description:
      "A weekly skill-building LMS — courses, quizzes, progress, XP, and streaks.",
    images: [
      { url: "/logo.png", width: 800, height: 600, alt: "Betterinu LMS" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(sora.variable, lato.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </QueryProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
