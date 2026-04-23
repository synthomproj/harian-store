import Link from "next/link";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent, NbCardDescription, NbCardHeader, NbCardTitle } from "@/components/neo/nb-card";
import { requireOrderByCode } from "@/lib/orders";

type OrderPaymentPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function OrderPaymentPage({ params }: OrderPaymentPageProps) {
  const { orderCode } = await params;
  const order = await requireOrderByCode(orderCode);
  const meeting = order.meeting_request;

  return (
    <div className="space-y-6">
      <NbCard className="bg-[#ff8fab] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Flow 2</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">Selesaikan pembayaran order {orderCode}.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Transfer lalu unggah bukti pembayaran.</p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Nominal Transfer</p>
            <p className="mt-3 text-4xl font-black text-black">Rp{order.total_amount.toLocaleString("id-ID")}</p>
            <p className="mt-2 text-sm leading-6 text-black/75">Transfer sesuai nominal.</p>
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
                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Bank Tujuan</p>
                <p className="mt-2 text-lg font-black text-black">BCA</p>
                <p className="mt-1 text-sm text-black/75">1234567890</p>
                <p className="text-sm text-black/75">a.n. Harian Store</p>
              </div>
              <div className="rounded-[1rem] border-2 border-black bg-[#b8f2e6] p-4 shadow-[4px_4px_0_0_#000]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Status Saat Ini</p>
                <p className="mt-2 text-lg font-black text-black">{order.payment_status}</p>
                <p className="mt-1 text-sm text-black/75">{meeting ? `${meeting.agenda} • ${meeting.meeting_date}` : "Unggah bukti pembayaran setelah transfer selesai."}</p>
              </div>
            </div>

            <div className="rounded-[1rem] border-2 border-dashed border-black bg-white p-5 text-sm text-black/75 shadow-[4px_4px_0_0_#000]">
              Area upload bukti pembayaran.
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
              Transfer tepat Rp6.000
            </div>
            <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
              Simpan bukti transfer
            </div>
            <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
              Lanjut cek status verifikasi
            </div>
          </div>
        </NbCard>
      </div>
    </div>
  );
}
