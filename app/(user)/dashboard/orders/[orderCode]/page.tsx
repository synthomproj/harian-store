import Link from "next/link";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent, NbCardDescription, NbCardHeader, NbCardTitle } from "@/components/neo/nb-card";
import { requireOrderByCode } from "@/lib/orders";

type OrderDetailPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderCode } = await params;
  const order = await requireOrderByCode(orderCode);
  const paymentStatusLabel = order.payment_status === "unpaid" ? "Menunggu Pembayaran" : order.payment_status;

  return (
    <div className="space-y-6">
      <NbCard className="bg-[#b8f2e6] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Flow 3</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">Status pembayaran order {orderCode}.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Cek progres pembayaran Anda di sini.</p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Status</p>
            <p className="mt-3 text-3xl font-black text-black">{paymentStatusLabel}</p>
            <p className="mt-2 text-sm leading-6 text-black/75">Order {order.order_code} saat ini berstatus {order.status}.</p>
          </div>
        </div>
      </NbCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <NbCard className="bg-[#fffbef]">
          <NbCardHeader>
            <NbCardTitle>Progress Pembayaran</NbCardTitle>
            <NbCardDescription>Lihat status order Anda secara singkat.</NbCardDescription>
          </NbCardHeader>
          <NbCardContent className="space-y-4">
            <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">1. Order Dibuat</p>
              <p className="mt-2 text-sm leading-6 text-black/75">{order.meeting_request?.agenda ?? "Order sudah dibuat."}</p>
            </div>
            <div className="rounded-[1rem] border-2 border-black bg-[#ffe066] p-4 shadow-[4px_4px_0_0_#000]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">2. Bukti Pembayaran Dikirim</p>
              <p className="mt-2 text-sm leading-6 text-black/75">Status pembayaran: {order.payment_status}.</p>
            </div>
            <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">3. Meeting Diproses</p>
              <p className="mt-2 text-sm leading-6 text-black/75">Status provisioning: {order.provisioning_status}.</p>
            </div>
          </NbCardContent>
        </NbCard>

        <NbCard className="bg-[#ff8fab] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Aksi Cepat</p>
          <div className="mt-4 space-y-3">
            <NbButton asChild className="w-full bg-white">
              <Link href={`/dashboard/orders/${orderCode}/payment`}>Kembali ke Pembayaran</Link>
            </NbButton>
            <NbButton asChild variant="neutral" className="w-full bg-[#00d1ff]">
              <Link href={order.meeting ? `/dashboard/meeting/${order.meeting.id}` : "/dashboard/meeting"}>Lihat Status Meeting</Link>
            </NbButton>
          </div>
        </NbCard>
      </div>
    </div>
  );
}
