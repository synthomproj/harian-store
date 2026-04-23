import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md border-white/10 bg-slate-950/85 text-white shadow-2xl shadow-cyan-950/10 backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl text-white">Register</CardTitle>
          <CardDescription className="text-white/75">
            Buat akun baru untuk mulai memesan meeting Zoom.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nama
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Nama lengkap"
                className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-cyan-400 focus-visible:ring-offset-slate-950"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-cyan-400 focus-visible:ring-offset-slate-950"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Buat password"
                className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-cyan-400 focus-visible:ring-offset-slate-950"
              />
            </div>

            <Button type="submit" className="w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
              Daftar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/70">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
              Masuk di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
