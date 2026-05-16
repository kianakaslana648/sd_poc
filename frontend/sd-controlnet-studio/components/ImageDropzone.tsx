"use client"

import { useRef, useState } from "react"

type Props = {
    value: string | null
    onChange: (file: File, previewUrl: string) => void
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]

export default function ImageDropzone({ value, onChange }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const validateFile = (file: File) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Only PNG, JPG, WEBP files are allowed"
        }
        return null
    }

    const handleFile = (file: File) => {
        const err = validateFile(file)
        if (err) {
            setError(err)
            return
        }

        setError(null)
        const url = URL.createObjectURL(file)
        onChange(file, url)
    }

    return (
        <div className={`
  cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center
  transition-colors duration-200

  hover:border-blue-400 hover:bg-blue-50

  ${isDragging
    ? "border-blue-500 bg-blue-50"
    : "border-zinc-300 bg-white"
  }
`}>

            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)

                    const file = e.dataTransfer.files?.[0]
                    if (file) handleFile(file)
                }}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition
                ${
                    isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-zinc-300 bg-white hover:bg-zinc-50"
                }`}
            >

                {!value ? (
                    <div>
                        <div className="text-sm font-medium text-zinc-700">
                            Drop reference image here
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            PNG / JPG / WEBP supported
                        </div>
                    </div>
                ) : (
                    <img
                        src={value}
                        className="mx-auto max-h-40 rounded-xl shadow"
                    />
                )}

            </div>

            {/* hidden input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFile(file)
                }}
            />

            {/* error */}
            {error && (
                <div className="mt-2 text-xs text-red-500">
                    {error}
                </div>
            )}
        </div>
    )
}