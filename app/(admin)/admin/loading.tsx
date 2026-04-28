export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-slate-300" />
        <p className="mt-4 text-sm font-semibold text-slate-900">Memuat halaman admin...</p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="h-32 rounded-2xl border border-slate-200 bg-white shadow-sm" />
        <div className="h-32 rounded-2xl border border-slate-200 bg-white shadow-sm" />
        <div className="h-32 rounded-2xl border border-slate-200 bg-white shadow-sm" />
        <div className="h-32 rounded-2xl border border-slate-200 bg-white shadow-sm" />
      </section>
    </div>
  );
}
