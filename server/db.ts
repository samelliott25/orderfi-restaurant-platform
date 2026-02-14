import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (process.env.DATABASE_URL) {
  const sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql, { schema });
} else {
  console.warn("[db] DATABASE_URL not set – database features disabled, using in-memory storage");
}

export { db };
