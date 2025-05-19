"use client"

import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Terminal, User } from "lucide-react"

export function Header() {
  const { user } = useAuthStore()

  return (
    <header className="container mx-auto py-4 px-2 flex justify-between items-center border-b-4 border-zinc-800 relative z-10 ">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Terminal className="h-6 w-6 text-emerald-500 pixel-icon" />
        <span className="text-2xl font-bold pixel-text">𑢡tepRun.ai</span>
      </Link>
      {/* <nav className="hidden md:flex gap-8">
        <Link href="#features" className="text-zinc-400 hover:text-emerald-500 transition-colors pixel-text text-sm">
          Features
        </Link>
        <Link href="#api" className="text-zinc-400 hover:text-emerald-500 transition-colors pixel-text text-sm">
          API
        </Link>
        <Link href="#demo" className="text-zinc-400 hover:text-emerald-500 transition-colors pixel-text text-sm">
          Demo
        </Link>
      </nav> */}
      <div className="flex items-center gap-4">
        {user ? (
          <Link href="/profile">
            <Button
              variant="outline"
              className="border-4 border-emerald-500 text-emerald-500 hover:bg-emerald-950 pixel-button"
            >
              <User className="h-4 w-4 mr-2 pixel-icon" />
              <span className="pixel-text text-sm">Profile</span>
            </Button>
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800 pixel-button"
              >
                <span className="pixel-text text-sm">Login</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
