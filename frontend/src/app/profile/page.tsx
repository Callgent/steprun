"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, Copy, Trash2, Plus, LogOut, Key } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ApiKey } from "@/lib/types/auth"
import DemoPage from "../sessions/page"
import Link from "next/link"

export default function ProfilePage() {
    const { user, apiKeys, isLoading, error, addApiKey, deleteApiKey } = useAuthStore()
    const router = useRouter()
    const [newKeyName, setNewKeyName] = useState("")
    const [copied, setCopied] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newKey, setNewKey] = useState<ApiKey | null>(null)

    useEffect(() => {
        const auth_token = localStorage.getItem('auth_token');
        if (!auth_token && !isLoading) {
            router.push("/login?returnTo=/profile")
        }
    }, [user, isLoading, router])

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) return

        try {
            const key = await addApiKey(newKeyName)
            setNewKey(key)
            setNewKeyName("")
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Failed to create API key:", error)
        }
    }

    const copyToClipboard = (key: string, id: string) => {
        navigator.clipboard.writeText(key)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-900 pixel-grid">
                <div className="text-center">
                    <Terminal className="h-10 w-10 text-emerald-500 mx-auto animate-pulse pixel-icon" />
                    <p className="mt-4 text-zinc-400 ">Loading...</p>
                </div>
            </div>
        )
    }

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth-storage');
        router.push('/')
    }
    return (
        <div className="container mx-auto py-8">
            <div className="mx-auto">
                <div className="mb-8">
                    <h1 className="!text-3xl mb-2 font-ps2">Profile</h1>
                    <p className="text-zinc-400 font-ps2">Manage your account and API keys</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <Card className="bg-zinc-800 border-zinc-700 col-span-3 md:col-span-1 pixel-container">
                        <CardHeader>
                            <CardTitle className="font-ps2 !text-xl">Account Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-zinc-400 font-ps2">Username</Label>
                                    <p className="font-medium font-mono">{user.full_name}</p>
                                </div>
                                <div>
                                    <Label className="text-zinc-400 font-ps2">Email</Label>
                                    <p className="font-medium font-mono">{user.email}</p>
                                </div>
                                <div>
                                    <Label className="text-zinc-400 font-ps2">API Keys</Label>
                                    <p className="font-medium font-mono">{apiKeys.length}</p>
                                </div>
                                <div>
                                    <Label className="text-zinc-400 font-ps2">Sessions</Label>
                                    <Link href='/sessions' className="font-ps2 text-emerald-500">
                                        <p className="font-medium text-sm font-mono mt-2">Start your session</p>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-800 border-zinc-700 col-span-3 md:col-span-2 pixel-container z-10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-ps2 !text-xl">API Keys</CardTitle>
                                <CardDescription className="font-ps2">Manage your API keys</CardDescription>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 pixel-button font-ps2">
                                        <Plus className="h-4 w-4 mr-2 " />
                                        <span>New Key</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-zinc-800 border-zinc-700 pixel-container text-white font-mono">
                                    <DialogHeader>
                                        <DialogTitle className="!text-xl font-ps2">Create New API Key</DialogTitle>
                                        <DialogDescription className="!text-base">
                                            Give your API key a name to help you identify it later.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="key-name" className="font-ps2">
                                                Key Name
                                            </Label>
                                            <Input
                                                id="key-name"
                                                placeholder="e.g. Development, Production"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                                className="bg-zinc-900 border-zinc-700  font-mono"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(false)}
                                            className="pixel-button border-4 border-zinc-700"
                                        >
                                            <span className="font-ps2">Cancel</span>
                                        </Button>
                                        <Button
                                            onClick={handleCreateKey}
                                            className="bg-emerald-600 hover:bg-emerald-700 pixel-button font-ps2"
                                            disabled={isLoading}
                                        >
                                            <span className="">{isLoading ? "Creating..." : "Create Key"}</span>
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {apiKeys.length === 0 ? (
                                <div className="text-center py-8">
                                    <Key className="h-12 w-12 text-zinc-600 mx-auto mb-4 pixel-icon" />
                                    <h3 className="text-base font-medium mb-2 font-ps2">No API Keys</h3>
                                    <p className="text-zinc-400 mb-4 font-ps2 text-xs">You haven't created any API keys yet.</p>
                                    <Button
                                        onClick={() => setIsDialogOpen(true)}
                                        className="bg-emerald-600 hover:bg-emerald-700 pixel-button"
                                    >
                                        <span className="text-sm font-ps2">Create your first API key</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[300px] overflow-auto">
                                    {apiKeys.map((apiKey) => (
                                        <div
                                            key={apiKey.api_key}
                                            className="bg-zinc-900 p-4 rounded-md border-4 border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-4 pixel-container"
                                        >
                                            <div className="space-y-1 flex-grow">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium font-ps2">{apiKey.name || 'my_key'}</h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-zinc-400 text-xs ">
                                                        {apiKey.api_key.substring(0, 8)}...{apiKey.api_key.substring(apiKey.api_key.length - 4)}
                                                    </code>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => copyToClipboard(apiKey.api_key, apiKey.api_key)}
                                                    >
                                                        {copied === apiKey.api_key ? (
                                                            <span className="text-emerald-500 text-xs  ml-8">Copied!</span>
                                                        ) : (
                                                            <Copy className="h-3 w-3 text-zinc-400 pixel-icon" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500">
                                                            <Trash2 className="h-4 w-4 pixel-icon" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-zinc-800 border-zinc-700 pixel-container">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="">Delete API Key</AlertDialogTitle>
                                                            <AlertDialogDescription className="">
                                                                Are you sure you want to delete this API key? This action cannot be undone and any
                                                                applications using this key will stop working immediately.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-zinc-700 hover:bg-zinc-600 pixel-button">
                                                                <span className="">Cancel</span>
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700 pixel-button"
                                                                onClick={() => deleteApiKey(apiKey.api_key)}
                                                            >
                                                                <span className="">Delete</span>
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-amber-500/10 border-4 border-amber-500/20 p-4 rounded-md pixel-container !text-xs">
                    <h3 className="text-amber-500 font-medium mb-2 font-ps2 !text-xl">Important Security Information</h3>
                    <p className="text-zinc-300 mb-2 font-ps2">
                        Keep your API keys secure. Do not share them in publicly accessible areas such as GitHub, client-side
                        code, or forums.
                    </p>
                    <p className="text-zinc-300 font-ps2">
                        If you believe an API key has been compromised, delete it immediately and create a new one.
                    </p>
                </div>
            </div>
            <div className="w-full flex gap-4 justify-end mt-10">
                <Button
                    variant="ghost"
                    className="border-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800 pixel-button"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4 mr-2 pixel-icon" />
                    <span className="font-ps2">Sign Out</span>
                </Button>
            </div>
        </div>
    )
}
