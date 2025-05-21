"use client"

import { useEffect, useState } from "react"
import { useSessionStore } from "@/lib/store/session-store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, Play } from "lucide-react"
import { useSearchParams } from "next/navigation"

export function SessionDemo() {
  const { currentSession, executionResult, isLoading, setCurrentSession, executeCode } =
    useSessionStore()
  const searchParams = useSearchParams()
  const [code, setCode] = useState('print("Hello, 𑢡teprun.ai!")')

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
    <Card
      className="w-full bg-zinc-800 border-zinc-700 z-10 font-ps2"
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center text-lg">
            <Terminal className="h-5 w-5 text-emerald-500 mr-2" />
            <span>Interactive Code Execution</span>
          </div>
          <Button
            onClick={handleExecuteCode}
            className="bg-emerald-600 hover:bg-emerald-700 p-2 rounded !text-base flex items-center"
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              "Executing..."
            ) : (
              <>
                <Play className="h-6 w-6" />
                <span className="">Execute</span>
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-zinc-400">Session ID:</span>
            <span className="ml-2 bg-zinc-900 px-2 py-1 rounded">{currentSession?.session_id}</span>
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
        {executionResult?.stdout && (
          <div className="space-y-2">
            <label className=" text-zinc-400">Output:</label>
            <div className="bg-zinc-900 p-3 rounded-md font-mono  whitespace-pre-wrap">
              {executionResult.stdout}
            </div>
          </div>
        )}
        {executionResult?.stderr && (
          <pre className="bg-red-950/40 text-red-400 p-3 rounded-md overflow-x-auto whitespace-pre-wrap font-mono text-sm">
            {executionResult.stderr}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}
