"use client"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50 p-6">
      
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800">
          Stable Diffusion Image Generator
        </h1>
        <p className="text-sm text-zinc-500">
          Generate images using txt2img / img2img + ControlNet
        </p>
      </div>

      {/* ONLY ONE GRID LAYER */}
      <div className="grid grid-cols-12 gap-10 w-full items-stretch">
        {children}
      </div>

    </div>
  )
}