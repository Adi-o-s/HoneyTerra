import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { getAdminProducts } from "@/lib/db/queries/admin";
import { SavedToast } from "@/components/admin/saved-toast";
import { formatINR } from "@/lib/utils";

export const metadata = { title: "Admin · Products" };

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Products</h1>
          <p className="mt-1 text-ink-soft">{products.length} products · tap to edit pricing, stock & details</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-paper">
        <ul className="divide-y divide-line">
          {products.map((p) => {
            const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
            const low = p.variants.some((v) => v.stock < 10);
            return (
              <li key={p.id}>
                <Link href={`/admin/products/${p.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-cream/50">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{p.name}</span>
                      {!p.isActive && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">Hidden</span>}
                      {p.badge && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">{p.badge}</span>}
                    </div>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      from {formatINR(p.basePricePaise)} · {p.variants.length} variants ·{" "}
                      <span className={low ? "text-rose-600" : ""}>{totalStock} in stock</span>
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <SavedToast show={!!saved} message="Product saved" />
    </div>
  );
}
