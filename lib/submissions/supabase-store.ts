import "server-only";

import type { Submission, SubmissionStatus } from "./types";
import type { SubmissionStore } from "./store";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function dateOnly(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function isoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function mapRowToSubmission(row: Record<string, unknown>): Submission {
  return {
    id: String(row.id),
    sellerShopUrl: String(row.seller_shop_url),
    productUrl: String(row.product_url),
    title: String(row.title),
    imageUrl: row.image_url ? String(row.image_url) : undefined,
    originalPrice: Number(row.original_price),
    discountedPrice: Number(row.discounted_price),
    couponCode: row.coupon_code ? String(row.coupon_code) : undefined,
    expiresAt: dateOnly(row.expires_at),
    category: String(row.category),
    description: row.description ? String(row.description) : undefined,
    status: row.status as SubmissionStatus,
    createdAt: isoDate(row.created_at) ?? new Date().toISOString(),
    approvedAt: isoDate(row.approved_at),
    consentAcceptedAt: isoDate(row.consent_accepted_at),
  };
}

export class SupabaseSubmissionStore implements SubmissionStore {
  async create(submission: Submission): Promise<void> {
    const { error } = await getSupabaseAdmin().from("submissions").insert({
      id: submission.id,
      seller_shop_url: submission.sellerShopUrl,
      product_url: submission.productUrl,
      title: submission.title,
      image_url: submission.imageUrl ?? null,
      original_price: submission.originalPrice,
      discounted_price: submission.discountedPrice,
      coupon_code: submission.couponCode ?? null,
      expires_at: submission.expiresAt ?? null,
      category: submission.category,
      description: submission.description ?? null,
      status: submission.status,
      consent_accepted_at: submission.consentAcceptedAt ?? new Date().toISOString(),
      created_at: submission.createdAt,
    });

    if (error) throw new Error(`Supabase submission insert failed: ${error.message}`);
  }

  async getAll(): Promise<readonly Submission[]> {
    const { data, error } = await getSupabaseAdmin()
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Supabase submission select failed: ${error.message}`);
    return (data ?? []).map((row) => mapRowToSubmission(row as Record<string, unknown>));
  }

  async getById(id: string): Promise<Submission | undefined> {
    const { data, error } = await getSupabaseAdmin()
      .from("submissions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Supabase submission select failed: ${error.message}`);
    return data ? mapRowToSubmission(data as Record<string, unknown>) : undefined;
  }

  async getFirstApprovedAtForShop(shopUrl: string): Promise<string | undefined> {
    const { data, error } = await getSupabaseAdmin()
      .from("submissions")
      .select("approved_at")
      .eq("seller_shop_url", shopUrl)
      .eq("status", "approved")
      .not("approved_at", "is", null)
      .order("approved_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`Supabase seller trial lookup failed: ${error.message}`);
    return data?.approved_at ? isoDate(data.approved_at) : undefined;
  }

  async updateStatus(id: string, status: SubmissionStatus): Promise<void> {
    const { data, error } = await getSupabaseAdmin()
      .from("submissions")
      .update({ status, approved_at: status === "approved" ? new Date().toISOString() : null })
      .eq("id", id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (error) throw new Error(`Supabase submission update failed: ${error.message}`);
    if (!data) throw new Error("Submission not found or no longer pending.");
  }
}
