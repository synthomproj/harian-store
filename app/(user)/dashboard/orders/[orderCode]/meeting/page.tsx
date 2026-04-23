import { redirect } from "next/navigation";
import { requireOrderByCode } from "@/lib/orders";

type LegacyOrderMeetingPageProps = {
  params: Promise<{ orderCode: string }>;
};

export default async function LegacyOrderMeetingPage({ params }: LegacyOrderMeetingPageProps) {
  const { orderCode } = await params;
  const order = await requireOrderByCode(orderCode);

  if (order.meeting?.id) {
    redirect(`/dashboard/meeting/${order.meeting.id}`);
  }

  redirect("/dashboard/meeting");
}
