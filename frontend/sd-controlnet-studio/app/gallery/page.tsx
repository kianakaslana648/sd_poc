import GalleryGrid from "@/components/GalleryGrid";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <p className="text-zinc-400 text-sm">
          Your generated images history
        </p>
      </div>

      <GalleryGrid />
    </div>
  );
}