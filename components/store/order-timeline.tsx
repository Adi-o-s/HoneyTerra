import { Check, CreditCard, Package, Truck, MapPin, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// Display flow for the customer tracking timeline. The DB order status enum also
// includes "pending" (awaiting payment), "cancelled" and "refunded", handled below.
const FLOW = ["confirmed", "processing", "shipped", "out_for_delivery", "delivered"] as const;
type FlowStatus = (typeof FLOW)[number];

const META: Record<FlowStatus, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  confirmed: { label: "Order confirmed", icon: CreditCard },
  processing: { label: "Processing", icon: Package },
  shipped: { label: "Shipped", icon: Truck },
  out_for_delivery: { label: "Out for delivery", icon: MapPin },
  delivered: { label: "Delivered", icon: Home },
};

export function OrderTimeline({ status }: { status: string }) {
  // "pending" sits before the first visible step.
  const currentIndex = FLOW.indexOf(status as FlowStatus);

  return (
    <ol className="relative">
      {FLOW.map((step, i) => {
        const done = currentIndex >= 0 && i < currentIndex;
        const active = i === currentIndex;
        const Icon = META[step].icon;
        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            {i < FLOW.length - 1 && (
              <span className={cn("absolute left-[19px] top-10 h-full w-0.5", done ? "bg-brand-500" : "bg-line")} />
            )}
            <span
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                done && "border-brand-500 bg-brand-500 text-white",
                active && "border-brand-500 bg-brand-50 text-brand-600",
                !done && !active && "border-line bg-paper text-ink-muted",
              )}
            >
              {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </span>
            <div className="pt-1.5">
              <p className={cn("font-semibold", active ? "text-brand-700" : done ? "text-ink" : "text-ink-muted")}>
                {META[step].label}
              </p>
              {active && <p className="text-sm text-ink-muted">Your order is here right now.</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
