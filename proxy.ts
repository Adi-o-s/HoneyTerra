import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next 16's "middleware" is now `proxy`. Refresh the Supabase session on each
// app navigation so server components see a valid user.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on pages, skip static assets, public media and image files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|products/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|ico)$).*)",
  ],
};
