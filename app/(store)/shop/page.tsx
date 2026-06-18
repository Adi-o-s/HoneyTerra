import { ShopView } from "@/components/store/shop-view";
import { getAllProducts, getProductsByCategory } from "@/lib/db/queries/catalog";
import { ASH_TRAY_CATEGORIES, WRAP_CATEGORIES } from "@/lib/data/categories";

export const metadata = { title: "Shop all products" };

const ALL_CATEGORIES = [
  { slug: "all" as const, label: "All Products", family: "ash-tray" as const },
  ...ASH_TRAY_CATEGORIES.slice(1),
  ...WRAP_CATEGORIES.slice(1),
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const active = c ?? "all";
  const products = active === "all" ? await getAllProducts() : await getProductsByCategory(active);

  return (
    <ShopView
      title="Shop everything"
      subtitle="Thoughtfully made essentials for a cleaner home — gel ash trays and reusable beeswax wraps."
      products={products}
      categories={ALL_CATEGORIES}
      activeCategory={active}
    />
  );
}
