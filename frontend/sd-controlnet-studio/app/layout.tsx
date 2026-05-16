import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SD ControlNet Studio",
  description: "AI image generation platform powered by Stable Diffusion and ControlNet",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100">
        <div className="flex h-screen">

          {/* Sidebar */}
          <aside className="w-64 border-r border-zinc-200 bg-white/80 backdrop-blur-xl shadow-sm">
            <div className="p-6">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                SD Studio
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Stable Diffusion + ControlNet
              </p>
            </div>

            <nav className="px-3">
              <ul className="space-y-2">

                <li>
                  <a
                    href="/"
                    className="block rounded-lg px-4 py-3 text-zinc-700 transition
                     hover:bg-blue-50 hover:text-blue-600"
                  >
                    Home
                  </a>
                </li>

                <li>
                  <a
                    href="/generate"
                    className="block rounded-lg px-4 py-3 text-zinc-700 transition
                     hover:bg-blue-50 hover:text-blue-600"
                  >
                    Generate
                  </a>
                </li>

                <li>
                  <a
                    href="/gallery"
                    className="block rounded-lg px-4 py-3 text-zinc-700 transition
                     hover:bg-blue-50 hover:text-blue-600"
                  >
                    Gallery
                  </a>
                </li>

              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="w-full min-h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}