import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { markOrderPaid } from "@/lib/db/queries/orders";
import { sendOrderConfirmationByNumber } from "@/lib/email/resend";

/**
 * Razorpay webhook — the authoritative source of payment truth. Unlike the
 * client `/api/checkout/verify` call (which never fires if the customer closes
 * the tab), this is delivered server-to-server so a captured payment always
 * confirms the order. Configure it in the Razorpay dashboard for the
 * `payment.captured` (and optionally `order.paid`) events, with the secret in
 * RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  // Signature is computed over the RAW body, so read text (not json) first.
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: { entity?: { id?: string; order_id?: string } };
      order?: { entity?: { id?: string } };
    };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id ?? event.payload?.order?.entity?.id;

  // Only act on payment-success events; ack everything else so Razorpay stops retrying.
  const handled = event.event === "payment.captured" || event.event === "order.paid";
  if (!handled || !razorpayOrderId) {
    return NextResponse.json({ received: true });
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.razorpayOrderId, razorpayOrderId),
  });
  if (!order) {
    // Unknown order — ack so Razorpay doesn't retry forever, but log for review.
    console.error("[webhook] no order for razorpay order", razorpayOrderId);
    return NextResponse.json({ received: true });
  }

  const changed = await markOrderPaid(order.id, payment?.id ?? "");
  if (changed) await sendOrderConfirmationByNumber(order.orderNumber);

  return NextResponse.json({ received: true });
}
