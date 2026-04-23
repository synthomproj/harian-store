import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewAdminProductPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah produk</CardTitle>
        <CardDescription>Form create paket meeting baru.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Akan dihubungkan ke server action create product.
      </CardContent>
    </Card>
  );
}
