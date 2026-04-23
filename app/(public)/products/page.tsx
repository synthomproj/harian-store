import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const packages = [
  {
    name: "Starter Meeting",
    description: "Paket dasar untuk meeting singkat dengan alur pemesanan manual.",
    price: "Rp99.000",
    duration: "60 menit",
  },
  {
    name: "Team Sync",
    description: "Paket untuk meeting tim reguler dengan durasi lebih panjang.",
    price: "Rp149.000",
    duration: "90 menit",
  },
  {
    name: "Workshop Session",
    description: "Paket untuk agenda kelas, training, atau workshop internal.",
    price: "Rp249.000",
    duration: "120 menit",
  },
];

export default function ProductsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="space-y-3">
        <Badge variant="secondary">Catalog</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Paket meeting</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Placeholder katalog awal untuk menyiapkan halaman list produk dan CTA ke flow order.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((item) => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-600">
              <p>Harga: {item.price}</p>
              <p>Durasi: {item.duration}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
