import { cache } from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OrderRecord = {
  id: string;
  order_code: string;
  status: string;
  payment_status: string;
  provisioning_status: string;
  total_amount: number;
  created_at: string;
  product: {
    id: string;
    name: string;
    duration_minutes: number;
    participant_limit: number | null;
  } | null;
  meeting_request: {
    agenda: string;
    meeting_date: string;
    start_time: string;
    duration_minutes: number;
    timezone: string;
  } | null;
  zoom_meeting: {
    join_url: string | null;
    status: string;
  } | null;
};

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration_minutes: number;
  participant_limit: number | null;
  is_active: boolean;
};

export const getActiveProducts = cache(async (): Promise<ProductRecord[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, duration_minutes, participant_limit, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  return (data as ProductRecord[] | null) ?? [];
});

export const getPrimaryActiveProduct = cache(async () => {
  const products = await getActiveProducts();
  return products[0] ?? null;
});

export const getOrderByCode = cache(async (orderCode: string): Promise<OrderRecord | null> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_code,
        status,
        payment_status,
        provisioning_status,
        total_amount,
        created_at,
        product:products (id, name, duration_minutes, participant_limit),
        meeting_request:meeting_requests (agenda, meeting_date, start_time, duration_minutes, timezone),
        zoom_meeting:zoom_meetings (join_url, status)
      `,
    )
    .eq("order_code", orderCode)
    .maybeSingle();

  return (data as OrderRecord | null) ?? null;
});

export async function requireOrderByCode(orderCode: string) {
  const order = await getOrderByCode(orderCode);

  if (!order) {
    notFound();
  }

  return order;
}
