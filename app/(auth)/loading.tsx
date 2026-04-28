export default function AuthLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="rounded-[2rem] border-4 border-black bg-[#fffbef] px-8 py-7 text-center shadow-[8px_8px_0_0_#000]">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-black border-t-[#ff6b6b]" />
        <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-black/60">Menyiapkan halaman</p>
        <p className="mt-2 text-base font-semibold text-black">Mohon tunggu sebentar...</p>
      </div>
    </main>
  );
}
