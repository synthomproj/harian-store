import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalNavigationProgress } from "@/components/app/global-navigation-progress";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harian-store.netlify.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Harian Store",
    template: "%s | Harian Store",
  },
  description: "Layanan sewa meeting Zoom yang simpel untuk personal use, kelas online, dan UMKM.",
  applicationName: "Harian Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GlobalNavigationProgress />
        {children}
      </body>
    </html>
  );
}
