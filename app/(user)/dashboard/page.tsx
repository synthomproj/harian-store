import Link from "next/link";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent, NbCardDescription, NbCardHeader, NbCardTitle } from "@/components/neo/nb-card";

const upcomingMeetings = [
  {
    title: "Belum ada meeting terjadwal",
    schedule: "Tambahkan order baru untuk melihat jadwal meeting di sini.",
    note: "Setelah pesanan diproses, detail meeting dan link Zoom akan tampil otomatis.",
    tone: "bg-white",
  },
];

const completedMeetings = [
  {
    title: "Belum ada meeting selesai",
    schedule: "Riwayat meeting yang sudah lewat akan muncul di bagian ini.",
    note: "Gunakan halaman pesanan untuk mengecek status pembayaran dan detail order sebelumnya.",
    tone: "bg-[#fffbef]",
  },
];

export default function DashboardPage() {
  return (
    <>

      <section>
        <NbCard className="bg-[#00d1ff] p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">CTA Pembelian</p>
              <h3 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">
                Butuh link Zoom? Langsung pesan paket harian.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Cocok untuk kelas, konsultasi, atau meeting klien.</p>
            </div>
            <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Paket Aktif</p>
              <p className="mt-3 text-3xl font-black text-black">Rp6.000</p>
              <p className="mt-2 text-sm leading-6 text-black/75">100 peserta • 60 menit</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <NbButton asChild className="w-full bg-[#ff6b6b]">
                  <Link href="/dashboard/orders/new">Beli Paket</Link>
                </NbButton>
                <NbButton asChild variant="neutral" className="w-full">
                  <Link href="/dashboard/orders">Lihat Pesanan</Link>
                </NbButton>
              </div>
            </div>
          </div>
        </NbCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2 mt-6">
        <NbCard className="bg-[#b8f2e6]">
          <NbCardHeader>
            <NbCardTitle>Meeting Yang Akan Datang</NbCardTitle>
            <NbCardDescription>Bagian ini menampilkan sesi meeting terdekat yang masih aktif atau menunggu waktu mulai.</NbCardDescription>
          </NbCardHeader>
          <NbCardContent className="space-y-4">
            {upcomingMeetings.map((item) => (
              <div key={item.title} className={`rounded-[1rem] border-2 border-black p-4 shadow-[4px_4px_0_0_#000] ${item.tone}`}>
                <p className="text-lg font-black text-black">{item.title}</p>
                <p className="mt-2 text-sm font-semibold text-black/80">{item.schedule}</p>
                <p className="mt-2 text-sm leading-6 text-black/70">{item.note}</p>
              </div>
            ))}
          </NbCardContent>
        </NbCard>

        <NbCard className="bg-[#ffe066]">
          <NbCardHeader>
            <NbCardTitle>Meeting Sudah Selesai</NbCardTitle>
            <NbCardDescription>Riwayat sesi yang sudah lewat tetap bisa Anda cek untuk melihat detail order sebelumnya.</NbCardDescription>
          </NbCardHeader>
          <NbCardContent className="space-y-4">
            {completedMeetings.map((item) => (
              <div key={item.title} className={`rounded-[1rem] border-2 border-black p-4 shadow-[4px_4px_0_0_#000] ${item.tone}`}>
                <p className="text-lg font-black text-black">{item.title}</p>
                <p className="mt-2 text-sm font-semibold text-black/80">{item.schedule}</p>
                <p className="mt-2 text-sm leading-6 text-black/70">{item.note}</p>
              </div>
            ))}
          </NbCardContent>
        </NbCard>
      </section>
    </>
  );
}
