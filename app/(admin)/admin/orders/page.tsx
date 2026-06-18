import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllOrders } from "@/lib/db/queries/admin";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatINR } from "@/lib/utils";

export const metadata = { title: "Admin · Orders" };

export default async function AdminOrders() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Orders</h1>
      <p className="mt-1 text-ink-soft">{orders.length} total</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-paper">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-ink-muted">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-cream/50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{o.orderNumber}</span>
                      <StatusBadge status={o.status} />
                      <span className="rounded-full bg-cream px-2 py-0.5 text-xs font-medium text-ink-soft uppercase">
                        {o.paymentMethod === "cod" ? "COD" : "Online"}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-ink-muted">
                      {o.shippingAddress.fullName} · {o.email} · {new Date(o.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{formatINR(o.totalPaise)}</span>
                    <ChevronRight className="h-5 w-5 text-ink-muted" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
