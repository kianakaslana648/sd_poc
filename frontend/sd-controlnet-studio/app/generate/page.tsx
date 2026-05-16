"use client"

import { useState } from "react"
import { generateImage, waitForTask } from "@/lib/api"
import { ControlNetMode } from "@/lib/api"
import ImageDropzone from "@/components/ImageDropzone"
import PromptBox from "@/components/PromptBox"


type Mode = "txt2img" | "img2img"

const modeLabel: Record<Mode, string> = {
  txt2img: "Direct Text Input",
  img2img: "With Reference Image",
}

export default function Page() {
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [mode, setMode] = useState<Mode>("txt2img")
  const [controlNet, setControlNet] = useState<{
    type: ControlNetMode
    image: File | null
    preview: string | null
  }>({
    type: "canny",
    image: null,
    preview: null,
  })

  const [inputImage, setInputImage] = useState<string | null>(null)
  const [steps, setSteps] = useState(30)

  const [loading, setLoading] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null)

  const hasImageMode = mode === "img2img"

  const handleGenerate = async () => {
    setLoading(true)
    setImage(null)

    try {
      const res = await generateImage({
        prompt,
        negative_prompt: negativePrompt,
        mode,
        controlnet: hasImageMode ? controlNet : undefined,
        steps,
      })

      setTaskId(res.task_id)

      const result = await waitForTask(res.task_id)
      setImage(result.result_url || null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ================= LEFT PANEL ================= */}
      <aside className="col-span-4 min-w-[320px]">
        <div className="h-full rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-xl p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Parameter Panel
            </h2>
            <p className="text-xs text-zinc-500">
              {hasImageMode ? "With Reference Image" : "Text-only generation"}
            </p>
          </div>

          <div className="space-y-6">

            {/* MODE */}
            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-700">
                Generation Mode
              </label>

              <div className="grid grid-cols-2 gap-3">
                {(["txt2img", "img2img"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`
                    rounded-2xl border px-4 py-4 text-left transition-colors duration-200

                    hover:border-blue-400 hover:bg-blue-50

                    ${mode === m
                        ? "border-blue-500 bg-blue-50"
                        : "border-zinc-200 bg-white"
                    }
                    `}
                  >
                    <div className="text-sm font-medium text-zinc-800">
                      {modeLabel[m]}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {m === "txt2img" ? "Prompt only" : "Image + prompt"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* IMAGE DROPZONE (REPLACED HERE) */}
            {hasImageMode && (
              <div>
                <label className="mb-2 block text-sm text-zinc-700">
                  Reference Image
                </label>
                  <ImageDropzone
                    value={controlNet.preview}
                    onChange={(file, previewUrl) => {
                      setControlNet((prev) => ({
                        ...prev,
                        image: file,
                        preview: previewUrl
                      }))
                    }}
                  />
              </div>
            )}

            {/* PROMPT */}
            <div>
              <PromptBox
                label="Prompt"
                value={prompt}
                onChange={setPrompt}
                placeholder="Describe what you want to generate..."
                />
            </div>

            {/* NEGATIVE */}
            <div>
              <PromptBox
  label="Negative Prompt"
  value={negativePrompt}
  onChange={setNegativePrompt}
  placeholder="blurry, low quality, distorted..."
  rows={3}
/>
            </div>

            {/* CONTROLNET */}
            {hasImageMode && (
              <div>
                <label className="mb-3 block text-sm text-zinc-700">
                  ControlNet
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {(["canny", "depth", "pose", "scribble"] as ControlNetMode[]).map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        setControlNet((prev) => ({
                          ...prev,
                          type: c,
                        }))
                      }
                      className={`
                        rounded-xl border px-3 py-2 text-sm transition-colors duration-200

                        hover:border-blue-400 hover:bg-blue-50

                        ${
                          controlNet.type === c
                            ? "border-blue-500 bg-blue-50"
                            : "border-zinc-200 bg-white"
                        }
                      `}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEPS */}
            <div>
              <label className="text-sm text-zinc-500">
                Steps: {steps}
              </label>

              <input
                type="range"
                min={10}
                max={50}
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* GENERATE */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="
  w-full rounded-2xl
  bg-gradient-to-r from-blue-600 to-violet-500
  px-6 py-4 text-white
  transition-colors duration-200

  hover:from-blue-700 hover:to-violet-600
  disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-violet-500
"
            >
              {loading ? "Generating..." : "Generate Image"}
            </button>

          </div>
        </div>
      </aside>

      {/* ================= RIGHT PANEL ================= */}
      <section className="col-span-8 min-w-0">
        <div className="h-full rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-xl p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Preview Panel
            </h2>
            <p className="text-xs text-zinc-500">
              Generated output
            </p>
          </div>

          <div className="w-full h-[70vh]">

            {image ? (
              <img
                src={image}
                className="w-full h-full object-contain rounded-2xl shadow-xl"
              />
            ) : loading ? (
              <div className="h-full flex items-center justify-center text-zinc-500">
                <div className="text-center">
                  Generating...
                  {taskId && (
                    <div className="mt-2 text-xs">Task: {taskId}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-7xl">🖼️</div>
                  <p className="mt-4 text-zinc-500">
                    Generated image will appear here
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  )
}