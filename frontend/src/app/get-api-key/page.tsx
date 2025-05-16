"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, Copy, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function GetApiKeyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not logged in
      router.push(`/login?returnTo=${encodeURIComponent("/get-api-key")}`)
    } else if (!loading && user && !apiKey) {
      // Generate API key if logged in
      generateApiKey()
    }
  }, [loading, user, router, apiKey])

  const generateApiKey = async () => {
    setGenerating(true)
    // Simulate API call to generate key
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a random API key
    const key = "sk_" + Array.from({ length: 24 }, () => Math.floor(Math.random() * 36).toString(36)).join("")

    setApiKey(key)
    setGenerating(false)
  }

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="text-center">
          <Terminal className="h-10 w-10 text-emerald-500 mx-auto animate-pulse" />
          <p className="mt-4 text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4 pixel-grid">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">StepRun.ai</span>
          </Link>
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-2xl">Your API Key</CardTitle>
              <CardDescription>Use this key to authenticate your requests to the StepRun.ai API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {apiKey ? (
                <div className="bg-zinc-900 p-4 rounded-md flex items-center justify-between">
                  <code className="text-emerald-500 font-mono text-sm break-all">{apiKey}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    className="text-zinc-400 hover:text-emerald-500"
                  >
                    {copied ? <span className="text-emerald-500 text-xs">Copied!</span> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ) : (
                <div className="bg-zinc-900 p-4 rounded-md flex items-center justify-center h-16">
                  <Terminal className="h-6 w-6 text-emerald-500 animate-pulse" />
                </div>
              )}

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-md">
                <h3 className="text-amber-500 font-medium mb-2">Important</h3>
                <p className="text-zinc-300 text-sm">
                  Keep your API key secure. Do not share it in publicly accessible areas such as GitHub, client-side
                  code, or forums.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-zinc-200">Quick Start</h3>
                <div className="bg-zinc-900 p-3 rounded-md">
                  <pre className="text-xs overflow-x-auto text-zinc-300">
                    {`curl -X POST https://api.steprun.ai/v1/sessions \\
  -H "Authorization: Bearer ${apiKey || "YOUR_API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '{"runtime": "python3.9"}'`}
                  </pre>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                onClick={generateApiKey}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate Key
                  </>
                )}
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("/documentation")}>
                View Documentation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
