import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { markOrderPaid } from "@/lib/db/queries/orders";
import { signOrderToken } from "@/lib/checkout/order-access";
import { sendOrderConfirmationByNumber } from "@/lib/email/resend";

const bodySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid verification data" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const ok = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!ok) {
    return NextResponse.json({ error: "Payment signature verification failed" }, { status: 400 });
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.razorpayOrderId, razorpay_order_id),
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const changed = await markOrderPaid(order.id, razorpay_payment_id);
  // Only email on the first pending → paid transition (the webhook may race us).
  if (changed) await sendOrderConfirmationByNumber(order.orderNumber);
  return NextResponse.json({
    orderNumber: order.orderNumber,
    token: signOrderToken(order.orderNumber),
  });
}
