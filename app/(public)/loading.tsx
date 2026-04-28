export default function PublicLoading() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="rounded-[2rem] border-4 border-black bg-white px-8 py-7 text-center shadow-[8px_8px_0_0_#000]">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-black border-t-[#00d1ff]" />
        <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-black/60">Memuat halaman</p>
        <p className="mt-2 text-base font-semibold text-black">Mohon tunggu sebentar...</p>
      </div>
    </main>
  );
}
