"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shown when someone opens an order page without a valid access token or owner
 * session. Confirms it's their order by matching the email on file, then
 * reloads the page with `?email=` so the server can authorize the view.
 */
export function OrderAccessGate({ orderNumber, error }: { orderNumber: string; error?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    router.push(`/order/${encodeURIComponent(orderNumber)}?email=${encodeURIComponent(value)}`);
  }

  return (
    <div className="container-page flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream">
        <Lock className="h-7 w-7 text-ink-muted" />
      </div>
      <h1 className="font-display text-2xl font-semibold">Confirm it&apos;s your order</h1>
      <p className="max-w-sm text-ink-soft">
        For your privacy, enter the email used for order{" "}
        <span className="font-semibold text-ink">{orderNumber}</span> to view its details.
      </p>
      <form onSubmit={onSubmit} className="mt-2 flex w-full max-w-sm flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="h-12 w-full rounded-full border border-line bg-paper px-5 text-center outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {error && (
          <p className="text-sm text-red-600">That email doesn&apos;t match this order. Please try again.</p>
        )}
        <Button type="submit" variant="primary" size="lg">View order</Button>
      </form>
    </div>
  );
}
