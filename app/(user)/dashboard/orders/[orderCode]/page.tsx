import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OrderDetailPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderCode } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail order {orderCode}</CardTitle>
        <CardDescription>
          Halaman customer-facing untuk status order, payment, dan provisioning.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Detail order akan dihubungkan ke `orders`, `manual_payments`, dan `zoom_meetings`.
      </CardContent>
    </Card>
  );
}
