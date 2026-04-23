import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProductsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelola produk</CardTitle>
        <CardDescription>Daftar paket meeting aktif dan nonaktif.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Halaman ini akan mengelola data `products` di Supabase.
      </CardContent>
    </Card>
  );
}
