"use client";

import { useActionState } from "react";
import { createOrderAction, type CreateOrderState } from "@/app/(user)/dashboard/orders/new/actions";
import { NbButton } from "@/components/neo/nb-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductRecord } from "@/lib/orders";

type CreateOrderFormProps = {
  products: ProductRecord[];
  timezones: string[];
  isDisabled: boolean;
  selectedProductId: string;
  onProductChange: (productId: string) => void;
};

const initialState: CreateOrderState = {};

export function CreateOrderForm({
  products,
  timezones,
  isDisabled,
  selectedProductId,
  onProductChange,
}: CreateOrderFormProps) {
  const [state, formAction, pending] = useActionState(createOrderAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <div className="rounded-[1rem] border-2 border-black bg-[#ff8fab] px-4 py-3 text-sm font-medium text-black shadow-[4px_4px_0_0_#000]">
          {state.error}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="product_id" className="font-black text-black">Paket</Label>
        <select
          id="product_id"
          name="product_id"
          value={selectedProductId}
          onChange={(event) => onProductChange(event.target.value)}
          disabled={isDisabled || pending}
          className="flex h-11 w-full rounded-[0.75rem] border-2 border-black bg-white px-3 py-2 text-sm font-medium text-black shadow-[4px_4px_0_0_#000] focus:outline-none disabled:opacity-50"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - Rp{product.price.toLocaleString("id-ID")}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic" className="font-black text-black">Topik</Label>
        <Input id="topic" name="topic" placeholder="Contoh: Kelas privat bahasa Inggris" className="h-11 bg-white" disabled={isDisabled || pending} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="timezone" className="font-black text-black">Timezone</Label>
          <select
            id="timezone"
            name="timezone"
            defaultValue="Asia/Jakarta (WIB)"
            disabled={isDisabled || pending}
            className="flex h-11 w-full rounded-[0.75rem] border-2 border-black bg-white px-3 py-2 text-sm font-medium text-black shadow-[4px_4px_0_0_#000] focus:outline-none disabled:opacity-50"
          >
            {timezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_time" className="font-black text-black">Start Time</Label>
          <Input id="start_time" name="start_time" type="datetime-local" className="h-11 bg-white" disabled={isDisabled || pending} />
        </div>
      </div>


      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <NbButton type="submit" className="bg-[#ff6b6b] sm:min-w-44" disabled={isDisabled || pending}>
          {pending ? "Membuat Order..." : "Lanjut ke Pembayaran"}
        </NbButton>
      </div>
    </form>
  );
}
