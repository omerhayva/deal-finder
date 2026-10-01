"use client";

import { useState } from "react";
import { useLanguage } from "./LocaleProvider";

function clipboardWriteAllowed(): boolean {
  // Arena's live preview is cross-origin framed; avoid invoking an API that
  // its iframe Permissions Policy intentionally denies.
  if (window.self !== window.top) return false;

  const documentWithPolicy = document as Document & {
    permissionsPolicy?: { allowsFeature?: (feature: string) => boolean };
    featurePolicy?: { allowsFeature?: (feature: string) => boolean };
  };
  const policy = documentWithPolicy.permissionsPolicy ?? documentWithPolicy.featurePolicy;
  try {
    return policy?.allowsFeature ? policy.allowsFeature("clipboard-write") : true;
  } catch {
    return false;
  }
}

function legacyCopy(text: string): boolean {
  let field: HTMLTextAreaElement | undefined;
  try {
    field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    field.style.pointerEvents = "none";
    document.body.appendChild(field);
    field.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field?.remove();
  }
}

export function CouponBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const { t } = useLanguage();

  const copy = async () => {
    setCopied(false);
    setCopyFailed(false);

    if (navigator.clipboard?.writeText && clipboardWriteAllowed()) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
        return;
      } catch {
        // Some embedded previews deny clipboard-write through Permissions Policy.
      }
    }

    if (legacyCopy(code)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } else {
      // The coupon remains visible so it can still be selected and copied by hand.
      setCopyFailed(true);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex items-center gap-2 rounded-lg border border-dashed border-coral/50 bg-[#fff7f3] px-3 py-2 text-left text-xs font-semibold text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
      title={copyFailed ? t("product.copyUnavailable") : t("product.copyCoupon")}
      aria-label={`${t("product.copyCoupon")}: ${code}`}
    >
      <span className="rounded bg-coral/10 px-1.5 py-0.5 tracking-wide">{code}</span>
      <span aria-live="polite" className="text-coral/70 group-hover:text-coral">
        {copied ? t("product.copied") : copyFailed ? t("product.copyUnavailable") : t("product.copy")}
      </span>
    </button>
  );
}
