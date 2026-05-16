export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50 px-10">

      {/* CENTER CONTAINER (app consistent) */}
      <div className="w-full max-w-[1600px] mx-auto">

        {/* HERO */}
        <section className="py-24">

          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
            Stable Diffusion + ControlNet
          </div>

          <h1 className="mt-8 text-6xl font-bold tracking-tight text-zinc-900">
            AI Image
            <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
              {" "}Generation Studio
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Generate high-quality AI artwork using Stable Diffusion and ControlNet.
            Upload reference images, guide generation pipelines, and manage workflows.
          </p>

          <div className="mt-10 flex gap-4">
            <a
              href="/generate"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-500 px-7 py-4 font-medium text-white shadow-lg transition hover:scale-[1.02]"
            >
              Start Generating
            </a>

            <a
              href="/gallery"
              className="rounded-2xl border border-zinc-300 bg-white px-7 py-4 font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              View Gallery
            </a>
          </div>

        </section>

        {/* FEATURES */}
        <section className="grid gap-6 pb-16 md:grid-cols-3">

          {[
            {
              icon: "🎨",
              title: "Stable Diffusion 1.5",
              desc: "Generate detailed AI images using prompts and parameters."
            },
            {
              icon: "🧠",
              title: "ControlNet Pipelines",
              desc: "Guide generation with Canny, Depth, Pose, Scribble models."
            },
            {
              icon: "⚡",
              title: "Async AI Workflows",
              desc: "Track realtime generation with scalable workers."
            }
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 text-4xl">{f.icon}</div>

              <h2 className="text-xl font-semibold text-zinc-900">
                {f.title}
              </h2>

              <p className="mt-3 leading-7 text-zinc-600">
                {f.desc}
              </p>
            </div>
          ))}

        </section>

      </div>
    </div>
  )
}