"use client";

import { useState } from "react";
import { NbCard, NbCardContent, NbCardDescription, NbCardHeader, NbCardTitle } from "@/components/neo/nb-card";
import { CreateOrderForm } from "@/components/user/create-order-form";
import type { ProductRecord } from "@/lib/orders";

type NewOrderPanelProps = {
  products: ProductRecord[];
  timezones: string[];
};

export function NewOrderPanel({ products, timezones }: NewOrderPanelProps) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0] ?? null;

  return (
    <>
      <NbCard className="bg-[#00d1ff] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Flow 1</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">Isi detail meeting Anda.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Setelah itu Anda bisa lanjut ke pembayaran.</p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Paket Dipilih</p>
            <p className="mt-3 text-3xl font-black text-black">{selectedProduct?.name ?? "Paket belum tersedia"}</p>
            <p className="mt-2 text-sm leading-6 text-black/75">
              {selectedProduct
                ? `${selectedProduct.participant_limit ?? "-"} peserta • ${selectedProduct.duration_minutes} menit • Rp${selectedProduct.price.toLocaleString("id-ID")}`
                : "Tambahkan produk aktif lebih dulu di database."}
            </p>
          </div>
        </div>
      </NbCard>

      <NbCard className="bg-[#fffbef]">
        <NbCardHeader>
          <NbCardTitle>Form Pembelian</NbCardTitle>
          <NbCardDescription>Isi data utama meeting di bawah ini.</NbCardDescription>
        </NbCardHeader>
        <NbCardContent>
          <CreateOrderForm
            products={products}
            timezones={timezones}
            isDisabled={!selectedProduct}
            selectedProductId={selectedProductId}
            onProductChange={setSelectedProductId}
          />
        </NbCardContent>
      </NbCard>
    </>
  );
}
