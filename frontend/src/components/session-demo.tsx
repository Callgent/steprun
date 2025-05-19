"use client"

import { useEffect, useState } from "react"
import { useSessionStore } from "@/lib/store/session-store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, Play } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function SessionDemo() {
  const { currentSession, executionResult, isLoading, error, createSession, setCurrentSession, executeCode } =
    useSessionStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [code, setCode] = useState('print("Hello, 𑢡teprun.ai!")')

  const handleCreateSession = async () => {
    try {
      const { session_id } = await createSession("python3.9")
      router.push(`/session?session_id=${encodeURIComponent(session_id)}`)
    } catch (error) {
      console.error("Failed to create session:", error)
    }
  }

  const handleExecuteCode = async () => {
    if (!currentSession || !code.trim()) return
    try {
      await executeCode(code)
    } catch (error) {
      console.error("Failed to execute code:", error)
    }
  }
  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (sessionId) {
      setCurrentSession({ session_id: sessionId })
    }
  }, [])
  return (
    <Card className="w-full bg-zinc-800 border-zinc-700 z-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-emerald-500" />
          Interactive Code Execution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentSession ? (
          <div className="text-center py-8">
            <Terminal className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Session</h3>
            <p className="text-zinc-400 mb-4">Create a new session to start executing code.</p>
            <Button onClick={handleCreateSession} className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Python Session"}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400">Session ID:</span>
                <code className="ml-2 text-xs bg-zinc-900 px-2 py-1 rounded">{currentSession.session_id}</code>
              </div>
            </div>

            <div className="space-y-2">
              <label className=" text-zinc-400">Code:</label>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono  bg-zinc-900 border-zinc-700 min-h-[150px]"
                placeholder="Enter your Python code here..."
              />
            </div>

            {error && <div className="bg-red-500/20 text-red-500 p-3 rounded-md ">{error}</div>}

            {executionResult && (
              <div className="space-y-2">
                <label className=" text-zinc-400">Output:</label>
                <div className="bg-zinc-900 p-3 rounded-md font-mono  whitespace-pre-wrap">
                  {executionResult.result}
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Status: {executionResult?.status}</span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      {currentSession && (
        <CardFooter>
          <Button
            onClick={handleExecuteCode}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              "Executing..."
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Execute Code
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
