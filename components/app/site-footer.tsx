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
    <footer className="border-t-4 border-black bg-[#00d1ff] text-black">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-black">
              Harian Store
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-black">
              Pemesanan meeting Zoom yang rapi dari order sampai link siap dibagikan.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-black/75">
            Layanan meeting Zoom yang dibuat simpel untuk kebutuhan personal, kelas online,
            komunitas, dan UMKM yang ingin serba praktis.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-black/70">
            Produk
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            {footerLinks.produk.map((item) => (
              <Link key={item.href} href={item.href} className="block font-semibold transition-colors hover:text-black/65">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-black/70">
            Navigasi
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            {footerLinks.alur.map((item) => (
              <Link key={item.href} href={item.href} className="block font-semibold transition-colors hover:text-black/65">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
