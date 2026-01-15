"use client";

import { Button } from "@/components/ui/atoms/Button";
import { useI18n } from "@/features/i18n/I18nProvider";
import { ArrowRight, BookOpen, GitGraph, Globe, LayoutGrid, Rows3 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function HomeTemplate() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.match(/^\/(de|en)(\/|$)/)?.[1];
  const localePrefix = locale ? `/${locale}` : "";

  const navigate = (path: string) => router.push(`${localePrefix}${path}`);

  return (
    <div className="min-h-full w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* HERO + QUICK START */}
      <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:gap-10 items-start">
        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-300">
            {t("home.start.hero.badge")}
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300">{t("home.start.hero.line1")}</span>
          </h1>

          <div className="mt-4 max-w-2xl">
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              {t("home.start.hero.line2")}
              <span className="block sm:inline sm:ml-1 opacity-70">{t("home.start.hero.line3")}</span>
            </p>
          </div>
        </header>

        <aside className="rounded-2xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <div className="text-sm font-semibold text-white">
            {t("home.start.quickSteps.title")}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            {t("home.start.quickSteps.subtitle")}
          </p>

          <ol className="mt-4 space-y-3">
            <li className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-teal-300 to-teal-500 text-[#04121a] text-xs font-bold">
                1
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">
                  {t("home.start.quickSteps.steps.discover.title")}
                </div>
                <div className="text-xs leading-relaxed text-slate-400">
                  {t("home.start.quickSteps.steps.discover.description.before")}{" "}
                  <span className="text-slate-200">{t("home.start.quickSteps.steps.discover.description.highlight")}</span>{" "}
                  {t("home.start.quickSteps.steps.discover.description.after")}
                </div>
              </div>
            </li>

            <li className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-teal-300 to-teal-500 text-[#04121a] text-xs font-bold">
                2
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">
                  {t("home.start.quickSteps.steps.locate.title")}
                </div>
                <div className="text-xs leading-relaxed text-slate-400">
                  {t("home.start.quickSteps.steps.locate.description.before")}{" "}
                  <span className="text-slate-200">{t("home.start.quickSteps.steps.locate.description.highlight")}</span>{" "}
                  {t("home.start.quickSteps.steps.locate.description.after")}
                </div>
              </div>
            </li>

            <li className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-teal-300 to-teal-500 text-[#04121a] text-xs font-bold">
                3
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">
                  {t("home.start.quickSteps.steps.evaluate.title")}
                </div>
                <div className="text-xs leading-relaxed text-slate-400">
                  {t("home.start.quickSteps.steps.evaluate.description.before")}{" "}
                  <span className="text-slate-200">{t("home.start.quickSteps.steps.evaluate.description.highlight")}</span>{" "}
                  {t("home.start.quickSteps.steps.evaluate.description.after")}
                </div>
              </div>
            </li>
          </ol>
        </aside>
      </div>

      {/* PRIMARY ENTRY CARDS */}
      <section className="mt-10 sm:mt-12">
        <div className="grid gap-6 md:grid-cols-3">
          {/* KATALOG */}
          <div
            onClick={() => navigate("/catalog")}
            className="h-full group relative cursor-pointer overflow-hidden rounded-2xl border border-teal-500/30 bg-linear-to-b from-[#101A2E] to-[#0B1220] p-6 transition-all duration-300 hover:border-teal-400/60 hover:shadow-[0_0_30px_-10px_rgba(20,184,166,0.2)] flex flex-col"
          >
            <div className="absolute inset-0 bg-teal-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>

            <h3 className="relative z-10 text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
              {t("home.start.cards.catalog.title")}
            </h3>
            <p className="relative z-10 text-sm text-gray-400 mb-7 leading-relaxed grow">{t("home.start.cards.catalog.description")}</p>

            <div className="relative z-10 mt-auto">
              <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg shadow-teal-900/20 group-hover:shadow-teal-500/20 transition-all">
                {t("home.start.cards.catalog.cta")} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* STRUKTUR */}
          <div
            onClick={() => navigate("/grid")}
            className="h-full group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0F1623] p-6 transition-all duration-300 hover:border-blue-400/40 hover:bg-[#131d2e] flex flex-col"
          >
            <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:rotate-3 transition-transform">
              <GitGraph className="w-7 h-7" />
            </div>

            <h3 className="relative z-10 text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
              {t("home.start.cards.structure.title")}
            </h3>
            <p className="relative z-10 text-sm text-gray-400 mb-7 leading-relaxed grow">{t("home.start.cards.structure.description")}</p>

            <div className="relative z-10 mt-auto">
              <Button variant="secondary" className="w-full border-blue-500/10 text-blue-100 hover:text-white hover:bg-blue-500/20">
                {t("home.start.cards.structure.cta")}
              </Button>
            </div>
          </div>

          {/* 360° */}
          <div
            onClick={() => navigate("/360")}
            className="h-full group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0F1623] p-6 transition-all duration-300 hover:border-teal-400/40 hover:bg-[#131d2e] flex flex-col"
          >
            <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 group-hover:-translate-y-1 transition-transform">
              <Globe className="w-7 h-7" />
            </div>

            <h3 className="relative z-10 text-xl font-bold text-white mb-2 group-hover:text-teal-200 transition-colors">
              {t("home.start.cards.overview360.title")}
            </h3>
            <p className="relative z-10 text-sm text-gray-400 mb-7 leading-relaxed grow">
              {t("home.start.cards.overview360.description")}
            </p>

            <div className="relative z-10 mt-auto">
              <Button variant="secondary" className="w-full border-teal-500/10 text-teal-100 hover:text-white hover:bg-teal-500/20">
                {t("home.start.cards.overview360.cta")}
              </Button>
            </div>
          </div>
        </div>

        {/* SECONDARY ROW: Analyse + Preview */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Analyse / Matrix */}
          <div
            onClick={() => navigate("/matrix")}
            className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-all hover:bg-white/7 hover:border-white/15 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-200/80">
                {t("home.start.matrix.badge")}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {t("home.start.matrix.title")}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {t("home.start.matrix.description")}
                </div>
              </div>
            </div>

            <div className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-slate-200/80 group-hover:text-white">
              <LayoutGrid className="h-4 w-4 opacity-80" />
              {t("home.start.matrix.cta")}
            </div>
          </div>

          {/* Preview */}
          <div
            onClick={() => navigate("/preview")}
            className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-all hover:bg-white/7 hover:border-white/15 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-200/80">
                {t("home.start.preview.badge")}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{t("home.start.preview.title")}</div>
                <div className="text-xs text-slate-400 leading-relaxed line-clamp-2">{t("home.start.preview.description")}</div>
              </div>
            </div>

            <div className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-slate-200/80 group-hover:text-white">
              <Rows3 className="h-4 w-4 opacity-80" />
              {t("home.start.preview.cta")}
            </div>
          </div>
        </div>
      </section>

      {/* CONTEXT / FOOTER NOTE (kept) */}
      <section className="mt-14 border-t border-white/10 pt-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h4 className="text-sm font-semibold text-white">{t("home.start.about.title")}</h4>

            <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-400">
              <p>{t("home.start.about.line1")}</p>
              <p>{t("home.start.about.line2")}</p>
              <p className="text-slate-500">{t("home.start.about.hint")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://nexonoma.de/wissensmodell"
              target="_blank"
              className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              {t("home.start.footer.modelLink")} <ArrowRight className="w-3 h-3" />
            </a>
            <span className="text-white/10">•</span>
            <a href="https://nexonoma.de/feedback" target="_blank" className="text-xs font-medium text-gray-400 hover:text-white transition-colors">
              {t("home.start.footer.feedbackLink")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
