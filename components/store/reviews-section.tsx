import { Star, BadgeCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ReviewsSection({ product }: { product: Product }) {
  const reviews = product.reviews ?? [];
  // Rough distribution for the bar chart (demo until real data lands).
  const dist = [5, 4, 3, 2, 1].map((stars) => {
    const pct = stars === 5 ? 78 : stars === 4 ? 16 : stars === 3 ? 4 : stars === 2 ? 1 : 1;
    return { stars, pct };
  });

  return (
    <section className="border-t border-line py-14">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <div>
          <h2 className="font-display text-3xl font-semibold">Customer reviews</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-display text-5xl font-semibold text-brand-700">{product.rating}</span>
            <div>
              <div className="flex text-honey-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating) && "fill-current")} />
                ))}
              </div>
              <p className="text-sm text-ink-muted">{product.reviewCount} verified reviews</p>
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            {dist.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-ink-muted">{d.stars}</span>
                <Star className="h-3.5 w-3.5 fill-honey-400 text-honey-400" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                  <div className="h-full rounded-full bg-honey-400" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-8 text-right text-ink-muted">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {reviews.length === 0 && (
            <p className="text-ink-muted">Be the first to review this product after your purchase.</p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{r.author}</span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600">
                      <BadgeCheck className="h-4 w-4" /> Verified buyer
                    </span>
                  )}
                </div>
                <div className="flex text-honey-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating && "fill-current")} />
                  ))}
                </div>
              </div>
              <h4 className="mt-2 font-semibold">{r.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
