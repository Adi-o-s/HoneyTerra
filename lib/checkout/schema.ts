import { z } from "zod";

// Checkout form validation. Reused by the form UI and (later) the server action.
export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  line1: z.string().min(4, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  paymentMethod: z.enum(["cod", "razorpay"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
