import { redirect } from "next/navigation";

export default function OrdersIndexRedirectPage() {
  redirect("/dashboard/meeting");
}
