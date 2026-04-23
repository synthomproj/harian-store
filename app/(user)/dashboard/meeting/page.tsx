import Link from "next/link";
import { Video } from "lucide-react";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent } from "@/components/neo/nb-card";
import { getActiveMeetings, type OrderListItem } from "@/lib/orders";

function formatMeetingDate(order: OrderListItem) {
  if (!order.meeting_request) {
    return "Jadwal belum ditentukan";
  }

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(order.meeting_request.meeting_date));

  const timeLabel = order.meeting_request.start_time.slice(0, 5);
  return `${dateLabel} • ${timeLabel} WIB • ${order.meeting_request.duration_minutes} menit`;
}

function getTopic(order: OrderListItem) {
  return order.meeting_request?.agenda ?? order.product?.name ?? "Order meeting";
}

function getMeetingStatus(order: OrderListItem) {
  if (order.zoom_meeting?.status) {
    return order.zoom_meeting.status;
  }

  if (order.provisioning_status === "success") {
    return "generated";
  }

  return order.provisioning_status;
}

export default async function MeetingPage() {
  const activeMeetings = await getActiveMeetings();

  return (
    <div className="space-y-6">
      <NbCard className="bg-[#ffe066] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Meeting</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">Semua meeting Anda ada di sini.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Menu ini fokus untuk meeting aktif dan meeting yang sedang diproses.</p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Aksi Cepat</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <NbButton asChild className="w-full bg-[#ff6b6b]">
                <Link href="/dashboard/orders/new">Beli Paket</Link>
              </NbButton>
              <NbButton asChild variant="neutral" className="w-full bg-[#00d1ff]">
                <Link href="/dashboard/transaksi">Lihat Transaksi</Link>
              </NbButton>
            </div>
          </div>
        </div>
      </NbCard>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-black">Meeting Aktif</h3>
            <p className="text-sm leading-6 text-black/70">Order yang masih berjalan, menunggu pembayaran, atau meeting yang belum selesai.</p>
          </div>
        </div>

        {activeMeetings.length === 0 ? (
          <NbCard className="bg-white">
            <NbCardContent className="p-6 text-sm text-black/70">Belum ada meeting aktif. Buat order baru untuk memulai sesi berikutnya.</NbCardContent>
          </NbCard>
        ) : (
          <NbCard className="overflow-hidden bg-white p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm text-black">
                <thead className="bg-[#b8f2e6] text-left">
                  <tr>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Order</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Topik</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Jadwal</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Pembayaran</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Provisioning</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Meeting</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMeetings.map((meeting, index) => (
                    <tr key={meeting.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffbef]"}>
                      <td className="border-b border-black px-4 py-4 align-top font-bold">{meeting.order_code}</td>
                      <td className="border-b border-black px-4 py-4 align-top">
                        <div className="font-bold">{getTopic(meeting)}</div>
                        <div className="mt-1 text-xs text-black/60">{meeting.product?.name ?? "Produk tidak ditemukan"}</div>
                      </td>
                      <td className="border-b border-black px-4 py-4 align-top text-black/80">{formatMeetingDate(meeting)}</td>
                      <td className="border-b border-black px-4 py-4 align-top font-bold">{meeting.payment_status}</td>
                      <td className="border-b border-black px-4 py-4 align-top font-bold">{meeting.provisioning_status}</td>
                      <td className="border-b border-black px-4 py-4 align-top">
                        <div className="inline-flex rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black text-black shadow-[2px_2px_0_0_#000]">
                          {getMeetingStatus(meeting)}
                        </div>
                      </td>
                      <td className="border-b border-black px-4 py-4 align-top">
                        <div className="flex min-w-[56px] gap-2">
                          <NbButton asChild variant="neutral" className="h-10 w-10 bg-white p-0" aria-label={`Lihat detail meeting ${meeting.order_code}`} title="Detail Meeting">
                            <Link href={`/dashboard/orders/${meeting.order_code}/meeting`}>
                              <Video className="size-4" />
                            </Link>
                          </NbButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </NbCard>
        )}
      </section>
    </div>
  );
}
