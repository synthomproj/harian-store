import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPaymentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment review queue</CardTitle>
        <CardDescription>Antrian verifikasi transfer manual.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Halaman ini akan membaca `manual_payments` dengan status `submitted`.
      </CardContent>
    </Card>
  );
}
