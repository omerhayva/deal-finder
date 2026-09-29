import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { recordClick } from "@/app/actions/clicks";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const product = await getProductById(params.productId);

  if (!product) {
    return NextResponse.redirect(
      new URL("/search", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
    );
  }

  const source = new URL(request.url).searchParams.get("source") ?? undefined;

  // Best-effort click tracking — must never block the redirect
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  recordClick({
    productId: product.id,
    productSlug: product.slug,
    destination: product.etsyUrl,
    source,
  });

  return NextResponse.redirect(product.etsyUrl);
}

export async function HEAD(request: Request, { params }: { params: { productId: string } }) {
  return GET(request, { params });
}
