"use client";

import { useEffect, useRef, useState } from "react";
import { fetchGallery } from "@/lib/api";
import ImageCard from "@/components/ImageCard";

type Item = {
  id: string;
  image_url: string;
  prompt: string;
  model: string;
  created_at: string;
};

export default function GalleryGrid() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    load(page);
  }, []);

  async function load(p: number) {
    const data = await fetchGallery(p);

    setItems((prev) => [...prev, ...data.items]);
    setHasMore(data.has_more);
  }

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const next = page + 1;
        setPage(next);
        load(next);
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore]);

  return (
    <>
      {/* masonry grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {items.map((item) => (
          <ImageCard key={item.id} item={item} />
        ))}
      </div>

      {/* loader */}
      {hasMore && (
        <div ref={loaderRef} className="h-10 mt-10 text-center text-zinc-500">
          Loading...
        </div>
      )}
    </>
  );
}