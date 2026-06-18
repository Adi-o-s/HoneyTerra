"use client";

import { useState, useTransition } from "react";
import { Upload, Trash2, ImageIcon, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { addImageAction, deleteImageAction } from "@/app/(admin)/admin/actions";

type Img = { id: string; url: string; alt: string };

export function ProductImages({ productId, images }: { productId: string; images: Img[] }) {
  const supabase = createSupabaseBrowserClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const safe = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const path = `${productId}/${crypto.randomUUID()}-${safe}`;
    const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
    if (upErr) {
      setError(upErr.message);
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    const fd = new FormData();
    fd.set("productId", productId);
    fd.set("url", data.publicUrl);
    fd.set("alt", file.name.replace(/\.[^.]+$/, ""));
    startTransition(async () => {
      await addImageAction(fd);
      setBusy(false);
    });
    e.target.value = "";
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-cream">
            {img.url.startsWith("visual:") ? (
              <div className="flex h-full flex-col items-center justify-center gap-1 text-ink-muted">
                <ImageIcon className="h-5 w-5" />
                <span className="text-[10px]">placeholder</span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
            )}
            <form action={deleteImageAction} className="absolute right-1.5 top-1.5">
              <input type="hidden" name="productId" value={productId} />
              <input type="hidden" name="imageId" value={img.id} />
              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 transition-opacity hover:bg-rose-500 group-hover:opacity-100" aria-label="Delete image">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line text-ink-muted transition-colors hover:border-brand-400 hover:text-brand-600">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span className="text-xs font-medium">{busy ? "Uploading…" : "Upload"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
      <p className="mt-2 text-xs text-ink-muted">First image is the main one shown on the store.</p>
    </div>
  );
}
