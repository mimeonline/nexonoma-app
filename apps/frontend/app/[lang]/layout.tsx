import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

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
    <html lang="de" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-nexo-bg text-nexo-text antialiased min-h-screen flex flex-col font-sans selection:bg-nexo-aqua selection:text-nexo-bg`}
      >
        <header role="banner" className="sticky top-0 z-50 bg-nexo-bg/80 backdrop-blur-md border-b border-nexo-border">
          <Header />
        </header>
        <main className="grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">{children}</main>
        <footer role="contentinfo" className="w-full border-t border-white/5 py-6 text-center text-sm text-slate-400/70">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
