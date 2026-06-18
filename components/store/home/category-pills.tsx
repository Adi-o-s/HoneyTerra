"use client";

import Link from "next/link";
import {
  Grid2x2, Circle, Square, Gem, Star, ShoppingBag, Gift,
  Scroll, Scissors, Package, Smile, Hexagon, Sparkles,
} from "lucide-react";
import type { CategoryDef } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "all-trays": Grid2x2, round: Circle, square: Square, crystal: Gem,
  premium: Star, portable: ShoppingBag, "gift-set": Gift,
  "all-wraps": Grid2x2, rolls: Scroll, "pre-cut": Scissors,
  "bags-pouches": Package, kids: Smile, "wrap-gift-sets": Gift,
  accessories: Hexagon,
};

export function CategoryPills({
  title,
  categories,
  tone = "brand",
}: {
  title: string;
  categories: CategoryDef[];
  tone?: "brand" | "honey";
}) {
  const active = tone === "honey" ? "honey" : "brand";
  return (
    <div>
      <div className="mb-6 flex items-center justify-center gap-2 text-center">
        {tone === "honey" ? (
          <Sparkles className="h-4 w-4 text-honey-500" />
        ) : (
          <Hexagon className="h-4 w-4 text-brand-500" />
        )}
        <h3 className="font-display text-xl font-semibold">{title}</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((c, i) => {
          const Icon = ICONS[c.slug] ?? Hexagon;
          const isFirst = i === 0;
          return (
            <Link
              key={c.slug}
              href={`/shop?c=${c.slug}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition-all hover:-translate-y-0.5",
                isFirst
                  ? active === "honey"
                    ? "border-honey-300 bg-honey-50 text-honey-700"
                    : "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-line bg-paper text-ink-soft hover:border-brand-200 hover:text-brand-700",
              )}
            >
              <Icon className="h-4 w-4" />
              {c.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
