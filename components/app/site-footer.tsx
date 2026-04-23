import Link from "next/link";

const footerLinks = {
  produk: [
    { href: "/products", label: "Paket Meeting" },
    { href: "/register", label: "Buat Akun" },
    { href: "/login", label: "Masuk" },
  ],
  alur: [
    { href: "/#how-it-works", label: "Cara Kerja" },
    { href: "/#pricing", label: "Harga" },
    { href: "/#faq", label: "FAQ" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Harian Store
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Pemesanan meeting Zoom yang rapi dari order sampai link siap dibagikan.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Layanan meeting Zoom yang dibuat simpel untuk kebutuhan personal, kelas online,
            komunitas, dan UMKM yang ingin serba praktis.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Produk
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            {footerLinks.produk.map((item) => (
              <Link key={item.href} href={item.href} className="block transition-colors hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Navigasi
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            {footerLinks.alur.map((item) => (
              <Link key={item.href} href={item.href} className="block transition-colors hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
