import Link from "next/link";

export function Footer() {
  return <footer className="border-t border-ink/10 bg-white">
    <div className="container-shell flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">
      <div><Link href="/" className="font-display text-xl">Deal<span className="text-coral">Finder</span></Link><p className="mt-2 max-w-xs text-sm leading-6 text-muted">İndirimli ürünleri ve fırsatları keşfetmenin sade yolu.</p></div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-muted sm:grid-cols-4">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">Keşfet</p><Link href="/" className="block hover:text-ink">Ana Sayfa</Link><Link href="/submit" className="mt-2 block hover:text-ink">Fırsat Gönder</Link></div>
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">Bilgi</p><Link href="/about" className="block hover:text-ink">Hakkımızda</Link><Link href="/faq" className="mt-2 block hover:text-ink">SSS</Link><Link href="/contact" className="mt-2 block hover:text-ink">İletişim</Link></div>
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">Yasal</p><Link href="/privacy" className="block hover:text-ink">Gizlilik Politikası</Link><Link href="/terms" className="mt-2 block hover:text-ink">Kullanım Koşulları</Link></div>
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">Explore</p><Link href="/search" className="block hover:text-ink">Deals</Link><Link href="/search?category=Home%20Decor" className="mt-2 block hover:text-ink">Categories</Link></div>
      </div>
    </div>
    <div className="container-shell border-t border-ink/10 py-5 text-xs text-muted">© 2026 DealFinder. Bağımsız satıcılar, daha iyi keşfler.</div>
  </footer>;
}
