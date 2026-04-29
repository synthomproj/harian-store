import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ProvisionRouteProps = {
  params: Promise<{ orderId: string }>;
};

export async function POST(_: Request, { params }: ProvisionRouteProps) {
  const { orderId } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, order_code, payment_status, status, provisioning_status")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json(
      {
        ok: false,
        message: "Order tidak ditemukan.",
        orderId,
      },
      { status: 404 },
    );
  }

  if (order.payment_status !== "approved" || order.status !== "paid") {
    return NextResponse.json(
      {
        ok: false,
        message: "Provisioning hanya bisa dijalankan untuk order yang sudah dibayar.",
        orderId,
        paymentStatus: order.payment_status,
        orderStatus: order.status,
      },
      { status: 409 },
    );
  }

  if (!["not_started", "queued"].includes(order.provisioning_status)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Provisioning untuk order ini sudah pernah dijalankan atau sedang diproses.",
        orderId,
        provisioningStatus: order.provisioning_status,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Provision trigger placeholder",
    orderId,
    orderCode: order.order_code,
  });
}
