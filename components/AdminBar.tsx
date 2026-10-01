import Link from "next/link";
import { logoutAdmin } from "@/app/actions/admin-auth";
import { LocalizedText } from "@/components/LocalizedText";

export function AdminBar() {
  return (
    <div className="border-b border-ink/10 bg-white">
      <div className="container-shell flex min-h-12 items-center justify-between gap-4">
        <nav aria-label="Admin" className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/admin/products" className="hover:text-coral"><LocalizedText id="admin.products" /></Link>
          <Link href="/admin/submissions" className="hover:text-coral"><LocalizedText id="admin.submissions" /></Link>
        </nav>
        <form action={logoutAdmin}>
          <button type="submit" className="text-sm font-semibold text-muted hover:text-coral">
            <LocalizedText id="admin.signOut" />
          </button>
        </form>
      </div>
    </div>
  );
}
