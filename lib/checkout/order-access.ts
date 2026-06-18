import "server-only";
import crypto from "node:crypto";

/**
 * Stateless access tokens for the public order page. The token is an HMAC of
 * the order number with a server secret, so it's unguessable and needs no DB
 * column — anyone with the confirmation link (which carries `?token=`) can view
 * the order, but the 6-digit order number alone is no longer enough to read a
 * stranger's name, address, and phone.
 */
function secret() {
  const s =
    process.env.ORDER_TOKEN_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error("No secret available for order tokens — set ORDER_TOKEN_SECRET.");
  return s;
}

export function signOrderToken(orderNumber: string): string {
  return crypto
    .createHmac("sha256", secret())
    .update(orderNumber.trim().toUpperCase())
    .digest("hex")
    .slice(0, 32);
}

export function verifyOrderToken(orderNumber: string, token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = signOrderToken(orderNumber);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
