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

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = getHeader(request, "X-SIGNATURE");
  const timestamp = getHeader(request, "X-TIMESTAMP");

  if (!signature || !timestamp) {
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
    return NextResponse.json(
      {
        responseCode: "5005202",
        responseMessage: "Transaction reference not found",
      },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  let query = supabase.from("orders").select("id, order_code, paydia_payload").limit(1);

  if (normalizedPayload.referenceNo) {
    query = query.eq("paydia_reference_no", normalizedPayload.referenceNo);
  } else if (normalizedPayload.partnerReferenceNo) {
    query = query.eq("paydia_partner_reference_no", normalizedPayload.partnerReferenceNo);
  }

  const { data: order, error: orderError } = await query.maybeSingle();

  if (orderError || !order) {
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
    return NextResponse.json(
      {
        responseCode: "5005202",
        responseMessage: updateError.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    responseCode: "2005200",
    responseMessage: "Successful",
  });
}
