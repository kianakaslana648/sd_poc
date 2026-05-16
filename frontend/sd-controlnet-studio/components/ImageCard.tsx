"use client";

import { useState } from "react";

export default function ImageCard({ item }: any) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative break-inside-avoid group rounded-xl overflow-hidden bg-zinc-900">
      <img
        src={item.image_url}
        onLoad={() => setLoaded(true)}
        className={`w-full transition duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } group-hover:scale-105`}
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition">
        <div className="absolute bottom-0 p-3 text-xs text-white space-y-1">
          <div className="line-clamp-3">{item.prompt}</div>
          <div className="text-zinc-300">
            {item.model} · {new Date(item.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}