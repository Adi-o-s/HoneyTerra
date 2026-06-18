import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { getProductForEdit, getProductImages } from "@/lib/db/queries/admin";
import { ProductImages } from "@/components/admin/product-images";
import {
  updateProductAction,
  deleteProductAction,
  addVariantAction,
  deleteVariantAction,
} from "../../actions";

export default async function AdminProductEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [data, images] = await Promise.all([getProductForEdit(id), getProductImages(id)]);
  if (!data) notFound();
  const { product, variants } = data;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-brand-700">
        <ChevronLeft className="h-4 w-4" /> All products
      </Link>
      <h1 className="font-display text-3xl font-semibold">Edit · {product.name}</h1>
      <Link href={`/product/${product.slug}`} className="text-sm text-brand-600 hover:underline">View on store →</Link>

      {/* Images */}
      <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
        <h2 className="mb-3 font-display text-lg font-semibold">Images</h2>
        <ProductImages productId={product.id} images={images} />
      </div>

      {/* Details + variant price/stock */}
      <form action={updateProductAction} className="mt-6 space-y-6">
        <input type="hidden" name="productId" value={product.id} />

        <div className="space-y-4 rounded-2xl border border-line bg-paper p-5">
          <Field label="Name"><input name="name" defaultValue={product.name} className={input} /></Field>
          <Field label="Tagline"><input name="tagline" defaultValue={product.tagline} className={input} /></Field>
          <Field label="Description"><textarea name="description" defaultValue={product.description} rows={4} className={`${input} h-auto py-2`} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Badge (optional)"><input name="badge" defaultValue={product.badge ?? ""} placeholder="e.g. Bestseller" className={input} /></Field>
            <Field label="Base price (₹)"><input name="basePrice" type="number" step="0.01" defaultValue={(product.basePricePaise / 100).toString()} className={input} /></Field>
          </div>
          <div className="flex flex-wrap gap-6 pt-1">
            <Toggle name="isActive" label="Visible in store" defaultChecked={product.isActive} />
            <Toggle name="sampleAvailable" label="Sample available" defaultChecked={product.sampleAvailable} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="mb-3 font-display text-lg font-semibold">Variants</h2>
          <div className="hidden grid-cols-[1fr_120px_90px_40px] gap-3 px-1 pb-2 text-xs font-medium text-ink-muted sm:grid">
            <span>Variant</span><span>Price (₹)</span><span>Stock</span><span />
          </div>
          <div className="space-y-3">
            {variants.map((v) => (
              <div key={v.id} className="grid grid-cols-[1fr_90px_70px_40px] items-center gap-3 sm:grid-cols-[1fr_120px_90px_40px]">
                <span className="truncate text-sm font-medium">{v.name} <span className="text-ink-muted">({v.sku})</span></span>
                <input name={`price_${v.id}`} type="number" step="0.01" defaultValue={(v.pricePaise / 100).toString()} className={input} />
                <input name={`stock_${v.id}`} type="number" defaultValue={v.stock.toString()} className={input} />
                <button formAction={deleteVariantAction} name="variantId" value={v.id} aria-label="Delete variant" className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-rose-50 hover:text-rose-500" disabled={variants.length <= 1}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button className="h-12 rounded-full bg-brand-600 px-8 font-semibold text-white hover:bg-brand-700">Save changes</button>
      </form>

      {/* Add variant */}
      <form action={addVariantAction} className="mt-6 rounded-2xl border border-line bg-paper p-5">
        <input type="hidden" name="productId" value={product.id} />
        <h2 className="mb-3 font-display text-lg font-semibold">Add a variant</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_100px_90px_auto]">
          <input name="name" required placeholder="Name (e.g. Pack of 5)" className={input} />
          <input name="sku" required placeholder="SKU" className={input} />
          <input name="price" type="number" step="0.01" required placeholder="₹" className={input} />
          <input name="stock" type="number" placeholder="Stock" className={input} />
          <button className="inline-flex h-11 items-center justify-center gap-1 rounded-full border border-brand-600/40 px-4 text-sm font-semibold text-brand-700 hover:bg-brand-50"><Plus className="h-4 w-4" /> Add</button>
        </div>
      </form>

      {/* Danger zone */}
      <form action={deleteProductAction} className="mt-6 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
        <input type="hidden" name="productId" value={product.id} />
        <div>
          <p className="font-semibold text-rose-700">Delete this product</p>
          <p className="text-sm text-ink-soft">Removes it and all its variants & images. This can&apos;t be undone.</p>
        </div>
        <button className="rounded-full border border-rose-300 px-5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100">Delete</button>
      </form>
    </div>
  );
}

const input = "h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-brand-600" />
      {label}
    </label>
  );
}
