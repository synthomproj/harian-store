import Image from "next/image";
import Link from "next/link";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent, NbCardDescription, NbCardHeader, NbCardTitle } from "@/components/neo/nb-card";
import { PaydiaPaymentForm } from "@/components/user/paydia-payment-form";
import { PaydiaStatusRefreshForm } from "@/components/user/paydia-status-refresh-form";
import { requireOrderByCode } from "@/lib/orders";

type OrderPaymentPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function OrderPaymentPage({ params }: OrderPaymentPageProps) {
  const { orderCode } = await params;
  const order = await requireOrderByCode(orderCode);
  const meeting = order.meeting_request;
  const paydiaStatusLabel = order.paydia_status_desc ? `${order.paydia_status} • ${order.paydia_status_desc}` : order.paydia_status ?? "Belum dibuat";
  const hasQrContent = Boolean(order.paydia_qr_content);
  const expiresAtLabel = order.paydia_expires_at
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(order.paydia_expires_at))
    : null;
  const qrImageUrl = order.paydia_qr_content
    ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(order.paydia_qr_content)}`
    : null;

  return (
    <div className="space-y-6">
      <NbCard className="bg-[#ff8fab] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Flow 2</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">Selesaikan pembayaran order {orderCode}.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Buat QRIS Paydia, scan dari e-wallet atau mobile banking, lalu pantau statusnya dari halaman ini.</p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Nominal Pembayaran</p>
            <p className="mt-3 text-4xl font-black text-black">Rp{order.total_amount.toLocaleString("id-ID")}</p>
            <p className="mt-2 text-sm leading-6 text-black/75">Nominal QRIS harus sama persis dengan total order.</p>
          </div>
        </div>
      </NbCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <NbCard className="bg-[#fffbef]">
          <NbCardHeader>
            <NbCardTitle>Instruksi Pembayaran</NbCardTitle>
            <NbCardDescription>Ikuti langkah singkat di bawah ini.</NbCardDescription>
          </NbCardHeader>
          <NbCardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Payment Provider</p>
                <p className="mt-2 text-lg font-black text-black">{order.payment_provider ?? "Paydia SNAP QRIS"}</p>
                <p className="mt-1 text-sm text-black/75">QRIS MPM dibuat dari order ini dan statusnya akan diupdate dari Paydia.</p>
                {expiresAtLabel ? <p className="text-sm text-black/75">Berlaku sampai {expiresAtLabel}</p> : null}
              </div>
              <div className="rounded-[1rem] border-2 border-black bg-[#b8f2e6] p-4 shadow-[4px_4px_0_0_#000]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Status Saat Ini</p>
                <p className="mt-2 text-lg font-black text-black">{order.payment_status}</p>
                <p className="mt-1 text-sm text-black/75">Status Paydia: {paydiaStatusLabel}</p>
                <p className="mt-1 text-sm text-black/75">{meeting ? `${meeting.agenda} • ${meeting.meeting_date}` : "QRIS akan muncul setelah transaksi Paydia berhasil dibuat."}</p>
              </div>
            </div>

            <div className="rounded-[1rem] border-2 border-dashed border-black bg-white p-5 text-sm text-black/75 shadow-[4px_4px_0_0_#000]">
              {hasQrContent ? (
                <div className="space-y-3">
                  <p>QRIS Paydia sudah tersedia. Scan QR di bawah ini dari aplikasi pembayaran Anda.</p>
                  {qrImageUrl ? (
                    <div className="flex justify-center rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                      <Image src={qrImageUrl} alt={`QRIS order ${order.order_code}`} width={320} height={320} className="h-72 w-72 max-w-full object-contain" unoptimized />
                    </div>
                  ) : null}
                  <div className="overflow-x-auto rounded-[1rem] border-2 border-black bg-[#fff7cf] p-4 font-mono text-xs leading-6 text-black shadow-[4px_4px_0_0_#000]">
                    {order.paydia_qr_content}
                  </div>
                  {order.paydia_reference_no ? <p>Reference Paydia: {order.paydia_reference_no}</p> : null}
                  <PaydiaStatusRefreshForm orderId={order.id} />
                </div>
              ) : (
                <div className="space-y-2">
                  <p>QRIS Paydia belum tersedia.</p>
                  <p>Buat QRIS terlebih dulu agar order ini bisa dibayar lewat SNAP QRIS MPM.</p>
                  <PaydiaPaymentForm orderId={order.id} hasQrContent={hasQrContent} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <NbButton asChild className="bg-[#00d1ff] sm:min-w-44">
                <Link href={`/dashboard/orders/${orderCode}`}>Lihat Status Pembayaran</Link>
              </NbButton>
              <NbButton asChild variant="neutral">
                <Link href="/dashboard/orders/new">Ubah Detail Meeting</Link>
              </NbButton>
            </div>
          </NbCardContent>
        </NbCard>

        <NbCard className="bg-[#ffe066] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Checklist</p>
          <div className="mt-4 space-y-3 text-sm text-black/80">
            <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
              Buat QRIS Paydia
            </div>
            <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
              Scan QRIS dan selesaikan pembayaran
            </div>
            <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
              Lanjut cek update status pembayaran
            </div>
          </div>
        </NbCard>
      </div>
    </div>
  );
}
