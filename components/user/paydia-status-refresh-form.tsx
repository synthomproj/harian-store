"use client";

import { useActionState } from "react";
import { refreshPaydiaPaymentStatusAction, type CreatePaydiaPaymentState } from "@/app/(user)/dashboard/orders/[orderCode]/payment/actions";
import { NbButton } from "@/components/neo/nb-button";

type PaydiaStatusRefreshFormProps = {
  orderId: string;
  disabled?: boolean;
};

const initialState: CreatePaydiaPaymentState = {};

export function PaydiaStatusRefreshForm({ orderId, disabled = false }: PaydiaStatusRefreshFormProps) {
  const [state, formAction, pending] = useActionState(refreshPaydiaPaymentStatusAction, initialState);

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

      <NbButton type="submit" variant="neutral" className="bg-white" disabled={pending || disabled}>
        {pending ? "Mengecek Status..." : "Refresh Status Paydia"}
      </NbButton>
    </form>
  );
}
