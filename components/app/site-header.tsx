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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_24%),radial-gradient(circle_at_85%_15%,_rgba(59,130,246,0.18),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#081121_40%,_#0b1326_100%)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight !text-white">
          Harian Store
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className="!text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="!text-white hover:bg-white/10 hover:text-white">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm" className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
            <Link href="/register">Mulai Sekarang</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
