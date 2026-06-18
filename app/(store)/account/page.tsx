import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, LogOut, ChevronRight, ShoppingBag, LayoutDashboard } from "lucide-react";
import { getCurrentUserWithProfile } from "@/lib/auth/user";
import { getOrdersByUser } from "@/lib/db/queries/orders";
import { signOutAction } from "@/lib/auth/actions";
import { ButtonLink } from "@/components/ui/button";
import { formatINR, cn } from "@/lib/utils";

export const metadata = { title: "My account" };

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-honey-100 text-honey-700",
  confirmed: "bg-brand-100 text-brand-700",
  processing: "bg-brand-100 text-brand-700",
  shipped: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  refunded: "bg-rose-100 text-rose-700",
};

export default async function AccountPage() {
  const data = await getCurrentUserWithProfile();
  if (!data) redirect("/login");

  const { user, profile } = data;
  const orders = await getOrdersByUser(user.id);
  const firstName = profile?.fullName?.split(" ")[0] ?? "there";

  return (
    <div className="container-page py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold">Hi, {firstName} 👋</h1>
          <p className="mt-1 text-ink-soft">{user.email}</p>
        </div>
        <form action={signOutAction}>
          <button className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand-300 hover:text-brand-700">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>

      {profile?.role === "admin" && (
        <Link
          href="/admin"
          className="mb-8 flex items-center justify-between gap-4 rounded-2xl bg-brand-700 p-5 text-white transition-colors hover:bg-brand-800"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <LayoutDashboard className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">Admin dashboard</p>
              <p className="text-sm text-brand-100">Manage orders, products, stock &amp; view sales analytics.</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-brand-100" />
        </Link>
      )}

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold">
          <Package className="h-5 w-5 text-brand-600" /> Order history
        </h2>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-cream/40 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
              <ShoppingBag className="h-6 w-6 text-brand-500" />
            </div>
            <p className="text-ink-soft">You haven&apos;t placed any orders yet.</p>
            <ButtonLink href="/shop" variant="primary">Start shopping</ButtonLink>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/order/${o.orderNumber}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{o.orderNumber}</span>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLE[o.status] ?? "bg-cream text-ink-soft")}>
                        {o.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                      {o.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-semibold">{formatINR(o.totalPaise)}</span>
                    <ChevronRight className="h-5 w-5 text-ink-muted" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
