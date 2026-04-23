import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OrderPaymentPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function OrderPaymentPage({ params }: OrderPaymentPageProps) {
  const { orderCode } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pembayaran untuk {orderCode}</CardTitle>
        <CardDescription>
          Halaman instruksi transfer manual dan upload bukti pembayaran.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Akan membaca nominal order dan menghasilkan signed upload ke `Supabase Storage`.
      </CardContent>
    </Card>
  );
}
