import { ShopView } from "@/components/store/shop-view";
import { getProductsByFamily, getProductsByCategory } from "@/lib/db/queries/catalog";
import { WRAP_CATEGORIES } from "@/lib/data/categories";

export const metadata = { title: "Honey Comb Wraps" };

export default async function WrapsPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const active = c ?? "all-wraps";
  const products =
    active === "all-wraps"
      ? await getProductsByFamily("honey-comb-wrap")
      : (await getProductsByCategory(active)).filter((p) => p.family === "honey-comb-wrap");

  return (
    <ShopView
      title="Honey Comb Wraps"
      subtitle="Wrap fresh, live green. Reusable beeswax wraps that keep food fresh — the natural, plastic-free way."
      products={products}
      categories={WRAP_CATEGORIES}
      activeCategory={active}
      basePath="/shop/wraps"
    />
  );
}
