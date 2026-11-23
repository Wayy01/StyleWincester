/**
 * Creates an admin or resets its password.
 *   bun run admin:reset -- <email> <newPassword>
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";

const [rawEmail, password] = process.argv.slice(2).filter((a) => a !== "--");

if (!rawEmail || !password) {
  console.error("Usage: bun run admin:reset -- <email> <newPassword>");
  process.exit(1);
}
const email = rawEmail.trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error(`Invalid email: ${rawEmail}`);
  process.exit(1);
}
if (password.length < 10) {
  console.error("The password must be at least 10 characters.");
  process.exit(1);
}

const client = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const db = drizzle(client, { schema });
const { admins } = schema;

try {
  const passwordHash = await bcrypt.hash(password, 11);
  const existing = await db.query.admins.findFirst({ where: eq(admins.email, email), columns: { id: true } });
  if (existing) {
    await db.update(admins).set({ passwordHash }).where(eq(admins.id, existing.id));
    console.log(`Password updated for ${email}.`);
  } else {
    await db.insert(admins).values({ email, name: email.split("@")[0], passwordHash });
    console.log(`Admin created: ${email}.`);
  }
} finally {
  await client.end();
}
