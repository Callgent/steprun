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

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuthStore()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setPasswordError("")

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    const result = await register(username, email, password)
    if (result === true) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="bg-zinc-900 mt-10 text-zinc-100 text-base flex items-center justify-center p-4 pixel-grid font-sans">
      <Card className="w-full max-w-md bg-zinc-800 border-4 border-zinc-700 rounded-none pixel-container">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-emerald-500 pixel-icon" />
              <span className=" text-2xl ">Steprun.ai</span>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center ">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="">
                Username
              </Label>
              <Input
                id="username"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-700 font-mono"
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-700 font-mono"
              />
            </div>

            {passwordError && (
              <div className="bg-red-500/20 text-red-500 p-3 rounded-md  ">{passwordError}</div>
            )}

            {error && <div className="bg-red-500/20 text-red-500 p-3 rounded-md  ">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-6 pixel-button"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full  text-zinc-400 ">
            Already have an account?{" "}
            <Link href="/login" className="hover:text-emerald-500 underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}