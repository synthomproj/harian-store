import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminOrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin orders</CardTitle>
        <CardDescription>Daftar seluruh order dengan filter status operasional.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Halaman ini akan menjadi pusat monitoring order, payment, dan provisioning.
      </CardContent>
    </Card>
  );
}
