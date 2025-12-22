import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

import { I18nProvider } from "@/features/i18n/I18nProvider";
import Script from "next/script";
import { getDictionary, hasLocale } from "./dictionaries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nexonoma",
    default: "Nexonoma – Knowledge Navigation for Architects",
  },
  description: "Ein visuelles Wissenssystem für Software- und Enterprise-Architektur",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} bg-nexo-bg text-nexo-text antialiased min-h-screen flex flex-col font-sans selection:bg-nexo-aqua selection:text-nexo-bg`}
      >
        <Script src="https://stats.nexonoma.de/api/script.js" data-site-id="3829ae94680e" strategy="afterInteractive" />
        <I18nProvider lang={lang} dict={dict}>
          <header role="banner" className="sticky top-0 z-50 bg-nexo-bg/80 backdrop-blur-md border-b border-nexo-border">
            <Header />
          </header>

          <main className="grow w-full">{children}</main>

          <footer role="contentinfo" className="w-full border-t border-white/5 py-6 text-center text-sm text-slate-400/70">
            <Footer />
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}
