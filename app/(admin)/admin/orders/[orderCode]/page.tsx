import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AdminOrderDetailPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { orderCode } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order {orderCode}</CardTitle>
        <CardDescription>Detail operasional order untuk admin.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Akan memuat data pelanggan, meeting request, payment, dan action provisioning.
      </CardContent>
    </Card>
  );
}
