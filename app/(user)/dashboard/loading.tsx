export default function UserDashboardLoading() {
  return (
    <div className="min-h-screen bg-[#f6f3ea] text-black">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[260px_1fr] lg:px-6 lg:py-6">
        <aside className="hidden lg:block">
          <div className="space-y-4 lg:sticky lg:top-6">
            <div className="h-20 rounded-[1.5rem] border-2 border-black bg-cyan-300 shadow-[6px_6px_0_0_#000]" />
            <div className="h-[22rem] rounded-[1.5rem] border-2 border-black bg-white shadow-[6px_6px_0_0_#000]" />
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-[1.5rem] border-2 border-black bg-white p-6 shadow-[6px_6px_0_0_#000]">
            <div className="h-4 w-32 rounded-full bg-black/10" />
            <div className="mt-4 h-10 w-full max-w-xl rounded-2xl bg-black/10" />
          </div>

          <div className="rounded-[2rem] border-4 border-black bg-[#fff7d6] px-8 py-7 text-center shadow-[8px_8px_0_0_#000]">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-black border-t-[#00d1ff]" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-black/60">Membuka dashboard</p>
            <p className="mt-2 text-base font-semibold text-black">Data sedang dimuat...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
