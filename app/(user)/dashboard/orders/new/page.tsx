import Link from "next/link";
import { NbButton } from "@/components/neo/nb-button";
import { NewOrderPanel } from "@/components/user/new-order-panel";
import { getActiveProducts } from "@/lib/orders";

const timezones = ["Asia/Jakarta (WIB)", "Asia/Makassar (WITA)", "Asia/Jayapura (WIT)"];

export default async function NewOrderPage() {
  const products = await getActiveProducts();

  return (
    <div className="space-y-6">
      <div className="">
        <div className="space-y-6">
          <NewOrderPanel products={products} timezones={timezones} />

          <div>
            <NbButton asChild variant="neutral">
              <Link href="/dashboard">Kembali ke Overview</Link>
            </NbButton>
          </div>
        </div>
      </div>
    </div>
  );
}
