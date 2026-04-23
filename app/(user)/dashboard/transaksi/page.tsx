import Link from "next/link";
import { FileText, Video } from "lucide-react";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent } from "@/components/neo/nb-card";
import { getTransactionHistory, type TransactionRecord } from "@/lib/orders";

function formatMeetingDate(order: TransactionRecord) {
  if (!order.meeting_request) {
    return "Jadwal belum ditentukan";
  }

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(order.meeting_request.meeting_date));

  const timeLabel = order.meeting_request.start_time.slice(0, 5);
  return `${dateLabel} • ${timeLabel} WIB • ${order.meeting_request.duration_minutes} menit`;
}

function getTopic(order: TransactionRecord) {
  return order.meeting_request?.agenda ?? order.product?.name ?? "Order meeting";
}

function getMeetingStatus(order: TransactionRecord) {
  if (order.meeting?.status) {
    return order.meeting.status;
  }

  if (order.provisioning_status === "success") {
    return "generated";
  }

  return order.provisioning_status;
}

export default async function TransactionsPage() {
  const transactionHistory = await getTransactionHistory();

  return (
    <div className="space-y-6">
      <NbCard className="bg-[#ff8fab] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Transaksi</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">Riwayat pembelian Anda ada di sini.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Semua order pembelian paket dan status transaksi akan tampil di halaman ini.</p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Aksi Cepat</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <NbButton asChild className="w-full bg-[#ff6b6b]">
                <Link href="/dashboard/orders/new">Beli Paket</Link>
              </NbButton>
              <NbButton asChild variant="neutral" className="w-full bg-[#00d1ff]">
                <Link href="/dashboard/meeting">Lihat Meeting</Link>
              </NbButton>
            </div>
          </div>
        </div>
      </NbCard>

      <section className="space-y-4">
        <div>
          <h3 className="text-2xl font-black text-black">Histori Transaksi</h3>
          <p className="text-sm leading-6 text-black/70">Semua order dan meeting yang sudah pernah dibuat akan muncul di sini.</p>
        </div>

        {transactionHistory.length === 0 ? (
          <NbCard className="bg-white">
            <NbCardContent className="p-6 text-sm text-black/70">Belum ada histori transaksi. Order pertama Anda akan muncul setelah checkout selesai.</NbCardContent>
          </NbCard>
        ) : (
          <NbCard className="bg-white p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm text-black">
                <thead className="bg-[#ffe066] text-left">
                  <tr>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Order</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Topik</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Jadwal</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Pembayaran</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Meeting</th>
                    <th className="border-b-2 border-black px-4 py-3 font-black uppercase tracking-[0.14em]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map((meeting, index) => (
                    <tr key={meeting.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fffbef]"}>
                      <td className="border-b border-black px-4 py-4 align-top font-bold">{meeting.order_code}</td>
                      <td className="border-b border-black px-4 py-4 align-top">
                        <div className="font-bold">{getTopic(meeting)}</div>
                        <div className="mt-1 text-xs text-black/60">{meeting.product?.name ?? "Produk tidak ditemukan"}</div>
                      </td>
                      <td className="border-b border-black px-4 py-4 align-top text-black/80">{formatMeetingDate(meeting)}</td>
                      <td className="border-b border-black px-4 py-4 align-top">
                        <div className="font-bold">{meeting.payment_status}</div>
                        <div className="mt-1 text-xs text-black/60">{meeting.status}</div>
                      </td>
                      <td className="border-b border-black px-4 py-4 align-top">
                        <div className="inline-flex rounded-full border-2 border-black bg-[#b8f2e6] px-3 py-1 text-xs font-black text-black shadow-[2px_2px_0_0_#000]">
                          {getMeetingStatus(meeting)}
                        </div>
                      </td>
                      <td className="border-b border-black px-4 py-4 align-top">
                        <div className="flex min-w-[110px] gap-2">
                          <NbButton asChild variant="neutral" className="h-10 w-10 bg-white p-0" aria-label={`Lihat detail transaksi ${meeting.order_code}`} title="Lihat Detail">
                            <Link href={`/dashboard/orders/${meeting.order_code}`}>
                              <FileText className="size-4" />
                            </Link>
                          </NbButton>
                          <NbButton asChild className="h-10 w-10 bg-[#ff6b6b] p-0" aria-label={`Lihat status meeting ${meeting.order_code}`} title="Status Meeting">
                            <Link href={meeting.meeting ? `/dashboard/meeting/${meeting.meeting.id}` : "/dashboard/meeting"}>
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
