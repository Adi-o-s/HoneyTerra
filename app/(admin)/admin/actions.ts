"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import {
  updateOrderStatusDb,
  setTrackingDb,
  updateProductDb,
  updateVariantDb,
  createProductDb,
  deleteProductDb,
  addVariantDb,
  deleteVariantDb,
  addImageDb,
  deleteImageDb,
  type OrderStatusValue,
  type ProductFamilyValue,
} from "@/lib/db/queries/admin";

/**
 * Revalidate every storefront surface a product change can touch. Product pages
 * are ISR (rendered on-demand), so this is what makes admin edits appear without
 * waiting for the 5-minute refresh or a redeploy.
 */
function revalidateStorefront(productId: string) {
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/product/[slug]", "page");
  revalidatePath("/shop", "layout");
  revalidatePath("/");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("orderId"));
  const status = String(formData.get("status")) as OrderStatusValue;
  const note = String(formData.get("note") ?? "");
  await updateOrderStatusDb(id, status, note);
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}

export async function setTrackingAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("orderId"));
  const carrier = String(formData.get("carrier") ?? "");
  const trackingNumber = String(formData.get("trackingNumber") ?? "");
  await setTrackingDb(id, carrier, trackingNumber);
  revalidatePath(`/admin/orders/${id}`);
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("productId"));
  await updateProductDb(id, {
    name: String(formData.get("name")),
    tagline: String(formData.get("tagline")),
    description: String(formData.get("description")),
    badge: (String(formData.get("badge") ?? "").trim() || null) as string | null,
    basePricePaise: Math.round(Number(formData.get("basePrice")) * 100),
    sampleAvailable: formData.get("sampleAvailable") === "on",
    isActive: formData.get("isActive") === "on",
  });
  // Variant price/stock (fields named price_<id> and stock_<id>)
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("price_")) {
      await updateVariantDb(key.slice(6), { pricePaise: Math.round(Number(value) * 100) });
    } else if (key.startsWith("stock_")) {
      await updateVariantDb(key.slice(6), { stock: Math.round(Number(value)) });
    }
  }
  revalidateStorefront(id);
  revalidatePath("/admin/products");
  redirect("/admin/products?saved=1");
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const product = await createProductDb({
    name: String(formData.get("name")),
    family: String(formData.get("family")) as ProductFamilyValue,
    basePricePaise: Math.round(Number(formData.get("basePrice")) * 100),
  });
  redirect(`/admin/products/${product.id}`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId"));
  await deleteProductDb(productId);
  revalidateStorefront(productId);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function addVariantAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId"));
  await addVariantDb(productId, {
    name: String(formData.get("name")),
    sku: String(formData.get("sku")),
    pricePaise: Math.round(Number(formData.get("price")) * 100),
    stock: Math.round(Number(formData.get("stock")) || 0),
  });
  revalidateStorefront(productId);
}

export async function deleteVariantAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId"));
  await deleteVariantDb(String(formData.get("variantId")));
  revalidateStorefront(productId);
}

export async function addImageAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId"));
  await addImageDb(productId, String(formData.get("url")), String(formData.get("alt") ?? ""));
  revalidateStorefront(productId);
}

export async function deleteImageAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId"));
  await deleteImageDb(String(formData.get("imageId")));
  revalidateStorefront(productId);
}
