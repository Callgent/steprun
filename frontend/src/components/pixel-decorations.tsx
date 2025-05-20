export function PixelCloud({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute w-16 h-8 bg-white rounded-full" style={{ top: "0px", left: "8px" }}></div>
      <div className="absolute w-8 h-8 bg-white rounded-full" style={{ top: "0px", left: "0px" }}></div>
      <div className="absolute w-8 h-8 bg-white rounded-full" style={{ top: "0px", left: "24px" }}></div>
      <div className="absolute w-32 h-16 bg-white rounded-full" style={{ top: "8px", left: "0px" }}></div>
    </div>
  )
}

export function PixelTree({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-8 h-8 bg-emerald-700 absolute" style={{ top: "0px", left: "8px" }}></div>
      <div className="w-24 h-8 bg-emerald-700 absolute" style={{ top: "8px", left: "0px" }}></div>
      <div className="w-8 h-16 bg-yellow-800 absolute" style={{ top: "16px", left: "8px" }}></div>
    </div>
  )
}

export function PixelStar({ className = "" }: { className?: string }) {
  return <div className={`w-4 h-4 bg-yellow-300 ${className}`}></div>
}

export function PixelCursor({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className} pixel-float z-10`}>
      <div className="w-4 h-4 bg-white"></div>
      <div className="w-4 h-4 bg-white absolute" style={{ top: "4px", left: "4px" }}></div>
      <div className="w-4 h-4 bg-white absolute" style={{ top: "8px", left: "8px" }}></div>
      <div className="w-4 h-4 bg-white absolute" style={{ top: "12px", left: "12px" }}></div>
    </div>
  )
}

export function PixelRobot({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className} pixel-float`}>
      <div className="w-16 h-16 bg-zinc-700 relative">
        <div className="w-4 h-4 bg-emerald-500 absolute" style={{ top: "4px", left: "4px" }}></div>
        <div className="w-4 h-4 bg-emerald-500 absolute" style={{ top: "4px", left: "8px" }}></div>
        <div className="w-8 h-2 bg-zinc-900 absolute" style={{ top: "12px", left: "4px" }}></div>
      </div>
      <div className="w-8 h-8 bg-zinc-700 absolute" style={{ top: "16px", left: "4px" }}></div>
      <div className="w-4 h-8 bg-zinc-700 absolute" style={{ top: "16px", left: "0px" }}></div>
      <div className="w-4 h-8 bg-zinc-700 absolute" style={{ top: "16px", left: "12px" }}></div>
    </div>
  )
}

export function PixelCode({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className} pixel-float`}>
      <div className="w-32 h-24 bg-zinc-800 border-2 border-zinc-600 relative">
        <div className="w-full h-4 bg-zinc-900 flex items-center px-1">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <div className="pt-1 space-y-1 pl-1 pr-2">
          <div className="w-full h-2 bg-emerald-500 rounded"></div>
          <div className="w-full h-2 bg-purple-500 rounded"></div>
          <div className="w-full h-2 bg-blue-500 rounded"></div>
          <div className="w-full h-2 bg-emerald-500 rounded"></div>
        </div>
      </div>
    </div>
  )
}
