import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUserWithProfile } from "./user";

/** Gate for admin routes/actions. Redirects non-admins away. */
export async function requireAdmin() {
  const data = await getCurrentUserWithProfile();
  if (!data) redirect("/login");
  if (data.profile?.role !== "admin") redirect("/");
  return data;
}
