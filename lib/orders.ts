import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type MeetingRecord = {
  id: string;
  meeting_id: string | null;
  host_id: string | null;
  host_email: string | null;
  topic: string | null;
  status: string;
  start_time: string | null;
  duration: number | null;
  timezone: string;
  start_url: string | null;
  join_url: string | null;
  password: string | null;
  meeting_created_at: string | null;
  created_at: string;
  order_id: string;
  user_id: string | null;
  order: {
    id: string;
    order_code: string;
    status: string;
    payment_status: string;
    provisioning_status: string;
    total_amount: number;
    created_at: string;
    product: {
      id: string;
      name: string;
      duration_minutes: number;
      participant_limit: number | null;
    } | null;
  } | null;
  meeting_request: {
    id: string;
    agenda: string;
    meeting_date: string;
    start_time: string;
    duration_minutes: number;
    timezone: string;
    notes: string | null;
  } | null;
};

type OrderMeetingMeta = {
  id: string;
  order_code: string;
  status: string;
  payment_status: string;
  provisioning_status: string;
  total_amount: number;
  created_at: string;
  product: {
    id: string;
    name: string;
    duration_minutes: number;
    participant_limit: number | null;
  } | null;
  meeting_request: {
    id: string;
    agenda: string;
    meeting_date: string;
    start_time: string;
    duration_minutes: number;
    timezone: string;
    notes: string | null;
  } | null;
};

const orderMeetingMetaSelect = `
  id,
  order_code,
  status,
  payment_status,
  provisioning_status,
  total_amount,
  created_at,
  product:products (id, name, duration_minutes, participant_limit),
  meeting_request:meeting_requests (id, agenda, meeting_date, start_time, duration_minutes, timezone, notes)
`;

export type OrderRecord = {
  id: string;
  order_code: string;
  status: string;
  payment_status: string;
  provisioning_status: string;
  total_amount: number;
  payment_provider: string | null;
  paydia_transaction_id: string | null;
  paydia_partner_reference_no: string | null;
  paydia_reference_no: string | null;
  paydia_payment_url: string | null;
  paydia_qr_content: string | null;
  paydia_status: string | null;
  paydia_status_desc: string | null;
  paydia_expires_at: string | null;
  paydia_paid_at: string | null;
  paydia_payload: Record<string, unknown>;
  created_at: string;
  product: {
    id: string;
    name: string;
    duration_minutes: number;
    participant_limit: number | null;
  } | null;
  meeting_request: {
    id: string;
    agenda: string;
    meeting_date: string;
    start_time: string;
    duration_minutes: number;
    timezone: string;
    notes: string | null;
  } | null;
  meeting: MeetingRecord | null;
};

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration_minutes: number;
  participant_limit: number | null;
  is_active: boolean;
};

export type TransactionRecord = {
  id: string;
  order_code: string;
  status: string;
  payment_status: string;
  provisioning_status: string;
  total_amount: number;
  created_at: string;
  product: {
    id: string;
    name: string;
    duration_minutes: number;
    participant_limit: number | null;
  } | null;
  meeting_request: {
    id: string;
    agenda: string;
    meeting_date: string;
    start_time: string;
    duration_minutes: number;
    timezone: string;
    notes: string | null;
  } | null;
  meeting: MeetingRecord | null;
};

async function getCurrentUserId() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

async function getTransactionsForCurrentUser() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return [] as TransactionRecord[];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_code,
        status,
        payment_status,
        provisioning_status,
        total_amount,
        created_at,
        product:products (id, name, duration_minutes, participant_limit),
        meeting_request:meeting_requests (id, agenda, meeting_date, start_time, duration_minutes, timezone, notes),
        meeting:meeting (id, meeting_id, host_id, host_email, topic, status, start_time, duration, timezone, start_url, join_url, password, meeting_created_at, created_at, order_id, user_id)
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data as TransactionRecord[] | null) ?? [];
}

async function getOrdersByIds(orderIds: string[]) {
  if (orderIds.length === 0) {
    return [] as OrderMeetingMeta[];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select(orderMeetingMetaSelect)
    .in("id", orderIds);

  return (data as OrderMeetingMeta[] | null) ?? [];
}

async function getOrderMeetingMetaForCurrentUser() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return [] as OrderMeetingMeta[];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select(orderMeetingMetaSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data as OrderMeetingMeta[] | null) ?? [];
}

export async function getTransactionHistory(): Promise<TransactionRecord[]> {
  return getTransactionsForCurrentUser();
}

