"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuthStore } from "@/lib/store/auth-store"
import { useSearchParams } from "next/navigation"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const { recovery, resetPassword } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setIsSubmitting(true)

    try {
      if (!token) {
        const result = await recovery(email)
        if (result) {
          setSuccessMessage("Reset link has been sent to your email.")
        } else {
          setError('error')
        }
      } else {
        const result = await resetPassword(token, newPassword)
        if (result) {
          setSuccessMessage("Your password has been successfully reset.")
          setTimeout(() => {
            router.push("/login")
          }, 1500)
        } else {
          setError('error')
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-zinc-900 text-zinc-100 flex items-center justify-center p-4 pixel-grid font-ps2">
      <Card className="w-full max-w-md bg-zinc-800 border-4 border-zinc-700 rounded-none pixel-container">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-emerald-500 pixel-icon" />
              <span className="text-xl">Steprun.ai</span>
            </Link>
          </div>
          <CardTitle className="text-base text-center">{token ? "Set New Password" : "Reset Password"}</CardTitle>
          <CardDescription className="text-zinc-400 text-center !text-xs">
            {token
              ? "Enter your new password below."
              : "Enter your email to receive a password reset link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!token ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">Email</Label>
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
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-base">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-700 font-mono"
                  />
                </div>
              </>
            )}

            {error && <div className="bg-red-500/20 text-red-500 p-3 rounded-md">{error}</div>}
            {successMessage && (
              <div className="bg-emerald-500/20 text-emerald-500 p-3 rounded-md">{successMessage}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-6 pixel-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : token ? "Reset Password" : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full text-zinc-400 text-xs">
            {!token ? (
              <>
                Remembered your password?{" "}
                <Link href="/login" className="hover:text-emerald-500 underline underline-offset-4">
                  Back to Sign In
                </Link>
              </>
            ) : null}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}