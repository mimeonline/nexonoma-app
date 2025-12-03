import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nexonoma",
    default: "Nexonoma – Knowledge Navigation for Architects",
  },
  description: "Ein visuelles Wissenssystem für Software- und Enterprise-Architektur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-nexo-bg text-nexo-text`}>
        <header role="banner" className="sticky top-0 z-30 bg-[#0B1220]/80 backdrop-blur-md">
          <Header />
        </header>
        <main role="main" className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12 sm:py-16">
          {children}
        </main>
        <footer role="contentinfo" className="w-full border-t border-white/5 py-6 text-center text-sm text-slate-400/70">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
