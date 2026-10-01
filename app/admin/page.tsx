import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminIndexPage() {
  redirect(await isAdminAuthenticated() ? "/admin/products" : "/admin/login");
}
