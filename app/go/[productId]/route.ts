import { NextResponse } from "next/server";
import { getProductById } from "@/lib/mock-data";

export function GET(_: Request, { params }: { params: { productId: string } }) {
  const product = getProductById(params.productId);
  if (!product) return NextResponse.redirect(new URL("/search", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
  return NextResponse.redirect(product.etsyUrl);
}
