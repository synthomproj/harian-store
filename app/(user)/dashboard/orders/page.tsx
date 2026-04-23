import Link from "next/link";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent, NbCardDescription, NbCardHeader, NbCardTitle } from "@/components/neo/nb-card";

const upcomingMeetings = [
  {
    orderCode: "ORD-24001",
    topic: "Kelas privat bahasa Inggris",
    date: "24 Apr 2026",
    time: "19:00 WIB",
    duration: "60 menit",
    paymentStatus: "Menunggu Verifikasi",
    meetingStatus: "Diproses",
    tone: "bg-[#b8f2e6]",
  },
  {
    orderCode: "ORD-24002",
    topic: "Meeting klien mingguan",
    date: "25 Apr 2026",
    time: "10:00 WIB",
    duration: "60 menit",
    paymentStatus: "Menunggu Pembayaran",
    meetingStatus: "Belum Aktif",
    tone: "bg-white",
  },
];

const completedMeetings = [
  {
    orderCode: "ORD-23990",
    topic: "Sesi konsultasi branding",
    date: "20 Apr 2026",
    time: "13:00 WIB",
    duration: "60 menit",
    paymentStatus: "Lunas",
    meetingStatus: "Selesai",
    tone: "bg-[#fffbef]",
  },
  {
    orderCode: "ORD-23982",
    topic: "Kelas komunitas belajar",
    date: "18 Apr 2026",
    time: "19:30 WIB",
    duration: "90 menit",
    paymentStatus: "Lunas",
    meetingStatus: "Selesai",
    tone: "bg-white",
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <NbCard className="bg-[#ffe066] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Meeting</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">Semua meeting Anda ada di sini.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Cek jadwal yang akan datang dan riwayat meeting sebelumnya.</p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Aksi Cepat</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <NbButton asChild className="w-full bg-[#ff6b6b]">
                <Link href="/dashboard/orders/new">Beli Paket</Link>
              </NbButton>
              <NbButton asChild variant="neutral" className="w-full bg-[#00d1ff]">
                <Link href="/dashboard">Kembali ke Overview</Link>
              </NbButton>
            </div>
          </div>
        </div>
      </NbCard>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-black">Meeting Yang Akan Datang</h3>
            <p className="text-sm leading-6 text-black/70">Sesi yang masih menunggu jadwal dimulai atau sedang dalam proses penyediaan link.</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {upcomingMeetings.map((meeting) => (
            <NbCard key={meeting.orderCode} className={meeting.tone}>
              <NbCardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">{meeting.orderCode}</p>
                    <NbCardTitle className="mt-2 text-xl">{meeting.topic}</NbCardTitle>
                  </div>
                  <div className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black text-black shadow-[2px_2px_0_0_#000]">
                    {meeting.meetingStatus}
                  </div>
                </div>
                <NbCardDescription className="text-black/75">
                  {meeting.date} • {meeting.time} • {meeting.duration}
                </NbCardDescription>
              </NbCardHeader>
              <NbCardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1rem] border-2 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Pembayaran</p>
                    <p className="mt-2 text-sm font-bold text-black">{meeting.paymentStatus}</p>
                  </div>
                  <div className="rounded-[1rem] border-2 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Status Meeting</p>
                    <p className="mt-2 text-sm font-bold text-black">{meeting.meetingStatus}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <NbButton asChild className="w-full bg-[#00d1ff]">
                    <Link href={`/dashboard/orders/${meeting.orderCode}`}>Status Pembayaran</Link>
                  </NbButton>
                  <NbButton asChild variant="neutral" className="w-full">
                    <Link href={`/dashboard/orders/${meeting.orderCode}/payment`}>Halaman Pembayaran</Link>
                  </NbButton>
                </div>
              </NbCardContent>
            </NbCard>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-2xl font-black text-black">Meeting Sudah Selesai</h3>
          <p className="text-sm leading-6 text-black/70">Riwayat meeting yang telah selesai untuk referensi pesanan sebelumnya.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {completedMeetings.map((meeting) => (
            <NbCard key={meeting.orderCode} className={meeting.tone}>
              <NbCardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">{meeting.orderCode}</p>
                    <NbCardTitle className="mt-2 text-xl">{meeting.topic}</NbCardTitle>
                  </div>
                  <div className="rounded-full border-2 border-black bg-[#ffe066] px-3 py-1 text-xs font-black text-black shadow-[2px_2px_0_0_#000]">
                    {meeting.meetingStatus}
                  </div>
                </div>
                <NbCardDescription className="text-black/75">
                  {meeting.date} • {meeting.time} • {meeting.duration}
                </NbCardDescription>
              </NbCardHeader>
              <NbCardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1rem] border-2 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Pembayaran</p>
                    <p className="mt-2 text-sm font-bold text-black">{meeting.paymentStatus}</p>
                  </div>
                  <div className="rounded-[1rem] border-2 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">Status Meeting</p>
                    <p className="mt-2 text-sm font-bold text-black">{meeting.meetingStatus}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <NbButton asChild variant="neutral" className="w-full bg-white">
                    <Link href={`/dashboard/orders/${meeting.orderCode}`}>Lihat Detail</Link>
                  </NbButton>
                  <NbButton asChild className="w-full bg-[#ff6b6b]">
                    <Link href={`/dashboard/orders/${meeting.orderCode}/meeting`}>Status Meeting</Link>
                  </NbButton>
                </div>
              </NbCardContent>
            </NbCard>
          ))}
        </div>
      </section>
    </div>
  );
}
