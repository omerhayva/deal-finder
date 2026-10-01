import { randomUUID } from "node:crypto";
import { after, NextResponse } from "next/server";
import { canonicalEtsyUrl } from "@/lib/etsy";
import { getProductById } from "@/lib/products";
import { isSupabaseConfigured } from "@/lib/products/get-store";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function searchRedirect() {
  // Relative Location keeps redirects on the active domain and works behind
  // preview proxies where the internal request host may be 0.0.0.0.
  return new NextResponse(null, { status: 302, headers: { Location: "/search" } });
}

async function findDestination(productId: string): Promise<string | null> {
  const product = await getProductById(productId);
  if (!product) return null;
  return canonicalEtsyUrl(product.etsyUrl, "listing");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;

  try {
    const destination = await findDestination(productId);
    if (!destination) return searchRedirect();

    // Keep the Etsy redirect fast while allowing the hosting runtime to finish
    // this best-effort write after the response has been sent.
    if (isSupabaseConfigured()) {
      after(async () => {
        try {
          const { error } = await getSupabaseAdmin().from("clicks").insert({
            id: randomUUID(),
            product_id: productId,
          });
          if (error) console.error("Click tracking insert failed:", error.message);
        } catch (error) {
          console.error("Click tracking failed:", error);
        }
      });
    }

    return NextResponse.redirect(destination, 302);
  } catch (error) {
    console.error("Outbound deal lookup failed:", error);
    return searchRedirect();
  }
}

export async function HEAD(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    const destination = await findDestination(productId);
    return destination ? NextResponse.redirect(destination, 302) : searchRedirect();
  } catch {
    return searchRedirect();
  }
}
