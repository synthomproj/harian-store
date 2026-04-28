"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { logo as HarianStoreLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/#solutions", label: "Solusi" },
  { href: "/#how-it-works", label: "Cara Kerja" },
  { href: "/#pricing", label: "Harga" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "border-b-4 border-black bg-[#ff8fab] shadow-[0_6px_0_0_#000]"
          : "border-b-4 border-b-transparent border-l-transparent border-r-transparent border-t-transparent bg-transparent shadow-none"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-2xl border-2 border-black bg-white px-3 py-2 shadow-[4px_4px_0_0_#000] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#000]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#ffe066] p-1">
            <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full">
              <HarianStoreLogo />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-black/60">Zoom Rental</p>
            <p className="truncate text-base font-black tracking-tight text-black sm:text-lg">Harian Store</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full border-2 border-transparent px-4 font-black text-black hover:border-black hover:bg-white"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Button asChild variant="outline" size="sm" className="rounded-full border-2 border-black bg-white px-5 font-black hover:bg-[#ffe066]">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full border-2 border-black bg-[#00d1ff] px-5 font-black text-black shadow-[4px_4px_0_0_#000] hover:bg-[#7cecff] hover:text-black">
            <Link href="/register">Mulai Sekarang</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-11 w-11 rounded-xl border-2 border-black bg-white p-0 hover:bg-[#ffe066]"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="border-t-4 border-black bg-[#ff8fab] px-4 pb-4 sm:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="justify-start rounded-xl border-2 border-transparent px-3 font-black text-black hover:border-black hover:bg-[#fff7d6]"
                >
                  <Link href={link.href} onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                  </Link>
                </Button>
              ))}
            </nav>

            <div className="flex flex-col gap-2 border-t-2 border-dashed border-black pt-3">
              <Button asChild variant="outline" size="sm" className="w-full rounded-full border-2 border-black bg-white font-black hover:bg-[#ffe066]">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Masuk
                </Link>
              </Button>
              <Button asChild size="sm" className="w-full rounded-full border-2 border-black bg-[#00d1ff] font-black text-black shadow-[4px_4px_0_0_#000] hover:bg-[#7cecff] hover:text-black">
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  Mulai Sekarang
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
