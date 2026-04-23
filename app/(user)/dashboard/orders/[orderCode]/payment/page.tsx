import Link from "next/link";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent, NbCardDescription, NbCardHeader, NbCardTitle } from "@/components/neo/nb-card";
import { PaydiaPaymentForm } from "@/components/user/paydia-payment-form";
import { requireOrderByCode } from "@/lib/orders";

type OrderPaymentPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function OrderPaymentPage({ params }: OrderPaymentPageProps) {
  const { orderCode } = await params;
  const order = await requireOrderByCode(orderCode);
  const meeting = order.meeting_request;
  const paydiaStatusLabel = order.paydia_status ?? "Belum dibuat";
  const hasPaymentLink = Boolean(order.paydia_payment_url);
  const expiresAtLabel = order.paydia_expires_at
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(order.paydia_expires_at))
    : null;

  return (
    <div className="space-y-6">
      <NbCard className="bg-[#ff8fab] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Flow 2</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">Selesaikan pembayaran order {orderCode}.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Lanjutkan pembayaran melalui Paydia dan pantau statusnya dari halaman ini.</p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Nominal Pembayaran</p>
            <p className="mt-3 text-4xl font-black text-black">Rp{order.total_amount.toLocaleString("id-ID")}</p>
            <p className="mt-2 text-sm leading-6 text-black/75">Gunakan nominal ini saat membuka payment link Paydia.</p>
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
                <p className="mt-2 text-lg font-black text-black">{order.payment_provider ?? "Paydia"}</p>
                <p className="mt-1 text-sm text-black/75">Transaksi dibuat dan dipantau langsung dari data order.</p>
                {expiresAtLabel ? <p className="text-sm text-black/75">Berlaku sampai {expiresAtLabel}</p> : null}
              </div>
              <div className="rounded-[1rem] border-2 border-black bg-[#b8f2e6] p-4 shadow-[4px_4px_0_0_#000]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Status Saat Ini</p>
                <p className="mt-2 text-lg font-black text-black">{order.payment_status}</p>
                <p className="mt-1 text-sm text-black/75">Status Paydia: {paydiaStatusLabel}</p>
                <p className="mt-1 text-sm text-black/75">{meeting ? `${meeting.agenda} • ${meeting.meeting_date}` : "Payment link akan muncul setelah transaksi Paydia dibuat."}</p>
              </div>
            </div>

            <div className="rounded-[1rem] border-2 border-dashed border-black bg-white p-5 text-sm text-black/75 shadow-[4px_4px_0_0_#000]">
              {hasPaymentLink ? (
                <div className="space-y-3">
                  <p>Payment link Paydia sudah tersedia. Lanjutkan pembayaran melalui link di bawah.</p>
                  <NbButton asChild className="bg-[#00d1ff]">
                    <a href={order.paydia_payment_url ?? "#"} target="_blank" rel="noreferrer">
                      Buka Payment Link
                    </a>
                  </NbButton>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>Payment link Paydia belum tersedia.</p>
                  <p>Buat transaksi terlebih dulu agar user mendapatkan link pembayaran dari Paydia.</p>
                  <PaydiaPaymentForm orderId={order.id} hasPaymentLink={hasPaymentLink} />
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
              Buka payment link Paydia
            </div>
            <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
              Selesaikan pembayaran sesuai nominal
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
