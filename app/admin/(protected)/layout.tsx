import type { ReactNode } from "react";
import { AdminBar } from "@/components/AdminBar";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <><AdminBar />{children}</>;
}
