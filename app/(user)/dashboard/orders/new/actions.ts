"use server";

import { redirect } from "next/navigation";
import { ensureProfileForUser } from "@/lib/profiles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveProducts } from "@/lib/orders";

export type CreateOrderState = {
  error?: string;
};

const timezoneMap: Record<string, string> = {
  "Asia/Jakarta (WIB)": "Asia/Jakarta",
  "Asia/Makassar (WITA)": "Asia/Makassar",
  "Asia/Jayapura (WIT)": "Asia/Jayapura",
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function generateOrderCode() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const date = `${now.getDate()}`.padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;

  return `ORD-${year}${month}${date}-${random}`;
}

export async function createOrderAction(_: CreateOrderState, formData: FormData): Promise<CreateOrderState> {
  const productId = getStringValue(formData, "product_id");
  const topic = getStringValue(formData, "topic");
  const timezoneLabel = getStringValue(formData, "timezone");
  const startTime = getStringValue(formData, "start_time");

  if (!productId || !topic || !timezoneLabel || !startTime) {
    return { error: "Paket, topik, timezone, dan start time wajib diisi." };
  }

  const timezone = timezoneMap[timezoneLabel];

  if (!timezone) {
    return { error: "Pilihan timezone tidak valid." };
  }

  const [meetingDate, meetingClock] = startTime.split("T");

  if (!meetingDate || !meetingClock) {
    return { error: "Format start time tidak valid." };
  }

  const formattedStartTime = `${meetingClock}:00`;
  const products = await getActiveProducts();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return { error: "Paket yang dipilih tidak tersedia." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session Anda tidak ditemukan. Silakan login kembali." };
  }

  try {
    await ensureProfileForUser(user);
  } catch {
    return { error: "Profil user gagal disiapkan. Coba ulangi beberapa saat lagi." };
  }

  const orderCode = generateOrderCode();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      product_id: product.id,
      order_code: orderCode,
      total_amount: product.price,
    })
    .select("id, order_code")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Gagal membuat order baru." };
  }

  const { error: meetingRequestError } = await supabase.from("meeting_requests").insert({
    order_id: order.id,
    agenda: topic,
    meeting_date: meetingDate,
    start_time: formattedStartTime,
    duration_minutes: product.duration_minutes,
    timezone,
  });

  if (meetingRequestError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: meetingRequestError.message };
  }

  redirect(`/dashboard/orders/${order.order_code}/payment`);
}
