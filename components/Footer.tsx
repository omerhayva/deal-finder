import Link from "next/link";

export function Footer() {
  return <footer className="border-t border-ink/10 bg-white">
    <div className="container-shell flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">
      <div><Link href="/" className="font-display text-xl">Deal<span className="text-coral">Finder</span></Link><p className="mt-2 max-w-xs text-sm leading-6 text-muted">A calmer way to discover thoughtful products, better prices, and active coupons.</p></div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-muted sm:grid-cols-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">Explore</p><Link href="/search" className="block hover:text-ink">Deals</Link><Link href="/search?category=Home%20Decor" className="mt-2 block hover:text-ink">Categories</Link></div><div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">For Sellers</p><Link href="/submit" className="block hover:text-ink">Submit a deal</Link><Link href="/advertise" className="mt-2 block hover:text-ink">Advertise</Link></div><div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">Support</p><Link href="/contact" className="block hover:text-ink">Contact</Link><Link href="/faq" className="mt-2 block hover:text-ink">FAQ</Link></div><div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">Legal</p><Link href="/privacy" className="block hover:text-ink">Privacy</Link><Link href="/terms" className="mt-2 block hover:text-ink">Terms</Link></div></div>
    </div>
    <div className="container-shell border-t border-ink/10 py-5 text-xs text-muted">© 2026 DealFinder. Independent makers, better finds.</div>
  </footer>;
}
