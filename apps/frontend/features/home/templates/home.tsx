"use client";

import { Button } from "@/components/ui/atoms/Button";
import { useI18n } from "@/features/i18n/I18nProvider";
import { ArrowRight, BookOpen, GitGraph, LayoutGrid } from "lucide-react"; // Installiere lucide-react falls nicht vorhanden, oder nutze FA
import { usePathname, useRouter } from "next/navigation";

export default function HomeTemplate() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.match(/^\/(de|en)(\/|$)/)?.[1];
  const localePrefix = locale ? `/${locale}` : "";

  // Navigation Helper
  const navigate = (path: string) => router.push(`${localePrefix}${path}`);

  return (
    <div className="min-h-full w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* HEADER: Willkommen & Kontext */}
      <header className="mb-12 text-center sm:text-left max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">{t("home.start.intro.line1")}</h1>
        <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
          {t("home.start.intro.line2")}
          <span className="block sm:inline sm:ml-1 opacity-70">{t("home.start.intro.line3")}</span>
        </p>
      </header>

      {/* MAIN GRID: Die 3 Einstiege (Bento Style) */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* CARD 1: KATALOG (Primary Action) */}
        <div
          onClick={() => navigate("/catalog")}
          className="h-full group relative cursor-pointer overflow-hidden rounded-2xl border border-teal-500/30 bg-linear-to-b from-[#101A2E] to-[#0B1220] p-6 transition-all duration-300 hover:border-teal-400/60 hover:shadow-[0_0_30px_-10px_rgba(20,184,166,0.2)] md:col-span-1 flex flex-col"
        >
          {/* Hover Glow */}
          <div className="absolute inset-0 bg-teal-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
            {/* Icon placeholder or Lucide Icon */}
            <BookOpen className="w-7 h-7" />
          </div>

          <h3 className="relative z-10 text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
            {t("home.start.cards.catalog.title")}
          </h3>
          <p className="relative z-10 text-sm text-gray-400 mb-8 leading-relaxed grow">{t("home.start.cards.catalog.description")}</p>

          <div className="relative z-10 mt-auto">
            <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg shadow-teal-900/20 group-hover:shadow-teal-500/20 transition-all">
              {t("home.start.cards.catalog.cta")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* CARD 2: STRUKTUR (Secondary) */}
        <div
          onClick={() => navigate("/grid")}
          className="h-full group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0F1623] p-6 transition-all duration-300 hover:border-blue-400/40 hover:bg-[#131d2e] flex flex-col"
        >
          <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:rotate-3 transition-transform">
            <GitGraph className="w-7 h-7" />
          </div>

          <h3 className="relative z-10 text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            {t("home.start.cards.structure.title")}
          </h3>
          <p className="relative z-10 text-sm text-gray-400 mb-8 leading-relaxed grow">{t("home.start.cards.structure.description")}</p>

          <div className="relative z-10 mt-auto">
            <Button variant="secondary" className="w-full border-blue-500/10 text-blue-100 hover:text-white hover:bg-blue-500/20">
              {t("home.start.cards.structure.cta")}
            </Button>
          </div>
        </div>

        {/* CARD 3: PREVIEW (Ghost/Experimental) */}
        <div
          onClick={() => navigate("/preview")}
          className="h-full group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-[#0B1220] p-6 transition-all duration-300 hover:border-purple-400/40 hover:bg-[#0E1525] flex flex-col"
        >
          {/* Decorative Background Pattern */}
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
            </div>
          </div>

          <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:-translate-y-1 transition-transform">
            <LayoutGrid className="w-7 h-7" />
          </div>

          <h3 className="relative z-10 text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
            {t("home.start.cards.preview.title") || "Preview & Matrix"}
          </h3>
          <p className="relative z-10 text-sm text-gray-400 mb-8 leading-relaxed grow">{t("home.start.cards.preview.description")}</p>

          <div className="relative z-10 mt-auto">
            <Button variant="ghost" className="w-full text-gray-400 hover:text-purple-300 hover:bg-purple-500/10">
              {t("home.start.cards.preview.cta")}
            </Button>
          </div>
        </div>
      </div>

      {/* FOOTER AREA: Quick Context */}
      <section className="mt-16 border-t border-white/5 pt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <h4 className="text-sm font-semibold text-white">{t("home.start.about.title")}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t("home.start.about.line1")} {t("home.start.about.line2")}
              <br />
              {t("home.start.about.hint")}
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://nexonoma.de/wissensmodell"
              target="_blank"
              className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              Modell-Erklärung <ArrowRight className="w-3 h-3" />
            </a>
            <a href="https://nexonoma.de/feedback" target="_blank" className="text-xs font-medium text-gray-400 hover:text-white transition-colors">
              Feedback geben
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
