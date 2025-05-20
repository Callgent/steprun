"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Terminal, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/store/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const { login, userInfo, isLoading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    const success = await login(email, password)
    await userInfo()
    if (success) {
      router.push("/")
    }
  }

  return (
    <div className="mt-10 bg-zinc-900 text-zinc-100 text-base flex items-center justify-center p-4 pixel-grid font-sans">
      <Card className="w-full max-w-md bg-zinc-800 border-4 border-zinc-700 rounded-none pixel-container">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-emerald-500 pixel-icon" />
              <span className="  text-2xl">Steprun.ai</span>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center ">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-700 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-700 font-mono"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-zinc-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-500 p-3 rounded-md  ">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-6 pixel-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center  text-zinc-400 ">
            <Link href="/forgot-password" className="hover:text-emerald-500 underline underline-offset-4">
              Forgot password?
            </Link>
          </div>
          <div className="text-center  text-zinc-400 ">
            Don't have an account?{" "}
            <Link href="/register" className="hover:text-emerald-500 underline underline-offset-4">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}