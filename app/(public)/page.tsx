import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Pesan meeting tanpa ribet beli lisensi",
    description:
      "Cukup pilih paket, isi jadwal, lalu lanjutkan pemesanan. Cocok untuk kebutuhan pribadi sampai usaha kecil.",
    stat: "Praktis",
  },
  {
    title: "Cocok untuk personal use dan UMKM",
    description:
      "Dipakai untuk kelas online, meeting klien, sesi konsultasi, komunitas, atau koordinasi tim kecil tanpa proses yang bikin lelah.",
    stat: "Fleksibel",
  },
  {
    title: "Link meeting siap tanpa bolak-balik chat",
    description:
      "Setelah pesanan diproses, link meeting akan tersedia rapi di dashboard sehingga lebih mudah dicek kapan saja.",
    stat: "Lebih rapi",
  },
];

const testimonials = [
  {
    quote: "Buat kelas privat dan sesi mentoring jadi jauh lebih gampang. Tidak perlu repot urus akun meeting sendiri tiap saat.",
    author: "Raka, Mentor Freelance",
  },
  {
    quote: "Untuk usaha kecil, yang penting simpel dan cepat. Pesan, bayar, lalu tinggal pakai link meeting yang sudah siap.",
    author: "Mira, Owner UMKM",
  },
  {
    quote: "Enak dipakai buat komunitas belajar. Semua terasa lebih rapi dibanding kirim-kiriman link secara manual.",
    author: "Dian, Komunitas Belajar",
  },
];

const faqs = [
  {
    question: "Apakah pelanggan harus login sebelum memesan?",
    answer: "Ya. Anda perlu login agar pesanan, pembayaran, dan link meeting tersimpan rapi di akun Anda dan mudah dicek kapan saja.",
  },
  {
    question: "Bagaimana metode pembayarannya?",
    answer: "Saat ini pembayaran dilakukan secara manual. Anda tinggal mengikuti instruksi transfer lalu mengunggah bukti pembayaran dari detail pesanan.",
  },
  {
    question: "Kapan link Zoom tersedia?",
    answer: "Link meeting akan tersedia setelah pembayaran selesai diproses. Anda bisa melihatnya langsung dari dashboard akun.",
  },
  {
    question: "Apakah satu pelanggan bisa membuat lebih dari satu order?",
    answer: "Bisa. Setiap pesanan memiliki detail meeting dan statusnya masing-masing, jadi Anda dapat memesan lebih dari satu sesi.",
  },
  {
    question: "Siapa yang cocok menggunakan layanan ini?",
    answer: "Layanan ini cocok untuk personal use, kelas online, sesi konsultasi, meeting klien, komunitas belajar, dan UMKM yang butuh meeting Zoom siap pakai tanpa repot.",
  },
  {
    question: "Apa yang saya dapatkan dalam paket harian murah?",
    answer: "Anda mendapatkan meeting Zoom untuk 100 peserta dengan durasi 60 menit seharga Rp6.000. Paket ini cocok untuk kebutuhan harian yang sederhana dan hemat.",
  },
];

export default function HomePage() {
  return (
    <main className="-mt-16 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_24%),radial-gradient(circle_at_85%_15%,_rgba(59,130,246,0.18),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#081121_40%,_#0b1326_100%)] text-white">
      <section className="mx-auto w-full max-w-6xl gap-10 px-6 py-16 lg:py-24">
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge className="bg-cyan-400/15 text-cyan-200 hover:bg-cyan-400/15">Zoom Meeting Rental</Badge>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white lg:text-6xl lg:leading-[1.05]">
              Sewa meeting Zoom yang simpel untuk personal, kelas online, dan UMKM.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/80 lg:text-lg">
              Tidak perlu repot langganan akun mahal untuk kebutuhan sesekali. Pilih paket,
              kirim pesanan, lalu akses link meeting Anda dari dashboard yang rapi dan mudah dicek.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
              <Link href="/register">Mulai Pesan</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              <Link href="/products">Lihat Paket</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="solutions" className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-8 md:grid-cols-3 lg:py-14">
        {features.map((item) => (
          <Card key={item.title} className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <Badge variant="secondary" className="w-fit bg-white/10 text-white">
                {item.stat}
              </Badge>
              <CardTitle className="text-xl text-white">{item.title}</CardTitle>
              <CardDescription className="leading-6 text-white">{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>


      <section id="pricing" className="bg-slate-950 py-16 text-white lg:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div className="space-y-4">
            <Badge className="bg-white/10 text-white">Paket Harian Murah</Badge>
            <h2 className="text-3xl font-semibold tracking-tight lg:text-5xl">
              Meeting harian simpel untuk kebutuhan cepat dan hemat.
            </h2>
            <p className="text-sm leading-6 text-white/78 lg:text-base">
              Cocok untuk kelas singkat, meeting klien, konsultasi, dan koordinasi usaha kecil yang tidak butuh setup ribet.
            </p>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/30 bg-gradient-to-br from-cyan-400 to-sky-500 p-[1px] shadow-2xl shadow-cyan-950/20">
            <div className="grid gap-6 rounded-[calc(2rem-1px)] bg-slate-950 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">Best Entry Offer</p>
                    <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white lg:text-4xl">Paket Harian 100 Peserta</h3>
                  </div>
                </div>

                <p className="max-w-xl text-base leading-7 text-white/80">
                  Solusi praktis untuk Anda yang butuh meeting Zoom siap pakai tanpa harus berlangganan akun sendiri.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/60">Kapasitas</p>
                    <p className="mt-2 text-xl font-semibold text-white">100 peserta</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/60">Durasi</p>
                    <p className="mt-2 text-xl font-semibold text-white">60 menit</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/5 p-5 lg:p-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-white/60">Harga</p>
                  <p className="mt-3 text-5xl font-semibold tracking-tight text-white">Rp6.000</p>
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    Satu paket meeting harian untuk 100 peserta dengan durasi 60 menit.
                  </p>
                </div>

                <Button asChild size="lg" className="mt-6 w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                  <Link href="/login">Beli Paket</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-10 space-y-3">
          <Badge variant="secondary" className="bg-white/10 text-white">Kepercayaan</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">
            Alur yang sederhana justru paling terasa nilainya saat tim Anda sering mengelola meeting.
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.author} className="border-white/10 bg-white/5">
              <CardHeader>
                <Sparkles className="size-5 text-cyan-500" />
                <CardDescription className="pt-2 text-base leading-7 text-white/80">
                  “{item.quote}”
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm font-medium text-white">{item.author}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-4xl px-6 py-16 lg:py-24">
        <div className="mb-10 space-y-3 text-center">
          <Badge variant="secondary" className="bg-white/10 text-white">FAQ</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">Pertanyaan yang paling sering muncul</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((item) => (
            <Card key={item.question} className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-lg text-white">{item.question}</CardTitle>
                <CardDescription className="leading-7 text-white/85">{item.answer}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
