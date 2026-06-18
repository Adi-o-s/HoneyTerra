import { NextResponse } from "next/server";
import { z } from "zod";
import { checkoutSchema } from "@/lib/checkout/schema";
import { priceCart, CheckoutError } from "@/lib/checkout/pricing";
import { signOrderToken } from "@/lib/checkout/order-access";
import { createOrder, attachRazorpayOrder } from "@/lib/db/queries/orders";
import { razorpay } from "@/lib/payments/razorpay";
import { sendOrderConfirmationByNumber } from "@/lib/email/resend";
import { getCurrentUser } from "@/lib/auth/user";

const cartLineSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  slug: z.string(),
  name: z.string(),
  variantName: z.string(),
  pricePaise: z.number(),
  image: z.string(),
  family: z.enum(["ash-tray", "honey-comb-wrap"]),
  qty: z.number().int().min(1),
  isSample: z.boolean().optional(),
});

const bodySchema = z.object({
  input: checkoutSchema,
  items: z.array(cartLineSchema).min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout data" }, { status: 400 });
  }

  const { input, items } = parsed.data;
  const user = await getCurrentUser();

  try {
    const { subtotal, shipping, total, lines } = await priceCart(items);

    const order = await createOrder({
      userId: user?.id ?? null,
      email: input.email,
      phone: input.phone,
      address: {
        fullName: input.fullName,
        phone: input.phone,
        line1: input.line1,
        line2: input.line2,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
      },
      items: lines,
      subtotalPaise: subtotal,
      shippingPaise: shipping,
      paymentMethod: input.paymentMethod,
    });

    // Cash on Delivery — done, go straight to confirmation.
    if (input.paymentMethod === "cod") {
      await sendOrderConfirmationByNumber(order.orderNumber);
      return NextResponse.json({
        orderNumber: order.orderNumber,
        method: "cod",
        token: signOrderToken(order.orderNumber),
      });
    }

    // Online — create a Razorpay order to open the checkout modal with.
    const rzpOrder = await razorpay().orders.create({
      amount: total,
      currency: "INR",
      receipt: order.orderNumber,
      notes: { orderNumber: order.orderNumber },
    });
    await attachRazorpayOrder(order.id, rzpOrder.id);

    return NextResponse.json({
      orderNumber: order.orderNumber,
      method: "razorpay",
      razorpay: {
        orderId: rzpOrder.id,
        amount: total,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: "HoneyTerra",
        prefill: { name: input.fullName, email: input.email, contact: input.phone },
      },
    });
  } catch (err) {
    if (err instanceof CheckoutError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[checkout] failed:", err);
    return NextResponse.json({ error: "Could not place your order. Please try again." }, { status: 500 });
  }
}
