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
import { ApiKey } from "@/lib/types/api"

export default function ProfilePage() {
    const { user, apiKeys, isLoading, error, addApiKey, deleteApiKey } = useAuthStore()
    const router = useRouter()
    const [newKeyName, setNewKeyName] = useState("")
    const [copied, setCopied] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newKey, setNewKey] = useState<ApiKey | null>(null)

    // 如果用户未登录，重定向到登录页面
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
                    <p className="mt-4 text-zinc-400 pixel-text">Loading...</p>
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
            <div className=" mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2 pixel-text">Profile</h1>
                    <p className="text-zinc-400 pixel-text">Manage your account and API keys</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <Card className="bg-zinc-800 border-zinc-700 col-span-3 md:col-span-1 pixel-container">
                        <CardHeader>
                            <CardTitle className="pixel-text text-lg">Account Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-zinc-400 pixel-text">Username</Label>
                                    <p className="font-medium pixel-text">{user.full_name}</p>
                                </div>
                                <div>
                                    <Label className="text-zinc-400 pixel-text">Email</Label>
                                    <p className="font-medium pixel-text">{user.email}</p>
                                </div>
                                <div>
                                    <Label className="text-zinc-400 pixel-text">API Keys</Label>
                                    <p className="font-medium pixel-text">{apiKeys.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-800 border-zinc-700 col-span-3 md:col-span-2 pixel-container z-10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="pixel-text text-lg">API Keys</CardTitle>
                                <CardDescription className="pixel-text">Manage your API keys</CardDescription>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 pixel-button">
                                        <Plus className="h-4 w-4 mr-2 " />
                                        <span>New Key</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-zinc-800 border-zinc-700 pixel-container font-ps2 ">
                                    <DialogHeader>
                                        <DialogTitle className="pixel-text text-sm">Create New API Key</DialogTitle>
                                        <DialogDescription className="pixel-text text-xs">
                                            Give your API key a name to help you identify it later.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="key-name" className="pixel-text">
                                                Key Name
                                            </Label>
                                            <Input
                                                id="key-name"
                                                placeholder="e.g. Development, Production"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                                className="bg-zinc-900 border-zinc-700 pixel-text font-mono"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(false)}
                                            className="pixel-button border-4 border-zinc-700"
                                        >
                                            <span className="pixel-text">Cancel</span>
                                        </Button>
                                        <Button
                                            onClick={handleCreateKey}
                                            className="bg-emerald-600 hover:bg-emerald-700 pixel-button"
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
                                    <h3 className="text-sm font-medium mb-2 pixel-text">No API Keys</h3>
                                    <p className="text-zinc-400 mb-4 pixel-text text-xs">You haven't created any API keys yet.</p>
                                    <Button
                                        onClick={() => setIsDialogOpen(true)}
                                        className="bg-emerald-600 hover:bg-emerald-700 pixel-button"
                                    >
                                        <span className="text-xs">Create your first API key</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {apiKeys.map((apiKey) => (
                                        <div
                                            key={apiKey.api_key}
                                            className="bg-zinc-900 p-4 rounded-md border-4 border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-4 pixel-container"
                                        >
                                            <div className="space-y-1 flex-grow">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium pixel-text">{apiKey.name || 'my_key'}</h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-zinc-400 text-xs pixel-text">
                                                        {apiKey.api_key.substring(0, 8)}...{apiKey.api_key.substring(apiKey.api_key.length - 4)}
                                                    </code>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => copyToClipboard(apiKey.api_key, apiKey.api_key)}
                                                    >
                                                        {copied === apiKey.api_key ? (
                                                            <span className="text-emerald-500 text-xs pixel-text ml-8">Copied!</span>
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
                                                            <AlertDialogTitle className="pixel-text">Delete API Key</AlertDialogTitle>
                                                            <AlertDialogDescription className="pixel-text">
                                                                Are you sure you want to delete this API key? This action cannot be undone and any
                                                                applications using this key will stop working immediately.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-zinc-700 hover:bg-zinc-600 pixel-button">
                                                                <span className="pixel-text">Cancel</span>
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700 pixel-button"
                                                                onClick={() => deleteApiKey(apiKey.api_key)}
                                                            >
                                                                <span className="pixel-text">Delete</span>
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

                {newKey && (
                    <Card className="bg-zinc-800 border-zinc-700 mb-8 border-emerald-500/50 pixel-container">
                        <CardHeader>
                            <CardTitle className="text-emerald-500 pixel-text">New API Key Created</CardTitle>
                            <CardDescription className="pixel-text">
                                Make sure to copy your API key now. You won't be able to see it again!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-zinc-900 p-4 rounded-md flex items-center justify-between border-4 border-zinc-700">
                                <code className="text-emerald-500 break-all pixel-text">{newKey.api_key}</code>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyToClipboard(newKey.api_key, "new")}
                                    className="text-zinc-400 hover:text-emerald-500"
                                >
                                    {copied === "new" ? (
                                        <span className="text-emerald-500 text-xs pixel-text">Copied!</span>
                                    ) : (
                                        <Copy className="h-4 w-4 pixel-icon" />
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full border-emerald-500/50 text-emerald-500 pixel-button"
                                onClick={() => setNewKey(null)}
                            >
                                <span className="pixel-text">I've saved my API key</span>
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                <div className="bg-amber-500/10 border-4 border-amber-500/20 p-4 rounded-md pixel-container  text-xs">
                    <h3 className="text-amber-500 font-medium mb-2 pixel-text">Important Security Information</h3>
                    <p className="text-zinc-300  mb-2 pixel-text">
                        Keep your API keys secure. Do not share them in publicly accessible areas such as GitHub, client-side
                        code, or forums.
                    </p>
                    <p className="text-zinc-300  pixel-text">
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
                    <span className="pixel-text">Sign Out</span>
                </Button>
            </div>
        </div>
    )
}
