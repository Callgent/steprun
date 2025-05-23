import { SessionDemo } from "@/components/session/demo"
import { Suspense } from "react"

export default function DemoPage() {
  return (
    <div className="font-mono p-4 ">
      <div className="container mx-auto py-8 ">
        <h1 className="!text-2xl font-ps2 mb-8 text-center">Interactive Code Execution</h1>
        <div className="max-w-4xl mx-auto ">
          <Suspense>
            <SessionDemo />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
