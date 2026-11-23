import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins, type Admin } from "@/db/schema";

const COOKIE = "sw_admin";
const MAX_AGE = 60 * 60 * 24 * 14;
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export type SessionAdmin = Pick<Admin, "id" | "email" | "name">;

export function hashPassword(password: string) {
  return bcrypt.hash(password, 11);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(adminId: number) {
  const token = await new SignJWT({ sub: String(adminId) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** Re-read from the DB so a deleted admin loses access immediately. */
export const getAdmin = cache(async (): Promise<SessionAdmin | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const admin = await db.query.admins.findFirst({
      where: eq(admins.id, Number(payload.sub)),
      columns: { id: true, email: true, name: true },
    });
    return admin ?? null;
  } catch {
    return null;
  }
});

/** Call at the top of every admin page, server action and admin route handler. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
