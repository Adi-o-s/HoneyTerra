import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createProductAction } from "../../actions";

export const metadata = { title: "Admin · New product" };

const input = "h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function NewProduct() {
  return (
    <div className="max-w-xl">
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-brand-700">
        <ChevronLeft className="h-4 w-4" /> All products
      </Link>
      <h1 className="font-display text-3xl font-semibold">New product</h1>
      <p className="mt-1 text-ink-soft">Create it, then add images, details &amp; variants on the next screen.</p>

      <form action={createProductAction} className="mt-6 space-y-4 rounded-2xl border border-line bg-paper p-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">Product name</span>
          <input name="name" required placeholder="e.g. Honeycomb Wrap" className={input} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">Category</span>
          <select name="family" defaultValue="ash-tray" className={input}>
            <option value="ash-tray">Gel Ash Tray</option>
            <option value="honey-comb-wrap">Honeycomb Wrap</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">Starting price (₹)</span>
          <input name="basePrice" type="number" step="0.01" required placeholder="0.00" className={input} />
        </label>
        <button className="h-12 w-full rounded-full bg-brand-600 font-semibold text-white hover:bg-brand-700">Create product</button>
        <p className="text-center text-xs text-ink-muted">New products start hidden until you make them visible.</p>
      </form>
    </div>
  );
}
