import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "deal-finder-admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function getPassword(): string | undefined {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.trim().length >= 16 ? password : undefined;
}

function getSessionSecret(): string | undefined {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : undefined;
}

export function isAdminConfigured(): boolean {
  return Boolean(getPassword() && getSessionSecret());
}

function signature(expiresAt: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`deal-finder-admin:${expiresAt}`)
    .digest("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret) return false;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [expiresAt, suppliedSignature, ...extra] = token.split(".");
  if (extra.length || !expiresAt || !suppliedSignature) return false;

  const expiry = Number(expiresAt);
  if (!Number.isSafeInteger(expiry) || expiry <= Date.now()) return false;

  return safeEqual(signature(expiresAt, secret), suppliedSignature);
}

export async function assertAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized: administrator sign-in required.");
  }
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

export async function signInAdmin(password: string): Promise<boolean> {
  const expectedPassword = getPassword();
  const secret = getSessionSecret();
  if (!expectedPassword || !secret || typeof password !== "string" || password.length > 256) return false;

  const valid = safeEqual(password, expectedPassword);
  if (!valid) return false;

  const expiresAt = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  const secure = process.env.NODE_ENV === "production";
  (await cookies()).set(COOKIE_NAME, `${expiresAt}.${signature(expiresAt, secret)}`, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  });
  return true;
}

export async function signOutAdmin(): Promise<void> {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 0,
  });
}
