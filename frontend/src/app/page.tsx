import Link from "next/link"
import { Code, Terminal, Server, Github, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelStar, PixelCursor, PixelRobot, PixelCode } from "@/components/pixel-decorations"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div>
      {/* Pixel Art Decorations */}
      <div className="fixed top-20 left-10 opacity-30 z-0">
        <PixelStar className="pixel-pulse" />
      </div>
      <div className="fixed top-40 right-20 opacity-30 z-0">
        <PixelStar className="pixel-pulse" />
      </div>
      <div className="fixed bottom-20 left-40 opacity-30 z-0">
        <PixelStar className="pixel-pulse" />
      </div>
      <div className="fixed top-60 left-[30%] opacity-30 z-0">
        <PixelStar className="pixel-pulse" />
      </div>



      {/* Hero Section */}
      <section className="container mx-auto py-24 px-4 relative">
        <div className="absolute top-10 left-10 opacity-50 z-0">
          <PixelRobot />
        </div>
        <div className="absolute top-40 right-10 opacity-50 z-0">
          <PixelCode />
        </div>
        <div className="absolute bottom-10 left-[40%] opacity-50 z-0">
          <PixelCursor />
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight special-title font-pixelRounded">
            Run a Step then Generate <span className="text-emerald-500 text-2xl">CoT for code</span>
          </h1>
          <p className="text-lg text-zinc-400 pixel-text">
            Steprun.ai is a Secure REPL Sandbox Runtime Environment for Agentic & AI use cases
          </p>
          <div className="pt-6">
            <Link href="/profile">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg pixel-button">
                <span className="pixel-text">Get API Key</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* API Overview */}
      <section id="api" className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 pixel-text">Core API Endpoints</h2>
        <div className="max-w-4xl mx-auto bg-zinc-950 rounded-none border-4 border-zinc-800 overflow-hidden pixel-container">
          <div className="bg-zinc-800 px-4 py-2 flex items-center gap-2">
            <Code className="h-4 w-4 text-emerald-500 pixel-icon" />
            <span className="text-sm pixel-text">API Reference</span>
          </div>
          <div className="p-6 space-y-6 text-sm md:text-base">
            <div className="border-b-4 border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1 text-xs pixel-text">POST</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text text-xs">Create a new sandbox session</p>
            </div>

            <div className="border-b-4 border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-500/20 text-red-500 px-2 py-1 text-xs pixel-text">DELETE</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions/{"{session_id}"}</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text text-xs">Destroy an existing session</p>
            </div>

            <div className="border-b-4 border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1 text-xs pixel-text">POST</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions/{"{session_id}"}/exec</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text text-xs">Execute code in the sandbox environment</p>
            </div>

            <div className="border-b-4 border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1 text-xs pixel-text">POST</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions/{"{session_id}"}/packages</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text text-xs">Install packages in the sandbox environment</p>
            </div>

            <div className="border-b-4 border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1 text-xs pixel-text">POST</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions/{"{session_id}"}/hibernate</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text text-xs">Hibernate a session to save resources</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1 text-xs pixel-text">POST</span>
                <code className="text-zinc-300 pixel-text">/api/v1/sessions/{"{session_id}"}/restore</code>
              </div>
              <p className="text-zinc-400 pl-12 pixel-text text-xs">Restore a previously hibernated session</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto py-24 px-4">
        <h2 className="text-3xl font-bold text-center mb-16 pixel-text">Core Advantages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-8">
          <div className="bg-zinc-900 p-6 border-4 border-zinc-800 flex flex-col items-center text-center pixel-container">
            <div className="h-16 w-16 bg-emerald-900/30 flex items-center justify-center mb-6">
              <Code className="h-8 w-8 text-emerald-500 pixel-icon" />
            </div>
            <h3 className="text-xl font-bold mb-4 pixel-text">Escape if-else hell</h3>
            <p className="text-zinc-400 pixel-text text-xs">
              Focus on the current execution path only, skipping exponential branching complexity.
            </p>
          </div>
          <div className="bg-zinc-900 p-6 border-4 border-zinc-800 flex flex-col items-center text-center pixel-container">
            <div className="h-16 w-16 bg-emerald-900/30 flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-emerald-500 pixel-icon" />
            </div>
            <h3 className="text-xl font-bold mb-4 pixel-text">Debug line by line</h3>
            <p className="text-zinc-400 pixel-text text-xs">
              Catch and fix errors instantly–line by line, no post-hoc tracing.
            </p>
          </div>
          <div className="bg-zinc-900 p-6 border-4 border-zinc-800 flex flex-col items-center text-center pixel-container">
            <div className="h-16 w-16 bg-emerald-900/30 flex items-center justify-center mb-6">
              <Code className="h-8 w-8 text-emerald-500 pixel-icon" />
            </div>
            <h3 className="text-xl font-bold mb-4 pixel-text">Declare now, implement later</h3>
            <p className="text-zinc-400 pixel-text text-xs">
              Define function stubs first, fill logic only when called (like human iterative coding).
            </p>
          </div>
          <div className="bg-zinc-900 p-6 border-4 border-zinc-800 flex flex-col items-center text-center pixel-container">
            <div className="h-16 w-16 bg-emerald-900/30 flex items-center justify-center mb-6">
              <Server className="h-8 w-8 text-emerald-500 pixel-icon" />
            </div>
            <h3 className="text-xl font-bold mb-4 pixel-text">Hibernate & restore</h3>
            <p className="text-zinc-400 pixel-text text-xs">
              Persist sessions mid-execution, ideal for long-running processes and iterative workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto py-24 px-4 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 pixel-text">API in Action</h2>
          <div className="bg-zinc-900 border-4 border-zinc-800 overflow-hidden pixel-container">
            <div className="border-b-4 border-zinc-800 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-500 pixel-icon" />
                <span className="font-medium pixel-text text-sm">API Request Examples</span>
              </div>
              <div className="flex gap-2">
                <div className="h-4 w-4 bg-red-500"></div>
                <div className="h-4 w-4 bg-yellow-500"></div>
                <div className="h-4 w-4 bg-green-500"></div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 pixel-text">1. Create a Session</h3>
                <pre className="bg-zinc-950 p-3 border-2 border-zinc-800 text-xs md:text-sm overflow-x-auto">
                  {`// Request
POST /api/v1/sessions
Content-Type: application/json

{
  "runtime": "python3.9"
}

// Response
{
  "session_id": "sess_abc123xyz",
  "status": "ready",
  "runtime": "python3.9",
  "created_at": "2023-05-15T15:30:45Z"
}`}
                </pre>
              </div>

              {/* Execute Code */}
              <div>
                <h3 className="text-lg font-semibold mb-2 pixel-text">2. Execute Code</h3>
                <pre className="bg-zinc-950 p-3 border-2 border-zinc-800 text-xs md:text-sm overflow-x-auto">
                  {`// Request
POST /api/v1/sessions/sess_abc123xyz/exec
Content-Type: application/json

{
  "code": "def find_primes(n):\\n    if n < 2:\\n        return []\\n    return [x for x in range(2, n+1) if all(x % y != 0 for y in range(2, int(x**0.5) + 1))]\\n\\nprint(find_primes(20))"
}

// Response
{
  "status": "success",
  "output": "[2, 3, 5, 7, 11, 13, 17, 19]",
  "execution_time": 0.0045
}`}
                </pre>
              </div>

              {/* Install Package */}
              <div>
                <h3 className="text-lg font-semibold mb-2 pixel-text">3. Install Package</h3>
                <pre className="bg-zinc-950 p-3 border-2 border-zinc-800 text-xs md:text-sm overflow-x-auto">
                  {`// Request
POST /api/v1/sessions/sess_abc123xyz/packages
Content-Type: application/json

{
  "packages": ["numpy", "pandas==1.4.2"]
}

// Response
{
  "status": "success",
  "installed": [
    {"name": "numpy", "version": "1.23.5"},
    {"name": "pandas", "version": "1.4.2"}
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="container mx-auto py-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold pixel-text">Perfect for AI Platforms & Tools</h2>
          <p className="text-lg text-zinc-400 pixel-text">
            Our sandbox runtime provides the execution environment that AI platforms need
          </p>
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            <div className="bg-zinc-800/50 p-6 border-4 border-zinc-700 pixel-container">
              <h3 className="text-xl font-bold mb-4 pixel-text">For AI Platforms</h3>
              <p className="text-zinc-400 mb-4 pixel-text text-xs">
                Integrate our sandbox API to safely execute code generated by your AI models
              </p>
              <ul className="text-left space-y-2 text-zinc-300">
                <li className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text text-xs">Secure execution of AI-generated code</span>
                </li>
                <li className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text text-xs">Step-by-step validation and debugging</span>
                </li>
                <li className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text text-xs">Isolated environments for each user</span>
                </li>
              </ul>
            </div>
            <div className="bg-zinc-800/50 p-6 border-4 border-zinc-700 pixel-container">
              <h3 className="text-xl font-bold mb-4 pixel-text">For Developers</h3>
              <p className="text-zinc-400 mb-4 pixel-text text-xs">
                Build interactive coding tutorials or educational platforms
              </p>
              <ul className="text-left space-y-2 text-zinc-300">
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text text-xs">Interactive code examples in documentation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text text-xs">Educational platforms with live code execution</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-emerald-500 flex-shrink-0 pixel-icon" />
                  <span className="pixel-text text-xs">Collaborative coding environments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold pixel-text">Ready to Power Your Applications?</h2>
          <p className="text-lg text-zinc-400 pixel-text">Get started with our sandbox runtime API today</p>
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg pixel-button">
                <span className="pixel-text">Get API Access</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-6 text-lg pixel-button"
            >
              <span className="pixel-text">View API Docs</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-zinc-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-500 pixel-icon" />
              <span className="font-bold pixel-text">𑢡tepRun.ai</span>
            </div>
            <div className="text-zinc-500 text-sm pixel-text">
              © {new Date().getFullYear()} 𑢡tepRun.ai. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-zinc-400 hover:text-emerald-500">
                <Github className="h-5 w-5 pixel-icon" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-emerald-500 pixel-text">
                Terms
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-emerald-500 pixel-text">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
