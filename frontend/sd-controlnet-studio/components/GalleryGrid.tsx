"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // ======================
  // LOAD DATA (safe)
  // ======================
  const load = useCallback(async (p: number) => {
    if (loading) return;
    if (!hasMore && p !== 1) return;

    setLoading(true);

    try {
      const data = await fetchGallery(p);

      setItems((prev) => {
        // 防止重复数据（可选但推荐）
        const existingIds = new Set(prev.map((i) => i.id));
        const newItems = data.items.filter((i: Item) => !existingIds.has(i.id));
        return [...prev, ...newItems];
      });

      setHasMore(data.has_more);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // ======================
  // INITIAL LOAD
  // ======================
  useEffect(() => {
    load(1);
  }, []);

  // ======================
  // INFINITE SCROLL
  // ======================
  useEffect(() => {
    if (!hasMore) return;
    if (loading) return;

    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading) {
          setPage((prev) => {
            const next = prev + 1;
            load(next);
            return next;
          });
        }
      },
      {
        root: null,
        rootMargin: "200px", // ⭐ 提前加载，体验更丝滑
        threshold: 0,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasMore, loading, load]);

  // ======================
  // UI
  // ======================
  return (
    <div className="w-full">
      {/* GRID (stable layout) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ImageCard key={item.id} item={item} />
        ))}
      </div>

      {/* LOADING SENTINEL */}
      {hasMore && (
        <div
          ref={loaderRef}
          className="h-16 flex items-center justify-center text-zinc-500"
        >
          {loading ? "Loading..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
}