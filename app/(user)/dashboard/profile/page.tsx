import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil pelanggan</CardTitle>
        <CardDescription>
          Tempat integrasi form nama lengkap, WhatsApp, company, dan sinkronisasi ke tabel `profiles`.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Fondasi route sudah siap. Form dan server action profil bisa ditambahkan pada langkah berikutnya.
      </CardContent>
    </Card>
  );
}
