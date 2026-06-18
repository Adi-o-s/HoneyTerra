import Link from "next/link";
import { IndianRupee, ShoppingBag, Package, Receipt, ChevronRight, TrendingUp } from "lucide-react";
import { getDashboardData } from "@/lib/db/queries/admin";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatINR } from "@/lib/utils";

export const metadata = { title: "Admin · Dashboard" };

export default async function AdminDashboard() {
  const d = await getDashboardData();
  const maxDay = Math.max(...d.salesByDay.map((s) => s.revenuePaise), 1);
  const maxUnits = Math.max(...d.topProducts.map((p) => p.units), 1);

  const stats = [
    { label: "Revenue", value: formatINR(d.revenuePaise), icon: IndianRupee, hint: "excl. cancelled/refunded" },
    { label: "Avg order value", value: formatINR(d.aovPaise), icon: Receipt, hint: "per order" },
    { label: "Orders", value: String(d.orderCount), icon: ShoppingBag, hint: `${d.openCount} open` },
    { label: "Products", value: String(d.productCount), icon: Package, hint: `${d.lowStock} low stock` },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-ink-soft">An overview of your store.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-soft">{s.label}</span>
              <s.icon className="h-5 w-5 text-brand-500" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold">{s.value}</p>
            <p className="mt-1 text-xs text-ink-muted">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Sales chart */}
        <div className="rounded-2xl border border-line bg-paper p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-500" />
            <h2 className="font-display text-lg font-semibold">Sales · last 14 days</h2>
          </div>
          <div className="flex h-44 items-end gap-1.5">
            {d.salesByDay.map((s, i) => (
              <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t bg-brand-400 transition-colors group-hover:bg-brand-600"
                  style={{ height: `${(s.revenuePaise / maxDay) * 100}%`, minHeight: s.revenuePaise > 0 ? 4 : 0 }}
                />
                <span className="pointer-events-none absolute -top-7 hidden whitespace-nowrap rounded bg-ink px-2 py-1 text-[11px] text-paper group-hover:block">
                  {s.label}: {formatINR(s.revenuePaise)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-ink-muted">
            <span>{d.salesByDay[0].label}</span>
            <span>{d.salesByDay[d.salesByDay.length - 1].label}</span>
          </div>
        </div>

        {/* Top products + status */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="mb-3 font-display text-lg font-semibold">Top products</h2>
            {d.topProducts.length === 0 ? (
              <p className="text-sm text-ink-muted">No sales yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {d.topProducts.map((p) => (
                  <li key={p.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate font-medium">{p.name}</span>
                      <span className="shrink-0 text-ink-muted">{p.units} sold</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream">
                      <div className="h-full rounded-full bg-honey-400" style={{ width: `${(p.units / maxUnits) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="mb-3 font-display text-lg font-semibold">Orders by status</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(d.statusCounts).map(([status, count]) => (
                <span key={status} className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-sm">
                  <StatusBadge status={status} /> <span className="font-semibold">{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-6 rounded-2xl border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="font-display text-lg font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-brand-600 hover:underline">View all</Link>
        </div>
        {d.recent.length === 0 ? (
          <p className="p-8 text-center text-ink-muted">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {d.recent.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-cream/50">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{o.orderNumber}</span>
                    <StatusBadge status={o.status} />
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
