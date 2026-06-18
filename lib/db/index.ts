import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Single shared postgres connection (pooled). In dev we cache it on globalThis
// to survive HMR. Uses DATABASE_URL (Supabase pooled connection string).
const connectionString = process.env.DATABASE_URL;

declare global {
  var __ht_pg: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
  }
  return postgres(connectionString, { prepare: false });
}

const client = global.__ht_pg ?? createClient();
if (process.env.NODE_ENV !== "production") global.__ht_pg = client;

export const db = drizzle(client, { schema });
export { schema };
