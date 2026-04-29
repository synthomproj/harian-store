import { NextResponse } from "next/server";
import { parsePaydiaNotifyPayload, verifyPaydiaWebhookSignature } from "@/lib/paydia";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PaydiaNotifyBody = {
  originalPartnerReferenceNo?: string;
  originalReferenceNo?: string;
  latestTransactionStatus?: string;
  transactionStatusDesc?: string;
  createdTime?: string;
  finishedTime?: string;
  amount?: {
    value?: string;
    currency?: string;
  };
  additionalInfo?: Record<string, unknown>;
};

function getHeader(request: Request, name: string) {
  return request.headers.get(name) ?? request.headers.get(name.toLowerCase()) ?? "";
}

async function insertWebhookLog(input: {
  orderId?: string | null;
  status?: "pending" | "success" | "failed";
  eventType: string;
  payload: Record<string, unknown>;
  errorMessage?: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  await supabase.from("webhook_logs").insert({
    order_id: input.orderId ?? null,
    source: "paydia",
    event_type: input.eventType,
    direction: "inbound",
    status: input.status ?? "pending",
    payload: input.payload,
    error_message: input.errorMessage ?? null,
  });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = getHeader(request, "X-SIGNATURE");
  const timestamp = getHeader(request, "X-TIMESTAMP");

  if (!signature || !timestamp) {
    await insertWebhookLog({
      eventType: "paydia_qris_missing_signature",
      status: "failed",
      payload: {
        rawBody,
      },
      errorMessage: "Missing required signature headers",
    });

    return NextResponse.json(
      {
        responseCode: "5005202",
        responseMessage: "Missing required signature headers",
      },
      { status: 400 },
    );
  }

  const isValidSignature = verifyPaydiaWebhookSignature(signature, timestamp, rawBody);

  if (!isValidSignature) {
    await insertWebhookLog({
      eventType: "paydia_qris_invalid_signature",
      status: "failed",
      payload: {
        rawBody,
        timestamp,
      },
      errorMessage: "Invalid signature",
    });

    return NextResponse.json(
      {
        responseCode: "5005202",
        responseMessage: "Invalid signature",
      },
      { status: 401 },
    );
  }

  let payload: PaydiaNotifyBody;

  try {
    payload = JSON.parse(rawBody) as PaydiaNotifyBody;
  } catch {
    await insertWebhookLog({
      eventType: "paydia_qris_invalid_json",
      status: "failed",
      payload: {
        rawBody,
        timestamp,
      },
      errorMessage: "Invalid JSON body",
    });

    return NextResponse.json(
      {
        responseCode: "5005202",
        responseMessage: "Invalid JSON body",
      },
      { status: 400 },
    );
  }

  const normalizedPayload = parsePaydiaNotifyPayload(payload);

  if (!normalizedPayload.partnerReferenceNo && !normalizedPayload.referenceNo) {
    await insertWebhookLog({
      eventType: "paydia_qris_missing_reference",
      status: "failed",
      payload: {
        timestamp,
        notify: payload,
      },
      errorMessage: "Transaction reference not found",
    });

    return NextResponse.json(
      {
        responseCode: "5005202",
        responseMessage: "Transaction reference not found",
      },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("orders")
    .select("id, order_code, status, payment_status, paydia_status, paydia_paid_at, paydia_payload")
    .limit(1);

  if (normalizedPayload.referenceNo) {
    query = query.eq("paydia_reference_no", normalizedPayload.referenceNo);
  } else if (normalizedPayload.partnerReferenceNo) {
    query = query.eq("paydia_partner_reference_no", normalizedPayload.partnerReferenceNo);
  }

  const { data: order, error: orderError } = await query.maybeSingle();

  if (orderError || !order) {
    await insertWebhookLog({
      eventType: "paydia_qris_order_not_found",
      status: "failed",
      payload: {
        timestamp,
        notify: payload,
        normalized: normalizedPayload,
      },
      errorMessage: "Order not found",
    });

    return NextResponse.json(
      {
        responseCode: "5005202",
        responseMessage: "Order not found",
      },
      { status: 404 },
    );
  }

  const mergedPayload = {
    previous: order.paydia_payload,
    notify: payload,
  };

  const isDuplicateDelivery =
    order.paydia_status === normalizedPayload.latestTransactionStatus &&
    order.payment_status === normalizedPayload.paymentStatus &&
    order.status === normalizedPayload.orderStatus &&
    (order.paydia_paid_at ?? null) === (normalizedPayload.paidAt ?? null);

  if (isDuplicateDelivery) {
    await insertWebhookLog({
      orderId: order.id,
      eventType: "paydia_qris_duplicate_delivery",
      status: "success",
      payload: {
        timestamp,
        notify: payload,
        normalized: normalizedPayload,
      },
    });

    return NextResponse.json({
      responseCode: "2005200",
      responseMessage: "Successful",
    });
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      paydia_partner_reference_no: normalizedPayload.partnerReferenceNo,
      paydia_reference_no: normalizedPayload.referenceNo,
      paydia_status: normalizedPayload.latestTransactionStatus,
      paydia_status_desc: normalizedPayload.transactionStatusDesc,
      paydia_paid_at: normalizedPayload.paidAt,
      paydia_payload: mergedPayload,
      payment_status: normalizedPayload.paymentStatus,
      status: normalizedPayload.orderStatus,
    })
    .eq("id", order.id);

  if (updateError) {
    await insertWebhookLog({
      orderId: order.id,
      eventType: "paydia_qris_update_failed",
      status: "failed",
      payload: {
        timestamp,
        notify: payload,
        normalized: normalizedPayload,
      },
      errorMessage: updateError.message,
    });

    return NextResponse.json(
      {
        responseCode: "5005202",
        responseMessage: updateError.message,
      },
      { status: 500 },
    );
  }

  await insertWebhookLog({
    orderId: order.id,
    eventType: "paydia_qris_processed",
    status: "success",
    payload: {
      timestamp,
      notify: payload,
      normalized: normalizedPayload,
    },
  });

  return NextResponse.json({
    responseCode: "2005200",
    responseMessage: "Successful",
  });
}
