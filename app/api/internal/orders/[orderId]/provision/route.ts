import { NextResponse } from "next/server";

type ProvisionRouteProps = {
  params: Promise<{ orderId: string }>;
};

export async function POST(_: Request, { params }: ProvisionRouteProps) {
  const { orderId } = await params;

  return NextResponse.json({
    ok: true,
    message: "Provision trigger placeholder",
    orderId,
  });
}
