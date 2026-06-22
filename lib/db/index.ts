import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// The connection is created lazily on the first query — NOT at module load.
// `next build` imports every page module while collecting page data, so any
// client (or env-var check) that runs at import time fails the whole build when
// DATABASE_URL isn't present in the build environment. Deferring creation keeps
// the build DB-free; the connection string is only required at runtime, when a
// query actually runs. Cached on globalThis to survive HMR and to reuse the
// pooled connection across serverless invocations.
declare global {
  var __ht_pg: ReturnType<typeof postgres> | undefined;
  var __ht_db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

function getDb() {
  if (global.__ht_db) return global.__ht_db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
  }

  const client = global.__ht_pg ?? postgres(connectionString, { prepare: false });
  global.__ht_pg = client;

  const instance = drizzle(client, { schema });
  global.__ht_db = instance;
  return instance;
}

// Proxy so `db` can be imported anywhere without touching the DB until a real
// property (a query method) is accessed at runtime.
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance as object, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
