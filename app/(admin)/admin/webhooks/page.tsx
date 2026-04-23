import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminWebhooksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook logs</CardTitle>
        <CardDescription>Monitor inbound dan outbound webhook provisioning.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Halaman ini akan membaca tabel `webhook_logs` dan mendukung investigasi error.
      </CardContent>
    </Card>
  );
}
