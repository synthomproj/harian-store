"use client";

import { useActionState } from "react";
import { createPaydiaPaymentAction, type CreatePaydiaPaymentState } from "@/app/(user)/dashboard/orders/[orderCode]/payment/actions";
import { NbButton } from "@/components/neo/nb-button";

type PaydiaPaymentFormProps = {
  orderId: string;
  hasPaymentLink: boolean;
};

const initialState: CreatePaydiaPaymentState = {};

export function PaydiaPaymentForm({ orderId, hasPaymentLink }: PaydiaPaymentFormProps) {
  const [state, formAction, pending] = useActionState(createPaydiaPaymentAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="order_id" value={orderId} />

      {state.error ? (
        <div className="rounded-[1rem] border-2 border-black bg-[#ff8fab] px-4 py-3 text-sm font-medium text-black shadow-[4px_4px_0_0_#000]">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="rounded-[1rem] border-2 border-black bg-[#b8f2e6] px-4 py-3 text-sm font-medium text-black shadow-[4px_4px_0_0_#000]">
          {state.success}
        </div>
      ) : null}

      <NbButton type="submit" className="bg-[#00d1ff]" disabled={pending || hasPaymentLink}>
        {pending ? "Membuat Transaksi..." : hasPaymentLink ? "Payment Link Sudah Ada" : "Buat Transaksi Paydia"}
      </NbButton>
    </form>
  );
}
