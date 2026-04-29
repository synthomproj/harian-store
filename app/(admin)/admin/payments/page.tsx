import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPaymentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment monitoring</CardTitle>
        <CardDescription>Daftar order dengan status pembayaran yang perlu perhatian.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Halaman ini akan membaca field `Paydia` di `orders` untuk monitoring pembayaran.
      </CardContent>
    </Card>
  );
}
