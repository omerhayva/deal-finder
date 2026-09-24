"use client";

import { FormEvent, useState } from "react";

const fields = [
  ["shopName", "Shop Name", "text"], ["shopUrl", "Etsy Shop URL", "url"], ["productUrl", "Product URL", "url"], ["title", "Product Title", "text"], ["imageUrl", "Image URL", "url"], ["price", "Normal Price", "number"], ["discountedPrice", "Discounted Price", "number"], ["couponCode", "Coupon Code", "text"], ["discountPercent", "Discount %", "number"], ["expiresAt", "Expiration Date", "date"], ["category", "Category", "text"], ["email", "Seller Email", "email"],
] as const;

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); event.currentTarget.reset(); };
  return <section className="container-shell py-12 sm:py-20"><div className="mx-auto max-w-3xl"><p className="eyebrow">Share the good stuff</p><h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">Submit a deal.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-muted">Know a discounted product or active coupon that deserves to be discovered? Send it our way.</p>{submitted ? <div className="mt-10 rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900"><p className="font-semibold">Your deal has been submitted for review.</p><p className="mt-1 text-sm">Thanks for helping the community find something good.</p><button onClick={() => setSubmitted(false)} className="mt-5 text-sm font-semibold underline">Submit another deal</button></div> : <form onSubmit={handleSubmit} className="mt-10 rounded-3xl bg-white p-6 shadow-soft sm:p-10"><div className="grid gap-5 sm:grid-cols-2">{fields.map(([name, label, type]) => <label key={name} className={name === "title" || name === "imageUrl" ? "sm:col-span-2" : ""}><span className="mb-2 block text-sm font-semibold">{label}</span><input required name={name} type={type} min={type === "number" ? "0" : undefined} step={name.includes("Price") ? "0.01" : undefined} className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10" /></label>)}</div><button type="submit" className="button-primary mt-8 w-full sm:w-auto">Submit for review <span className="ml-2">→</span></button><p className="mt-4 text-xs leading-5 text-muted">By submitting, you confirm the details are accurate and the links are publicly accessible.</p></form>}</div></section>;
}
