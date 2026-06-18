import "server-only";
import { eq } from "drizzle-orm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

/** The current Supabase auth user, or null. */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Current user + their profile row (name, phone, role), or null if signed out. */
export async function getCurrentUserWithProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const profile = await db.query.profiles.findFirst({ where: eq(profiles.id, user.id) });
  return { user, profile: profile ?? null };
}
