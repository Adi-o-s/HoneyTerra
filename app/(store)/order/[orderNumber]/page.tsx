import { CheckCircle2, Package, MapPin, Search, Clock } from "lucide-react";
import { getOrderByNumber } from "@/lib/db/queries/orders";
import { verifyOrderToken } from "@/lib/checkout/order-access";
import { getCurrentUser } from "@/lib/auth/user";
import { OrderTimeline } from "@/components/store/order-timeline";
import { OrderAccessGate } from "@/components/store/order-access-gate";
import { ProductVisual } from "@/components/store/product-visual";
import { ButtonLink } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { orderNumber } = await params;
  const { token, email } = await searchParams;
  const result = await getOrderByNumber(orderNumber);

  if (!result) {
    return (
      <div className="container-page flex flex-col items-center justify-center gap-4 py-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream">
          <Search className="h-7 w-7 text-ink-muted" />
        </div>
        <h1 className="font-display text-2xl font-semibold">Order not found</h1>
        <p className="max-w-sm text-ink-soft">
          We couldn&apos;t find order <span className="font-semibold">{orderNumber}</span>. Check the link in your
          confirmation email, or try the tracking page.
        </p>
        <ButtonLink href="/track" variant="primary">Track an order</ButtonLink>
      </div>
    );
  }

  const { order, items } = result;

  // Authorize: the order number alone must not reveal a stranger's PII. Allow
  // the signed confirmation link (token), the owning account, or a matching email.
  const user = await getCurrentUser();
  const isOwner = !!user && user.id === order.userId;
  const hasToken = verifyOrderToken(order.orderNumber, token);
  const emailMatches = !!email && email.trim().toLowerCase() === order.email.toLowerCase();
  if (!isOwner && !hasToken && !emailMatches) {
    return <OrderAccessGate orderNumber={order.orderNumber} error={!!email} />;
  }

  const awaitingPayment = order.status === "pending";
  const eta = new Date(new Date(order.createdAt).getTime() + 5 * 864e5).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });

  return (
    <div className="container-page py-10">
      <div className={`mb-8 flex items-start gap-4 rounded-2xl p-6 ${awaitingPayment ? "bg-honey-50" : "bg-brand-50"}`}>
        {awaitingPayment ? (
          <Clock className="mt-0.5 h-8 w-8 shrink-0 text-honey-600" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-8 w-8 shrink-0 text-brand-600" />
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-800">
            {awaitingPayment ? "Payment pending" : "Thank you! Your order is confirmed."}
          </h1>
          <p className="mt-1 text-ink-soft">
            Order <span className="font-semibold text-ink">{order.orderNumber}</span> · A confirmation has been sent to{" "}
            <span className="font-medium">{order.email}</span>.
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-semibold">
              <Package className="h-5 w-5 text-brand-600" /> Tracking
            </h2>
            <p className="mb-6 rounded-xl bg-cream/60 px-4 py-3 text-sm text-ink-soft">
              Estimated delivery by <span className="font-semibold text-ink">{eta}</span>
            </p>
            <OrderTimeline status={order.status} />
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold">
              <MapPin className="h-5 w-5 text-brand-600" /> Delivery address
            </h2>
            <div className="rounded-xl border border-line p-4 text-sm leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              <p className="mt-1">{order.phone}</p>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-line bg-cream/40 p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">Your items</h2>
            <div className="space-y-4">
              {items.map((l) => (
                <div key={l.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-paper">
                    {l.image && <ProductVisual src={l.image} family="ash-tray" />}
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-paper">{l.qty}</span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-semibold leading-tight">{l.name}</p>
                    <p className="text-xs text-ink-muted">{l.variantName}</p>
                  </div>
                  <span className="self-center text-sm font-semibold">{formatINR(l.unitPricePaise * l.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span>{formatINR(order.subtotalPaise)}</span></div>
              <div className="flex justify-between"><span className="text-ink-soft">Shipping</span><span>{order.shippingPaise === 0 ? "Free" : formatINR(order.shippingPaise)}</span></div>
              <div className="flex justify-between"><span className="text-ink-soft">Payment</span><span>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</span></div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="font-semibold">Total</span>
              <span className="font-display text-xl font-semibold">{formatINR(order.totalPaise)}</span>
            </div>
          </div>
          <ButtonLink href="/shop" variant="outline" size="lg" className="mt-4 w-full">Continue shopping</ButtonLink>
        </aside>
      </div>
    </div>
  );
}
