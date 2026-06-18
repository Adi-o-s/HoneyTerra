import { cn } from "@/lib/utils";

const STYLE: Record<string, string> = {
  pending: "bg-honey-100 text-honey-700",
  confirmed: "bg-brand-100 text-brand-700",
  processing: "bg-brand-100 text-brand-700",
  shipped: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  refunded: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STYLE[status] ?? "bg-cream text-ink-soft")}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
