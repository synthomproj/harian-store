"use server";

import { revalidatePath } from "next/cache";
import { generatePaydiaQris, inquirePaydiaQrisStatus, mapPaydiaSnapStatus } from "@/lib/paydia";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreatePaydiaPaymentState = {
  error?: string;
  success?: string;
};

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
    .select("id, order_code, user_id, total_amount, payment_status, paydia_reference_no")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return { error: "Order tidak ditemukan atau tidak bisa diakses." };
  }

  if (order.paydia_reference_no) {
    return { success: "QRIS Paydia untuk order ini sudah pernah dibuat." };
  }

  let generatedQr: Awaited<ReturnType<typeof generatePaydiaQris>>;

  try {
    generatedQr = await generatePaydiaQris({
      orderCode: order.order_code,
      totalAmount: order.total_amount,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal membuat QRIS Paydia.",
    };
  }

  const responseBody = generatedQr.responseBody;
  const snapStatus = mapPaydiaSnapStatus("01");

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      payment_provider: "paydia",
      paydia_transaction_id: responseBody.referenceNo ?? order.order_code,
      paydia_partner_reference_no: responseBody.partnerReferenceNo ?? order.order_code,
      paydia_reference_no: responseBody.referenceNo ?? null,
      paydia_qr_content: responseBody.qrContent ?? null,
      paydia_status: "01",
      paydia_status_desc: "Initiated",
      paydia_expires_at: generatedQr.validityPeriod,
      paydia_payload: responseBody,
      payment_status: snapStatus.paymentStatus,
      status: snapStatus.orderStatus,
    })
    .eq("id", order.id)
    .eq("user_id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/dashboard/orders/${order.order_code}/payment`);
  revalidatePath(`/dashboard/orders/${order.order_code}`);

  return { success: "QRIS Paydia berhasil dibuat." };
}

export async function refreshPaydiaPaymentStatusAction(
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
    .select("id, order_code, user_id, paydia_partner_reference_no, paydia_reference_no, paydia_payload")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return { error: "Order tidak ditemukan atau tidak bisa diakses." };
  }

  let inquiryResponse: Awaited<ReturnType<typeof inquirePaydiaQrisStatus>>;

  try {
    inquiryResponse = await inquirePaydiaQrisStatus({
      partnerReferenceNo: order.paydia_partner_reference_no,
      referenceNo: order.paydia_reference_no,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal mengambil status QRIS Paydia.",
    };
  }

  const mappedStatus = mapPaydiaSnapStatus(inquiryResponse.latestTransactionStatus ?? null);
  const paidTime = typeof inquiryResponse.additionalInfo?.paidTime === "string" ? inquiryResponse.additionalInfo.paidTime : null;

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      paydia_partner_reference_no: inquiryResponse.originalPartnerReferenceNo ?? order.paydia_partner_reference_no,
      paydia_reference_no: inquiryResponse.originalReferenceNo ?? order.paydia_reference_no,
      paydia_status: inquiryResponse.latestTransactionStatus ?? null,
      paydia_status_desc: inquiryResponse.transactionStatusDesc ?? null,
      paydia_paid_at: paidTime,
      paydia_payload: {
        previous: order.paydia_payload,
        inquiry: inquiryResponse,
      },
      payment_status: mappedStatus.paymentStatus,
      status: mappedStatus.orderStatus,
    })
    .eq("id", order.id)
    .eq("user_id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/dashboard/orders/${order.order_code}/payment`);
  revalidatePath(`/dashboard/orders/${order.order_code}`);

  return { success: "Status pembayaran berhasil diperbarui." };
}
