import { ShopView } from "@/components/store/shop-view";
import { getProductsByFamily, getProductsByCategory } from "@/lib/db/queries/catalog";
import { ASH_TRAY_CATEGORIES } from "@/lib/data/categories";

export const metadata = { title: "Gel Ash Trays" };

export default async function AshTraysPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const active = c ?? "all-trays";
  const products =
    active === "all-trays"
      ? await getProductsByFamily("ash-tray")
      : (await getProductsByCategory(active)).filter((p) => p.family === "ash-tray");

  return (
    <ShopView
      title="Gel Ash Trays"
      subtitle="Clean. Stylish. Smoke-friendly. Odour-trapping gel in glass you'll want on display."
      products={products}
      categories={ASH_TRAY_CATEGORIES}
      activeCategory={active}
      basePath="/shop/ash-trays"
    />
  );
}
