import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;
  const message =
    registered === "1"
      ? "Akun berhasil dibuat. Silakan cek email Anda jika diminta verifikasi, lalu login kembali."
      : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <section className="hidden rounded-[2rem] border-4 border-black bg-[#ffe066] p-8 shadow-[10px_10px_0_0_#000] lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-4">
            <p className="inline-flex w-fit rounded-full border-2 border-black bg-[#ff6b6b] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-black shadow-[2px_2px_0_0_#000]">
              Login Area
            </p>
            <h1 className="text-4xl font-black leading-tight text-black">
              Cek order dan akses link meeting tanpa ribet.
            </h1>
            <p className="max-w-md text-base leading-7 text-black/80">
              Semua pesanan, pembayaran, dan link meeting Anda tetap tersusun rapi dalam satu dashboard.
            </p>
          </div>

          <div className="rounded-[1.5rem] border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Harian Store</p>
            <p className="mt-3 text-sm leading-6 text-black/75">
              Solusi simpel untuk personal use, kelas online, komunitas, dan UMKM yang butuh meeting Zoom siap pakai.
            </p>
          </div>
        </section>

        <Card className="w-full max-w-md justify-self-center bg-[#fffbef] lg:max-w-none">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-black text-black">Login</CardTitle>
            <CardDescription className="text-black/75">
              Masuk untuk melihat pesanan dan link meeting Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm message={message} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
