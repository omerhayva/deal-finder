import Link from "next/link";

export default function NotFound() { return <section className="container-shell py-24 text-center"><p className="eyebrow">404</p><h1 className="mt-4 font-display text-5xl">That deal wandered off.</h1><p className="mx-auto mt-4 max-w-md text-muted">The product you’re looking for may have expired or moved.</p><Link href="/search" className="button-primary mt-8">Browse current deals</Link></section>; }
