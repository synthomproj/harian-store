import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OrderMeetingPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function OrderMeetingPage({ params }: OrderMeetingPageProps) {
  const { orderCode } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting result {orderCode}</CardTitle>
        <CardDescription>
          Halaman hasil provisioning meeting dan tampilan `join_url` untuk pelanggan.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Link meeting akan tampil di sini setelah callback `n8n` berhasil diproses.
      </CardContent>
    </Card>
  );
}
