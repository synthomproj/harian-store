import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AdminPaymentDetailPageProps = {
  params: Promise<{ paymentId: string }>;
};

export default async function AdminPaymentDetailPage({ params }: AdminPaymentDetailPageProps) {
  const { paymentId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment {paymentId}</CardTitle>
        <CardDescription>Detail status provider, referensi transaksi, dan data audit pembayaran.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Halaman ini akan menampilkan detail transaksi `Paydia` dan konteks order terkait.
      </CardContent>
    </Card>
  );
}
