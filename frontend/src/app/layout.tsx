import type React from "react"
import type { Metadata } from "next"
import { Space_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "PixelCode.AI - Pixel Art Code Generation",
  description:
    "Generate code incrementally with AI in pixel art style. Line-by-line code generation with immediate feedback.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" />
      </head>
      <body className={`${spaceMono.variable} font-mono`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-zinc-900 text-zinc-100 font-mono pixel-grid">
            <AuthProvider>{children}</AuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
