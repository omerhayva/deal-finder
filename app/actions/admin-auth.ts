"use server";

import { redirect } from "next/navigation";
import { isAdminConfigured, signInAdmin, signOutAdmin } from "@/lib/admin/auth";

export async function loginAdmin(password: string): Promise<{ ok: boolean; configured: boolean }> {
  if (!isAdminConfigured()) return { ok: false, configured: false };
  return { ok: await signInAdmin(password), configured: true };
}

export async function logoutAdmin(): Promise<void> {
  await signOutAdmin();
  redirect("/admin/login");
}
