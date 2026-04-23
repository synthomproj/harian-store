import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AdminProductDetailPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
  const { productId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produk {productId}</CardTitle>
        <CardDescription>Form edit paket meeting.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Halaman ini akan memuat konfigurasi harga, durasi, dan status produk.
      </CardContent>
    </Card>
  );
}
