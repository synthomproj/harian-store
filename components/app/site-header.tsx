import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/#solutions", label: "Solusi" },
  { href: "/#how-it-works", label: "Cara Kerja" },
  { href: "/#pricing", label: "Harga" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-[#ff6b6b]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-black tracking-tight text-black">
          Harian Store
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className="font-bold text-black hover:bg-white/40"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="bg-white font-bold hover:bg-[#ffe066]">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm" className="bg-[#00d1ff] font-bold hover:bg-[#7cecff]">
            <Link href="/register">Mulai Sekarang</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
