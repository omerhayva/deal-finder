"use client";

import { useState } from "react";

export function CouponBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { setCopied(true); } };
  return <button onClick={copy} className="group flex items-center gap-2 rounded-lg border border-dashed border-coral/50 bg-[#fff7f3] px-3 py-2 text-left text-xs font-semibold text-coral" title="Copy coupon code"><span className="rounded bg-coral/10 px-1.5 py-0.5 tracking-wide">{code}</span><span className="text-coral/70 group-hover:text-coral">{copied ? "Copied" : "Copy"}</span></button>;
}
