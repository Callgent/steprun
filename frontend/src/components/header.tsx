"use client"

import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Terminal, User } from "lucide-react"
import { PixelCursor, PixelRobot, PixelStar } from "./pixel-decorations"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export function Header() {
  const { user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const whitelist = ['/', '/login', '/register', '/reset-password']
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!whitelist.includes(pathname) && !token) {
      router.push('/login')
    }
  }, [pathname])
  return (
    <>
      <header className="container mx-auto py-4 px-2 flex justify-between items-center border-b-4 border-zinc-800 relative z-10 ">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-3xl font-rounded">
          <Terminal className="h-6 w-6 text-emerald-500 pixel-icon" />
          𑢡teprun.ai
        </Link>
        <div className="flex items-center gap-4 font-sans">
          <Link href="https://api.steprun.ai/docs" className="hover:text-emerald-500" target="_blank">
            Docs
          </Link>
          <Link href="/#features" className="hover:text-emerald-500">
            Features
          </Link>
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link href="/profile">
              <Button
                variant="outline"
                className="border-4 border-emerald-500 text-emerald-500 hover:bg-emerald-950 pixel-button"
              >
                <User className="h-4 w-4 pixel-icon " />
              </Button>
            </Link>
          ) : (
            <div className="flex gap-2 font-sans">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-4 border-emerald-500 text-emerald-500 hover:bg-zinc-800 pixel-button"
                >
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>
      <div>
        <div className="fixed top-20 left-20 opacity-30 z-0">
          <PixelStar className="pixel-pulse" />
        </div>
        <div className="fixed top-40 right-40 opacity-30 z-0">
          <PixelStar className="pixel-pulse" />
        </div>
        <div className="fixed bottom-20 left-40 opacity-30 z-0">
          <PixelStar className="pixel-pulse" />
        </div>
        <div className="fixed top-60 left-[30%] opacity-30 z-0">
          <PixelStar className="pixel-pulse" />
        </div>
        <div className="fixed top-32 left-36 opacity-50 z-0">
          <PixelRobot />
        </div>
        <div className="fixed bottom-20 top-96 left-[40%] opacity-50 z-0">
          <PixelCursor />
        </div>
      </div>
    </>
  )
}
