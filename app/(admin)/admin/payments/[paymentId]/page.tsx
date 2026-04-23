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
        <CardDescription>Detail bukti pembayaran dan action approve/reject.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Halaman ini akan menampilkan proof upload dan catatan review admin.
      </CardContent>
    </Card>
  );
}
