import Link from "next/link";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent, NbCardDescription, NbCardHeader, NbCardTitle } from "@/components/neo/nb-card";

const stats = [
  {
    title: "Profil",
    description: "Lengkapi data pelanggan untuk mempercepat proses pemesanan.",
    tone: "bg-pink-200",
  },
  {
    title: "Pembayaran",
    description: "Pantau status pembayaran dan bukti transfer yang sudah Anda kirim.",
    tone: "bg-cyan-200",
  },
  {
    title: "Meeting",
    description: "Link Zoom dan detail meeting Anda akan tampil rapi di dashboard ini.",
    tone: "bg-lime-200",
  },
];

const actions = [
  {
    href: "/dashboard/profile",
    title: "Kelola Profil",
    description: "Pastikan nama, kontak, dan informasi Anda sudah lengkap.",
  },
  {
    href: "/dashboard/orders",
    title: "Riwayat Pesanan",
    description: "Lihat semua pesanan dan status terbarunya dalam satu tempat.",
  },
  {
    href: "/dashboard/orders/new",
    title: "Pesan Meeting Baru",
    description: "Mulai order baru untuk kebutuhan meeting, kelas, atau konsultasi Anda.",
  },
];

export default function DashboardPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <NbCard key={item.title} className={item.tone}>
            <NbCardHeader>
              <NbCardTitle>{item.title}</NbCardTitle>
              <NbCardDescription className="text-black/70">{item.description}</NbCardDescription>
            </NbCardHeader>
            <NbCardContent className="text-sm font-medium text-black/80">Siap dihubungkan ke data Supabase.</NbCardContent>
          </NbCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {actions.map((item) => (
          <NbCard key={item.href}>
            <NbCardHeader>
              <NbCardTitle>{item.title}</NbCardTitle>
              <NbCardDescription>{item.description}</NbCardDescription>
            </NbCardHeader>
            <NbCardContent>
              <NbButton asChild variant="neutral" className="w-full">
                <Link href={item.href}>Buka Halaman</Link>
              </NbButton>
            </NbCardContent>
          </NbCard>
        ))}
      </section>
    </>
  );
}
