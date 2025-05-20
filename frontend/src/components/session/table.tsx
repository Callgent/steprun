"use client"
import { KeyRound } from "lucide-react"
import { useEffect } from "react"
import { useSessionStore } from "@/lib/store/session-store"
import { Button } from "@/components/ui/button"
import { Terminal } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { SessionStatus } from "@/lib/types/session"
import { Card, CardHeader, CardTitle } from "../ui/card"

export function SessionTable() {
    const { isLoading, createSession, getSession, sessions } = useSessionStore()
    const router = useRouter()

    const handleCreateSession = async () => {
        try {
            const { session_id } = await createSession("python3.9")
            router.push(`/session?session_id=${encodeURIComponent(session_id)}`)
        } catch (error) {
            console.error("Failed to create session:", error)
        }
    }

    const handleSessionClick = (session_id: string) => {
        router.push(`/session?session_id=${encodeURIComponent(session_id)}`)
    }

    useEffect(() => {
        getSession()
    }, [])

    return (
        <div className="">
            {sessions.length === 0 && (
                <Card className="w-full bg-zinc-800 border-zinc-700 z-10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-emerald-500" />
                            Interactive Code Execution
                        </CardTitle>
                    </CardHeader>
                    <div className="text-center py-8">
                        <Terminal className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Active Session</h3>
                        <p className="text-zinc-400 mb-4">Create a new session to start executing code.</p>
                        <Button
                            onClick={handleCreateSession}
                            className="bg-emerald-600 hover:bg-emerald-700 rounded-[5px]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create Python Session"}
                        </Button>
                    </div>
                </Card>
            )}

            {sessions.length > 0 && (
                <div className="bg-grid-small-white/[0.2] text-white font-mono overflow-hidden">
                    <div className="border border-white/20 p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className=" text-3xl font-sans">Session List</h3>
                            <Button onClick={handleCreateSession} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 pixel-button">
                                <span className="font-sans">+ New</span>
                            </Button>
                        </div>

                        {sessions.length > 0 ? (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {sessions.map((session) => (
                                    <div
                                        key={session.session_id}
                                        className="border border-white/20 p-4 grid grid-cols-12 gap-4 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="col-span-4 ">
                                            <div className="text-gray-400 mb-1 font-sans">Session ID</div>
                                            <div
                                                className="font-medium truncate cursor-pointer text-emerald-500"
                                                onClick={() => handleSessionClick(session.session_id)}>
                                                {session.session_id}
                                            </div>
                                        </div>
                                        <div className="col-span-3 ">
                                            <div className="text-gray-400 mb-1 font-sans">Created</div>
                                            <div>{formatDate(session.created_at)}</div>
                                        </div>
                                        <div className="col-span-3 ">
                                            <div className="text-gray-400 mb-1 font-sans">Expires</div>
                                            <div>{formatDate(session.expires_at)}</div>
                                        </div>
                                        <div className="col-span-2 ">
                                            <div className="text-gray-400 mb-1 font-sans">Status</div>
                                            <div
                                                className={`
                                                        ${session.status === SessionStatus.STARTED ? "text-green-400" : ""}
                                                        ${session.status === SessionStatus.STOPPED ? "text-yellow-400" : ""}
                                                        ${session.status === SessionStatus.HIBERNATED ? "text-blue-400" : ""}
                                                        ${session.status === SessionStatus.DESTROYED ? "text-red-400" : ""}
                                                    `}
                                            >
                                                {session.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <KeyRound className="h-16 w-16 text-gray-500 mb-4" />
                                <h4 className="text-xl mb-2 ">No Sessions</h4>
                                <p className="text-gray-400 mb-6 ">You haven't created any sessions yet.</p>
                                <button className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 transition-colors ">
                                    Create your first session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}