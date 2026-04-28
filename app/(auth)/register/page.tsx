import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <Card className="order-2 w-full max-w-md justify-self-center bg-[#fffbef] lg:order-1 lg:max-w-none">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-black text-black">Register</CardTitle>
            <CardDescription className="text-black/75">Buat akun baru dengan email dan password untuk mulai memesan meeting Zoom.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />

            <p className="mt-6 text-center text-sm text-black/70">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-black text-black underline decoration-2 underline-offset-4 hover:text-black/70">
                Masuk di sini
              </Link>
            </p>
          </CardContent>
        </Card>

        <section className="order-1 hidden rounded-[2rem] border-4 border-black bg-[#b8f2e6] p-8 shadow-[10px_10px_0_0_#000] lg:order-2 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-4">
            <p className="inline-flex w-fit rounded-full border-2 border-black bg-[#00d1ff] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-black shadow-[2px_2px_0_0_#000]">
              Register Area
            </p>
            <h1 className="text-4xl font-black leading-tight text-black">Buat akun sekali, lalu pesan meeting kapan pun dibutuhkan.</h1>
            <p className="max-w-md text-base leading-7 text-black/80">Cocok untuk sesi konsultasi, kelas online, meeting klien, sampai kebutuhan harian usaha kecil.</p>
          </div>

          <div className="rounded-[1.5rem] border-4 border-black bg-[#ff6b6b] p-5 shadow-[8px_8px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/70">Kenapa daftar?</p>
            <p className="mt-3 text-sm leading-6 text-black/80">Supaya status order, pembayaran, dan link meeting tersimpan otomatis dan mudah dicek lagi.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
