import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Truck } from "lucide-react";
import { getOrderDetail } from "@/lib/db/queries/admin";
import { updateOrderStatusAction, setTrackingAction } from "../../actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatINR } from "@/lib/utils";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "refunded"];

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getOrderDetail(id);
  if (!data) notFound();
  const { order, items, history, shipment } = data;
  const addr = order.shippingAddress;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-brand-700">
        <ChevronLeft className="h-4 w-4" /> All orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">{order.orderNumber}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-ink-soft">
        {new Date(order.createdAt).toLocaleString("en-IN")} · {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"} · {order.paymentStatus}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Items + customer */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="mb-3 font-display text-lg font-semibold">Items</h2>
            <ul className="divide-y divide-line">
              {items.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span>{l.name} <span className="text-ink-muted">· {l.variantName} × {l.qty}</span>{l.isSample && <span className="ml-1 text-honey-600">(sample)</span>}</span>
                  <span className="font-medium">{formatINR(l.unitPricePaise * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
              <Row label="Subtotal" value={formatINR(order.subtotalPaise)} />
              <Row label="Shipping" value={order.shippingPaise === 0 ? "Free" : formatINR(order.shippingPaise)} />
              <div className="flex justify-between pt-1 font-semibold"><span>Total</span><span>{formatINR(order.totalPaise)}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5 text-sm">
            <h2 className="mb-3 font-display text-lg font-semibold">Customer</h2>
            <p className="font-semibold">{addr.fullName}</p>
            <p className="text-ink-soft">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
            <p className="text-ink-soft">{addr.city}, {addr.state} {addr.pincode}</p>
            <p className="mt-1 text-ink-soft">{order.phone} · {order.email}</p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="mb-3 font-display text-lg font-semibold">Timeline</h2>
            <ul className="space-y-2 text-sm">
              {history.map((h) => (
                <li key={h.id} className="flex justify-between">
                  <span className="capitalize">{h.status.replace(/_/g, " ")}{h.note ? ` — ${h.note}` : ""}</span>
                  <span className="text-ink-muted">{new Date(h.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <form action={updateOrderStatusAction} className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="mb-3 font-display text-lg font-semibold">Update status</h2>
            <input type="hidden" name="orderId" value={order.id} />
            <select name="status" defaultValue={order.status} className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm capitalize outline-none focus:border-brand-500">
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
            <input name="note" placeholder="Note (optional)" className="mt-3 h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-brand-500" />
            <button className="mt-3 h-11 w-full rounded-full bg-brand-600 font-semibold text-white hover:bg-brand-700">Save status</button>
          </form>

          <form action={setTrackingAction} className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold"><Truck className="h-4.5 w-4.5 text-brand-600" /> Shipment</h2>
            <input type="hidden" name="orderId" value={order.id} />
            <input name="carrier" defaultValue={shipment?.carrier ?? ""} placeholder="Carrier (e.g. Delhivery)" className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-brand-500" />
            <input name="trackingNumber" defaultValue={shipment?.trackingNumber ?? ""} placeholder="Tracking number" className="mt-3 h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-brand-500" />
            <button className="mt-3 h-11 w-full rounded-full border border-brand-600/40 font-semibold text-brand-700 hover:bg-brand-50">Save tracking</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-ink-soft">{label}</span><span>{value}</span></div>;
}
