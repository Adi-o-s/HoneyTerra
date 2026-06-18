import "server-only";
import { Resend } from "resend";
import { getOrderByNumber } from "@/lib/db/queries/orders";
import { signOrderToken } from "@/lib/checkout/order-access";
import { formatINR } from "@/lib/utils";

let client: Resend | null = null;
function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

const FROM = process.env.EMAIL_FROM ?? "HoneyTerra <onboarding@resend.dev>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3007";

/**
 * Sends the order confirmation email. Never throws — email failure must not
 * break checkout. Note: until a domain is verified in Resend, sends to
 * non-owner addresses are rejected (logged, not fatal).
 */
export async function sendOrderConfirmationByNumber(orderNumber: string) {
  const r = await getOrderByNumber(orderNumber);
  const mailer = resend();
  if (!r || !mailer) return;
  const { order, items } = r;

  const rows = items
    .map(
      (l) => `<tr>
        <td style="padding:8px 0;color:#1b211d">${l.name} <span style="color:#76817b">· ${l.variantName} × ${l.qty}</span></td>
        <td style="padding:8px 0;text-align:right;color:#1b211d">${formatINR(l.unitPricePaise * l.qty)}</td>
      </tr>`,
    )
    .join("");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#fbf6ec;padding:32px">
    <div style="max-width:560px;margin:0 auto;background:#fffdf8;border-radius:16px;overflow:hidden;border:1px solid #e7ded0">
      <div style="background:#105341;padding:24px 32px">
        <span style="color:#fff;font-size:22px;font-weight:700">honey<span style="color:#edb74f">terra</span></span>
      </div>
      <div style="padding:32px">
        <h1 style="margin:0 0 8px;font-size:22px;color:#0e4234">Thank you${order.shippingAddress?.fullName ? ", " + order.shippingAddress.fullName.split(" ")[0] : ""}! Your order is confirmed.</h1>
        <p style="color:#43504a;margin:0 0 24px">Order <strong>${order.orderNumber}</strong> ·
          ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"}</p>

        <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
        <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid #e7ded0;margin-top:12px;padding-top:12px">
          <tr><td style="padding-top:12px;color:#76817b">Subtotal</td><td style="padding-top:12px;text-align:right">${formatINR(order.subtotalPaise)}</td></tr>
          <tr><td style="color:#76817b">Shipping</td><td style="text-align:right">${order.shippingPaise === 0 ? "Free" : formatINR(order.shippingPaise)}</td></tr>
          <tr><td style="padding-top:8px;font-weight:700;font-size:16px">Total</td><td style="padding-top:8px;text-align:right;font-weight:700;font-size:16px">${formatINR(order.totalPaise)}</td></tr>
        </table>

        <a href="${SITE}/order/${order.orderNumber}?token=${signOrderToken(order.orderNumber)}" style="display:inline-block;margin-top:24px;background:#14684e;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600">Track your order</a>

        <p style="color:#76817b;font-size:13px;margin-top:24px">Delivering to: ${order.shippingAddress?.line1}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.pincode}</p>
      </div>
      <div style="background:#0b362c;padding:16px 32px;color:#a6d7be;font-size:12px;text-align:center">
        HoneyTerra · Sustainable living, beautifully made.
      </div>
    </div>
  </div>`;

  try {
    await mailer.emails.send({
      from: FROM,
      to: order.email,
      subject: `Your HoneyTerra order ${order.orderNumber} is confirmed`,
      html,
    });
  } catch (err) {
    console.error("[email] order confirmation failed:", err);
  }
}
