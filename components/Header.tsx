import Link from "next/link";

export function Header() {
  return <header className="border-b border-ink/10 bg-canvas/90 backdrop-blur">
    <div className="container-shell flex h-20 items-center justify-between gap-6">
      <Link href="/" className="font-display text-2xl tracking-tight">Deal<span className="text-coral">Finder</span></Link>
      <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
        <Link className="transition hover:text-ink" href="/search">Deals</Link>
        <Link className="transition hover:text-ink" href="/search?category=Home%20Decor">Categories</Link>
        <Link className="transition hover:text-ink" href="/advertise">Advertise</Link>
        <Link className="transition hover:text-ink" href="/submit">Submit a Deal</Link>
      </nav>
      <Link href="/search" aria-label="Search deals" className="button-secondary px-4 py-2.5"><span className="mr-2">⌕</span><span className="hidden sm:inline">Search deals</span></Link>
    </div>
  </header>;
}
