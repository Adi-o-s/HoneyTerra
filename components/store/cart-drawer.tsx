"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, selectSubtotal } from "@/lib/store/cart";
import { ProductVisual } from "./product-visual";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

const FREE_SHIP_THRESHOLD = 99900; // ₹999

export function CartDrawer() {
  const { lines, isOpen, close, setQty, remove } = useCart();
  const subtotal = useCart(selectSubtotal);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[61] flex h-dvh w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-xl font-semibold">Your Cart</h2>
              <button
                onClick={close}
                aria-label="Close cart"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-brand-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
                  <ShoppingBag className="h-7 w-7 text-brand-500" />
                </div>
                <p className="text-ink-soft">Your cart is empty.</p>
                <ButtonLink href="/shop" onClick={close} variant="primary">
                  Start shopping
                </ButtonLink>
              </div>
            ) : (
              <>
                <div className="border-b border-line bg-cream px-6 py-3">
                  {remaining > 0 ? (
                    <p className="text-sm text-ink-soft">
                      Add <span className="font-semibold text-brand-700">{formatINR(remaining)}</span> more for free shipping
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-brand-700">🎉 You&apos;ve unlocked free shipping!</p>
                  )}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
                    <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {lines.map((l) => (
                    <div key={`${l.variantId}${l.isSample ? ":s" : ""}`} className="flex gap-4 border-b border-line py-4 last:border-0">
                      <Link href={`/product/${l.slug}`} onClick={close} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
                        <ProductVisual src={l.image} family={l.family} />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="font-semibold leading-tight">{l.name}</p>
                            <p className="text-sm text-ink-muted">
                              {l.variantName}
                              {l.isSample && <span className="ml-1 text-honey-600">· Sample</span>}
                            </p>
                          </div>
                          <button onClick={() => remove(l.variantId)} aria-label="Remove" className="text-ink-muted hover:text-rose-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-line">
                            <button onClick={() => setQty(l.variantId, l.qty - 1)} className="px-2.5 py-1.5 text-ink-soft hover:text-brand-700" aria-label="Decrease">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">{l.qty}</span>
                            <button onClick={() => setQty(l.variantId, l.qty + 1)} className="px-2.5 py-1.5 text-ink-soft hover:text-brand-700" aria-label="Increase">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-semibold">{formatINR(l.pricePaise * l.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-ink-soft">Subtotal</span>
                    <span className="font-display text-xl font-semibold">{formatINR(subtotal)}</span>
                  </div>
                  <ButtonLink href="/checkout" onClick={close} variant="primary" size="lg" className="w-full">
                    Checkout
                  </ButtonLink>
                  <Button variant="ghost" size="sm" onClick={close} className="mt-2 w-full">
                    Continue shopping
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
