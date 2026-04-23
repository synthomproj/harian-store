"use server";

import { revalidatePath } from "next/cache";
import { getPaydiaEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreatePaydiaPaymentState = {
  error?: string;
  success?: string;
};

function mapInitialPaymentStatus(status: string | null) {
  if (!status) {
    return "pending";
  }

  const normalizedStatus = status.toLowerCase();

  if (["paid", "settled", "success", "approved"].includes(normalizedStatus)) {
    return "approved";
  }

  if (["failed", "expired", "cancelled", "canceled", "rejected"].includes(normalizedStatus)) {
    return "rejected";
  }

  return "pending";
}

export async function createPaydiaPaymentAction(
  _: CreatePaydiaPaymentState,
  formData: FormData,
): Promise<CreatePaydiaPaymentState> {
  const orderId = formData.get("order_id");

  if (typeof orderId !== "string" || !orderId) {
    return { error: "Order tidak valid." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session Anda tidak ditemukan. Silakan login kembali." };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_code, user_id, total_amount, payment_status, paydia_transaction_id")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return { error: "Order tidak ditemukan atau tidak bisa diakses." };
  }

  if (order.paydia_transaction_id) {
    return { success: "Transaksi Paydia untuk order ini sudah pernah dibuat." };
  }

  let apiUrl: string;
  let apiKey: string;

  try {
    ({ apiUrl, apiKey } = getPaydiaEnv());
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Konfigurasi Paydia belum lengkap.",
    };
  }

  const payload = {
    orderCode: order.order_code,
    amount: order.total_amount,
  };

  let response: Response;

  try {
    response = await fetch(`${apiUrl.replace(/\/$/, "")}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return { error: "Gagal terhubung ke layanan Paydia." };
  }

  const responseBody = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok || !responseBody) {
    return { error: "Paydia gagal membuat transaksi baru." };
  }

  const transactionId = typeof responseBody.transaction_id === "string" ? responseBody.transaction_id : null;
  const paymentUrl = typeof responseBody.payment_url === "string" ? responseBody.payment_url : null;
  const paydiaStatus = typeof responseBody.status === "string" ? responseBody.status : null;
  const expiresAt = typeof responseBody.expires_at === "string" ? responseBody.expires_at : null;

  if (!transactionId) {
    return { error: "Respons Paydia tidak memiliki transaction id." };
  }

  const nextPaymentStatus = mapInitialPaymentStatus(paydiaStatus);
  const nextOrderStatus = nextPaymentStatus === "approved" ? "paid" : "pending_payment";

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      payment_provider: "paydia",
      paydia_transaction_id: transactionId,
      paydia_payment_url: paymentUrl,
      paydia_status: paydiaStatus,
      paydia_expires_at: expiresAt,
      paydia_payload: responseBody,
      payment_status: nextPaymentStatus,
      status: nextOrderStatus,
    })
    .eq("id", order.id)
    .eq("user_id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/dashboard/orders/${order.order_code}/payment`);
  revalidatePath(`/dashboard/orders/${order.order_code}`);

  return { success: "Transaksi Paydia berhasil dibuat." };
}