export async function getActiveMeetings(): Promise<MeetingRecord[]> {
  const orders = await getOrderMeetingMetaForCurrentUser();
  const ownedOrderIds = orders.map((order) => order.id);

  if (ownedOrderIds.length === 0) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("meeting")
    .select(
      `
        id,
        meeting_id,
        host_id,
        host_email,
        topic,
        status,
        start_time,
        duration,
        timezone,
        start_url,
        join_url,
        password,
        meeting_created_at,
        created_at,
        order_id,
        user_id
      `,
    )
    .in("order_id", ownedOrderIds)
    .order("created_at", { ascending: false });

  const meetings = (data as MeetingRecord[] | null) ?? [];
  const orderMap = new Map(orders.map((order) => [order.id, order]));

  return meetings
    .map((meeting) => {
      const order = orderMap.get(meeting.order_id) ?? null;

      return {
        ...meeting,
        order,
        meeting_request: order?.meeting_request ?? null,
      } satisfies MeetingRecord;
    })
    .filter((meeting) => {
    if (!meeting.order) {
      return false;
    }

    if (["cancelled", "rejected"].includes(meeting.order.status)) {
      return false;
    }

      return !["ended", "cancelled"].includes(meeting.status);
    });
}

async function hydrateMeetingRecord(meeting: MeetingRecord | null) {
  if (!meeting) {
    console.error("[meeting] hydrateMeetingRecord: meeting not found");
    return null;
  }

  const [order] = await getOrdersByIds([meeting.order_id]);

  if (!order) {
    console.error("[meeting] hydrateMeetingRecord: linked order not found", { orderId: meeting.order_id, meetingId: meeting.id });
    return null;
  }

  return {
    ...meeting,
    order: order ?? null,
    meeting_request: order?.meeting_request ?? null,
  } satisfies MeetingRecord;
}

export async function getMeetingById(meetingId: string): Promise<MeetingRecord | null> {
  const userId = await getCurrentUserId();

  if (!userId) {
    console.error("[meeting] getMeetingById: no user session", { meetingId });
    return null;
  }

  console.error("[meeting] getMeetingById:start", { meetingId, userId });

  const supabase = await createSupabaseServerClient();
  const { data: byIdData } = await supabase
    .from("meeting")
    .select(
      `
        id,
        meeting_id,
        host_id,
        host_email,
        topic,
        status,
        start_time,
        duration,
        timezone,
        start_url,
        join_url,
        password,
        meeting_created_at,
        created_at,
        order_id,
        user_id
      `,
    )
    .eq("id", meetingId)
    .maybeSingle();

  const byId = await hydrateMeetingRecord((byIdData as MeetingRecord | null) ?? null);

  console.error("[meeting] getMeetingById:byId", { found: Boolean(byIdData), hydrated: Boolean(byId) });

  if (byId) {
    return byId;
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(meetingId);

  if (isUuid) {
    const { data: byOrderIdData } = await supabase
      .from("meeting")
      .select(
        `
          id,
          meeting_id,
          host_id,
          host_email,
          topic,
          status,
          start_time,
          duration,
          timezone,
          start_url,
          join_url,
          password,
          meeting_created_at,
          created_at,
          order_id,
          user_id
        `,
      )
      .eq("order_id", meetingId)
      .maybeSingle();

    const byOrderId = await hydrateMeetingRecord((byOrderIdData as MeetingRecord | null) ?? null);

    console.error("[meeting] getMeetingById:byOrderId", { found: Boolean(byOrderIdData), hydrated: Boolean(byOrderId) });

    if (byOrderId) {
      return byOrderId;
    }
  }

  const { data: byMeetingCodeData } = await supabase
    .from("meeting")
    .select(
      `
        id,
        meeting_id,
        host_id,
        host_email,
        topic,
        status,
        start_time,
        duration,
        timezone,
        start_url,
        join_url,
        password,
        meeting_created_at,
        created_at,
        order_id,
        user_id
      `,
    )
    .eq("meeting_id", meetingId)
    .maybeSingle();

  return hydrateMeetingRecord((byMeetingCodeData as MeetingRecord | null) ?? null);
}

export async function requireMeetingById(meetingId: string) {
  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return meeting;
}

export async function getActiveProducts(): Promise<ProductRecord[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, duration_minutes, participant_limit, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  return (data as ProductRecord[] | null) ?? [];
}

export async function getPrimaryActiveProduct() {
  const products = await getActiveProducts();
  return products[0] ?? null;
}

export async function getOrderByCode(orderCode: string): Promise<OrderRecord | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_code,
        status,
        payment_status,
        provisioning_status,
        total_amount,
        payment_provider,
        paydia_transaction_id,
        paydia_partner_reference_no,
        paydia_reference_no,
        paydia_payment_url,
        paydia_qr_content,
        paydia_status,
        paydia_status_desc,
        paydia_expires_at,
        paydia_paid_at,
        paydia_payload,
        created_at,
        product:products (id, name, duration_minutes, participant_limit),
        meeting_request:meeting_requests (id, agenda, meeting_date, start_time, duration_minutes, timezone, notes),
        meeting:meeting (id, meeting_id, host_id, host_email, topic, status, start_time, duration, timezone, start_url, join_url, password, meeting_created_at, created_at, order_id, user_id)
      `,
    )
    .eq("order_code", orderCode)
    .maybeSingle();

  return (data as OrderRecord | null) ?? null;
}

export async function requireOrderByCode(orderCode: string) {
  const order = await getOrderByCode(orderCode);

  if (!order) {
    notFound();
  }

  return order;
}
