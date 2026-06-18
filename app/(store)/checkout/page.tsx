"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Truck, Wallet, ShoppingBag, ChevronLeft } from "lucide-react";
import { useCart, selectSubtotal } from "@/lib/store/cart";
import { checkoutSchema, type CheckoutInput } from "@/lib/checkout/schema";
import { loadRazorpay, type RazorpayResponse } from "@/lib/payments/razorpay-client";
import { ProductVisual } from "@/components/store/product-visual";
import { Button } from "@/components/ui/button";
import { cn, formatINR } from "@/lib/utils";

const FREE_SHIP_THRESHOLD = 99900;
const SHIP_FEE = 4900;

const EMPTY: CheckoutInput = {
  fullName: "", email: "", phone: "", line1: "", line2: "",
  city: "", state: "", pincode: "", paymentMethod: "cod",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const subtotal = useCart(selectSubtotal);

  const [form, setForm] = useState<CheckoutInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const shipping = subtotal >= FREE_SHIP_THRESHOLD || subtotal === 0 ? 0 : SHIP_FEE;
  const total = subtotal + shipping;

  function set<K extends keyof CheckoutInput>(key: K, value: CheckoutInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: parsed.data, items: lines }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      // Cash on Delivery — order is placed, go to confirmation.
      if (data.method === "cod") {
        clear();
        router.push(`/order/${data.orderNumber}?token=${data.token}`);
        return;
      }

      // Online — open Razorpay checkout, then verify the signature server-side.
      await loadRazorpay();
      const rzp = new window.Razorpay({
        key: data.razorpay.keyId,
        order_id: data.razorpay.orderId,
        amount: data.razorpay.amount,
        currency: "INR",
        name: data.razorpay.name,
        description: "HoneyTerra order",
        prefill: data.razorpay.prefill,
        theme: { color: "#14684e" },
        handler: async (response: RazorpayResponse) => {
          const verify = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const vdata = await verify.json();
          if (verify.ok) {
            clear();
            router.push(`/order/${vdata.orderNumber}?token=${vdata.token}`);
          } else {
            setServerError("Payment could not be verified. If money was deducted, contact support.");
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rzp.open();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center gap-4 py-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <ShoppingBag className="h-7 w-7 text-brand-500" />
        </div>
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-ink-soft">Add a product before checking out.</p>
        <Button onClick={() => router.push("/shop")} variant="primary">Browse products</Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Link href="/shop" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-brand-700">
        <ChevronLeft className="h-4 w-4" /> Continue shopping
      </Link>
      <h1 className="mb-8 font-display text-4xl font-semibold">Checkout</h1>

      <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left: details */}
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 font-display text-xl font-semibold">Contact & delivery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName} className="sm:col-span-2">
                <input className={inputCls(errors.fullName)} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Priya Sharma" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input className={inputCls(errors.email)} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
              </Field>
              <Field label="Mobile number" error={errors.phone}>
                <input className={inputCls(errors.phone)} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="9876543210" inputMode="numeric" />
              </Field>
              <Field label="Address" error={errors.line1} className="sm:col-span-2">
                <input className={inputCls(errors.line1)} value={form.line1} onChange={(e) => set("line1", e.target.value)} placeholder="House no., street, area" />
              </Field>
              <Field label="Apartment, landmark (optional)" className="sm:col-span-2">
                <input className={inputCls()} value={form.line2} onChange={(e) => set("line2", e.target.value)} placeholder="Landmark" />
              </Field>
              <Field label="City" error={errors.city}>
                <input className={inputCls(errors.city)} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Mumbai" />
              </Field>
              <Field label="State" error={errors.state}>
                <input className={inputCls(errors.state)} value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="Maharashtra" />
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <input className={inputCls(errors.pincode)} value={form.pincode} onChange={(e) => set("pincode", e.target.value)} placeholder="400001" inputMode="numeric" />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold">Payment</h2>
            <div className="space-y-3">
              <PayOption
                active={form.paymentMethod === "cod"}
                onClick={() => set("paymentMethod", "cod")}
                icon={Wallet}
                title="Cash on Delivery"
                desc="Pay in cash when your order arrives."
              />
              <PayOption
                active={form.paymentMethod === "razorpay"}
                onClick={() => set("paymentMethod", "razorpay")}
                icon={Lock}
                title="Pay online (UPI / Card / Netbanking)"
                desc="Secure payment via Razorpay."
                badge="Razorpay setup pending"
              />
            </div>
          </section>
        </div>

        {/* Right: summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-line bg-cream/50 p-6">
            <h2 className="mb-4 font-display text-xl font-semibold">Order summary</h2>
            <div className="space-y-4">
              {lines.map((l) => (
                <div key={`${l.variantId}${l.isSample ? ":s" : ""}`} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper">
                    <ProductVisual src={l.image} family={l.family} />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-paper">{l.qty}</span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-semibold leading-tight">{l.name}</p>
                    <p className="text-xs text-ink-muted">{l.variantName}</p>
                  </div>
                  <span className="self-center text-sm font-semibold">{formatINR(l.pricePaise * l.qty)}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <Row label="Subtotal" value={formatINR(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : formatINR(shipping)} accent={shipping === 0} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-semibold">{formatINR(total)}</span>
            </div>

            <Button type="submit" variant="primary" size="lg" className="mt-5 w-full" disabled={submitting}>
              {submitting ? "Processing…" : form.paymentMethod === "cod" ? "Place order" : `Pay ${formatINR(total)}`}
            </Button>
            {serverError && <p className="mt-3 text-center text-sm text-rose-500">{serverError}</p>}
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
              <Truck className="h-3.5 w-3.5" /> Free shipping over {formatINR(FREE_SHIP_THRESHOLD)} · 7-day returns
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function inputCls(error?: string) {
  return cn(
    "h-11 w-full rounded-xl border bg-paper px-4 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
    error ? "border-rose-300" : "border-line",
  );
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  );
}

function PayOption({ active, onClick, icon: Icon, title, desc, badge }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; title: string; desc: string; badge?: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all", active ? "border-brand-500 bg-brand-50" : "border-line hover:border-brand-200")}>
      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", active ? "border-brand-500" : "border-line")}>
        {active && <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
      </span>
      <Icon className="h-5 w-5 text-brand-600" />
      <span className="flex-1">
        <span className="flex items-center gap-2 font-semibold">{title}{badge && <span className="rounded-full bg-honey-100 px-2 py-0.5 text-[10px] font-semibold text-honey-700">{badge}</span>}</span>
        <span className="block text-sm text-ink-muted">{desc}</span>
      </span>
    </button>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-soft">{label}</span>
      <span className={cn("font-medium", accent && "text-brand-600")}>{value}</span>
    </div>
  );
}
