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
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/admin/products");
  revalidatePath("/"); // storefront reflects changes
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
  await deleteProductDb(String(formData.get("productId")));
  revalidatePath("/admin/products");
  revalidatePath("/");
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
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteVariantAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId"));
  await deleteVariantDb(String(formData.get("variantId")));
  revalidatePath(`/admin/products/${productId}`);
}

export async function addImageAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId"));
  await addImageDb(productId, String(formData.get("url")), String(formData.get("alt") ?? ""));
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function deleteImageAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId"));
  await deleteImageDb(String(formData.get("imageId")));
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}
