import Link from "next/link";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent, NbCardDescription, NbCardHeader, NbCardTitle } from "@/components/neo/nb-card";
import { requireOrderByCode } from "@/lib/orders";

type OrderMeetingPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function OrderMeetingPage({ params }: OrderMeetingPageProps) {
  const { orderCode } = await params;
  const order = await requireOrderByCode(orderCode);
  const meeting = order.zoom_meeting;

  return (
    <div className="space-y-6">
      <NbCard className="bg-[#00d1ff] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Meeting</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">Status meeting {orderCode}.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Link meeting akan tampil di halaman ini.</p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Status</p>
            <p className="mt-3 text-3xl font-black text-black">{meeting?.status ?? order.provisioning_status}</p>
            <p className="mt-2 text-sm leading-6 text-black/75">Tunggu sampai link meeting siap.</p>
          </div>
        </div>
      </NbCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <NbCard className="bg-[#fffbef]">
          <NbCardHeader>
            <NbCardTitle>Detail Meeting</NbCardTitle>
            <NbCardDescription>Ringkasan status meeting Anda.</NbCardDescription>
          </NbCardHeader>
          <NbCardContent className="space-y-4">
            <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Join Link</p>
              <p className="mt-2 break-all text-sm leading-6 text-black/75">{meeting?.join_url ?? "Belum tersedia."}</p>
            </div>
            <div className="rounded-[1rem] border-2 border-black bg-[#b8f2e6] p-4 shadow-[4px_4px_0_0_#000]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Catatan</p>
              <p className="mt-2 text-sm leading-6 text-black/75">{order.meeting_request ? `${order.meeting_request.agenda} • ${order.meeting_request.meeting_date}` : "Setelah meeting siap, link Zoom akan muncul di sini."}</p>
            </div>
          </NbCardContent>
        </NbCard>

        <NbCard className="bg-[#ffe066] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Aksi Cepat</p>
          <div className="mt-4 space-y-3">
            <NbButton asChild className="w-full bg-white">
              <Link href={`/dashboard/orders/${orderCode}`}>Kembali ke Status</Link>
            </NbButton>
            <NbButton asChild variant="neutral" className="w-full bg-[#ff6b6b]">
              <Link href="/dashboard/orders">Lihat Semua Meeting</Link>
            </NbButton>
          </div>
        </NbCard>
      </div>
    </div>
  );
}
