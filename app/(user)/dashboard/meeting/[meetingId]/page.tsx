import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard, NbCardContent, NbCardDescription, NbCardHeader, NbCardTitle } from "@/components/neo/nb-card";
import { requireMeetingById } from "@/lib/orders";

type MeetingDetailPageProps = {
  params: Promise<{ meetingId: string }>;
};

function formatMeetingDate(date: string | null, fallbackDate: string | null, fallbackTime: string | null) {
  if (date) {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(date));
  }

  if (!fallbackDate || !fallbackTime) {
    return "Jadwal belum ditentukan";
  }

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  }).format(new Date(fallbackDate));

  return `${dateLabel} • ${fallbackTime.slice(0, 5)} WIB`;
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Belum tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { meetingId } = await params;
  const meeting = await requireMeetingById(meetingId);
  const order = meeting.order;
  const meetingRequest = meeting.meeting_request;
  const scheduleLabel = formatMeetingDate(meeting.start_time, meetingRequest?.meeting_date ?? null, meetingRequest?.start_time ?? null);

  return (
    <div className="space-y-6">
      <NbCard className="bg-[#00d1ff] p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Meeting</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-black lg:text-4xl">Detail meeting {meeting.id}.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-black/80 lg:text-base">Halaman ini membaca langsung dari tabel `meeting` dan menampilkan detail akses meeting yang sudah digenerate.</p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Status Meeting</p>
            <p className="mt-3 text-3xl font-black text-black">{meeting.status}</p>
            <p className="mt-2 text-sm leading-6 text-black/75">{meeting.join_url ? "Meeting sudah punya join link." : "Meeting belum memiliki join link."}</p>
          </div>
        </div>
      </NbCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <NbCard className="bg-[#fffbef]">
            <NbCardHeader>
              <NbCardTitle>Ringkasan Meeting</NbCardTitle>
              <NbCardDescription>Informasi utama dari tabel meeting dan order terkait.</NbCardDescription>
            </NbCardHeader>
            <NbCardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Topik</p>
                <p className="mt-2 text-sm leading-6 text-black/80">{meeting.topic ?? meetingRequest?.agenda ?? order?.product?.name ?? "Belum ada topik"}</p>
              </div>
              <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Jadwal</p>
                <p className="mt-2 text-sm leading-6 text-black/80">{scheduleLabel}</p>
              </div>
              <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Durasi</p>
                <p className="mt-2 text-sm leading-6 text-black/80">{meeting.duration ?? meetingRequest?.duration_minutes ?? order?.product?.duration_minutes ?? "Belum tersedia"} menit</p>
              </div>
              <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Order</p>
                <p className="mt-2 text-sm leading-6 text-black/80">{order?.order_code ?? "Belum terkait ke order"}</p>
              </div>
            </NbCardContent>
          </NbCard>

          <NbCard className="bg-white">
            <NbCardHeader>
              <NbCardTitle>Akses Meeting</NbCardTitle>
              <NbCardDescription>Detail akses dari tabel `meeting`.</NbCardDescription>
            </NbCardHeader>
            <NbCardContent className="space-y-4">
              <div className="rounded-[1rem] border-2 border-black bg-[#b8f2e6] p-4 shadow-[4px_4px_0_0_#000]">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Join Link</p>
                <p className="mt-2 break-all text-sm leading-6 text-black/80">{meeting.join_url ?? "Belum tersedia."}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Meeting ID</p>
                  <p className="mt-2 text-sm leading-6 text-black/80">{meeting.meeting_id ?? "Belum tersedia"}</p>
                </div>
                <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Password</p>
                  <p className="mt-2 text-sm leading-6 text-black/80">{meeting.password ?? "Belum tersedia"}</p>
                </div>
                <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Host Email</p>
                  <p className="mt-2 text-sm leading-6 text-black/80">{meeting.host_email ?? "Belum tersedia"}</p>
                </div>
                <div className="rounded-[1rem] border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-black/60">Meeting Created At</p>
                  <p className="mt-2 text-sm leading-6 text-black/80">{formatDateTime(meeting.meeting_created_at)}</p>
                </div>
              </div>

              {meeting.join_url ? (
                <NbButton asChild className="bg-[#ff6b6b]">
                  <a href={meeting.join_url} target="_blank" rel="noreferrer">
                    <ExternalLink className="size-4" />
                    Buka Join Link
                  </a>
                </NbButton>
              ) : null}

              {meeting.start_url ? (
                <div className="rounded-[1rem] border-2 border-dashed border-black bg-[#fff7cf] p-4 text-sm leading-6 text-black/75 shadow-[4px_4px_0_0_#000]">
                  <p className="font-black text-black">Host Start URL</p>
                  <p className="mt-2 break-all">{meeting.start_url}</p>
                </div>
              ) : null}
            </NbCardContent>
          </NbCard>
        </div>

        <NbCard className="bg-[#ffe066] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-black/70">Aksi Cepat</p>
          <div className="mt-4 space-y-3">
            {order?.order_code ? (
              <NbButton asChild className="w-full bg-white">
                <Link href={`/dashboard/orders/${order.order_code}`}>
                  <FileText className="size-4" />
                  Lihat Order
                </Link>
              </NbButton>
            ) : null}
            <NbButton asChild variant="neutral" className="w-full bg-[#ff6b6b]">
              <Link href="/dashboard/meeting">Lihat Semua Meeting</Link>
            </NbButton>
          </div>
        </NbCard>
      </div>
    </div>
  );
}
