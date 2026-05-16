"use client"

import { useState } from "react"

type Props = {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    rows?: number
}

export default function PromptBox({
    label,
    value,
    onChange,
    placeholder,
    rows = 5,
}: Props) {
    const [focused, setFocused] = useState(false)

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-zinc-700 font-medium">
                    {label}
                </label>

                <span className="text-xs text-zinc-400">
                    {value.length} chars
                </span>
            </div>

            <textarea
                value={value}
                placeholder={placeholder}
                rows={rows}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => onChange(e.target.value)}
                className={`
  w-full rounded-2xl border p-3 text-sm outline-none
  transition-colors duration-200

  hover:border-zinc-400

  ${focused
    ? "border-blue-500 ring-2 ring-blue-100"
    : "border-zinc-200"
  }
`}
            />
        </div>
    )
}