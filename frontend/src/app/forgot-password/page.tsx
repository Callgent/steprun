"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // This should call the actual password reset API
      // Example: await api.auth.requestPasswordReset(email)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
    } catch (err) {
      setError("Failed to send reset link. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-mono flex items-center justify-center p-4 pixel-grid">
      <Card className="w-full max-w-md bg-zinc-800 border-4 border-zinc-700 rounded-none pixel-container">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-emerald-500 pixel-icon" />
              <span className="font-bold text-xs pixel-text">Steprun.ai</span>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center pixel-text">Reset Password</CardTitle>
          <CardDescription className="text-zinc-400 text-center pixel-text">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="pixel-text">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-700 pixel-text"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 text-red-500 p-3 rounded-md  pixel-text">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-6 pixel-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-emerald-500/20 text-emerald-500 p-4 rounded-md pixel-text">
                A reset link has been sent to your email. Please check your inbox and follow the instructions.
              </div>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-700 pixel-button"
              >
                Resend Link
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-center w-full  text-zinc-400 pixel-text">
            Remembered your password?{" "}
            <Link href="/login" className="hover:text-emerald-500 underline underline-offset-4">
              Back to Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}