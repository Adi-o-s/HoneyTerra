import Razorpay from "razorpay";
import crypto from "node:crypto";

// Server-only Razorpay client. Uses TEST keys in .env.local.
let instance: Razorpay | null = null;

export function razorpay() {
  if (!instance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) throw new Error("Razorpay keys are not configured.");
    instance = new Razorpay({ key_id, key_secret });
  }
  return instance;
}

/** Constant-time hex-string comparison that never throws on bad input. */
function safeEqual(expected: string, actual: string) {
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Verify the signature Razorpay returns to the client after a successful payment. */
export function verifyPaymentSignature(args: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${args.orderId}|${args.paymentId}`)
    .digest("hex");
  return safeEqual(expected, args.signature);
}

/**
 * Verify a Razorpay webhook. The signature is an HMAC-SHA256 of the *raw*
 * request body keyed by the webhook secret (configured in the Razorpay
 * dashboard and in RAZORPAY_WEBHOOK_SECRET). Pass the unparsed body string.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}
