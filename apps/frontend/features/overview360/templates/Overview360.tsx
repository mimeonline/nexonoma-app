"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Button } from "@/components/ui/atoms/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { Overview360Response } from "@/types/overview360";

const INITIAL_VISIBLE_COUNT = 6;

type SectionKey = keyof Overview360Response;

const sectionOrder: { key: SectionKey; i18nKey: "foundational" | "structural" | "atomic" }[] = [
  { key: "foundational", i18nKey: "foundational" },
  { key: "structural", i18nKey: "structural" },
  { key: "atomic", i18nKey: "atomic" },
];

type Overview360TemplateProps = {
  data: Overview360Response;
};

const toCatalogTypeSlug = (value: string) => value.toLowerCase();

export function Overview360Template({ data }: Overview360TemplateProps) {
  const [search, setSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    foundational: false,
    structural: false,
    atomic: false,
  });
  const { t, lang } = useI18n();
  const router = useRouter();
  const localePrefix = lang ? `/${lang}` : "";

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;

    const matchesTerm = (value?: string | null) => (value ?? "").toLowerCase().includes(term);

    return {
      foundational: data.foundational.filter((item) => matchesTerm(item.name) || matchesTerm(item.shortDescription)),
      structural: data.structural.filter((item) => matchesTerm(item.name) || matchesTerm(item.shortDescription)),
      atomic: data.atomic.filter((item) => matchesTerm(item.name) || matchesTerm(item.shortDescription)),
    };
  }, [data, search]);

  const translateTypeLabel = (value: string) => {
    const key = `asset.labels.${value.toLowerCase()}`;
    return t(key);
  };

  return (
    <div className="space-y-10 pb-16">
      <header className="space-y-6">
        <div className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden select-none md:block">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle,rgba(255,255,255,0.10)_1px,transparent_1px),radial-gradient(120%_80%_at_85%_20%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(110%_70%_at_70%_55%,rgba(255,255,255,0.07),transparent_75%)] bg-size-[26px_26px] mask-[linear-gradient(90deg,transparent_0%,transparent_18%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,1)_70%,rgba(0,0,0,1)_100%)]" />
            <div className="absolute inset-0 opacity-22 bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_55%)]" />
          </div>
          <div className="relative z-10">
            <SectionTitle
              badge={t("overview360.hero.badge")}
              title={t("overview360.hero.title")}
              description={t("overview360.hero.subtitle")}
              className="mb-0"
            />
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("overview360.comparison.catalogLabel")}</span>
            <p className="text-sm text-slate-200/80 leading-relaxed">{t("overview360.comparison.catalogDescription")}</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("overview360.comparison.overviewLabel")}</span>
            <p className="text-sm text-slate-200/80 leading-relaxed">{t("overview360.comparison.overviewDescription")}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 h-11">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-slate-300">
              <circle cx="11" cy="11" r="7" strokeWidth="1.5" />
              <path strokeWidth="1.5" d="m16.5 16.5 3 3" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("overview360.search.placeholder")}
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {sectionOrder.map((section) => {
          const sectionItems = filteredItems[section.key] ?? [];
          const isExpanded = expandedSections[section.key];
          const visibleItems = isExpanded ? sectionItems : sectionItems.slice(0, INITIAL_VISIBLE_COUNT);
          const showMore = sectionItems.length > INITIAL_VISIBLE_COUNT && !isExpanded;

          return (
            <section key={section.key} className="space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-white md:text-2xl">{t(`overview360.sections.${section.i18nKey}.title`)}</h2>
                  <p className="max-w-2xl text-sm text-slate-200/70 leading-relaxed">{t(`overview360.sections.${section.i18nKey}.description`)}</p>
                </div>
                {showMore && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="self-start md:self-auto text-slate-300 hover:text-white"
                    onClick={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        [section.key]: true,
                      }))
                    }
                  >
                    {t("overview360.actions.showMore")}
                  </Button>
                )}
              </div>

              {visibleItems.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-white/3 px-5 py-4 text-sm text-slate-300/80">
                  {t("overview360.empty.description")}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleItems.map((item) => {
                    const decisionType = item.decisionType ?? "-";
                    const cognitiveLoad = item.cognitiveLoad ?? "-";
                    const typeSlug = toCatalogTypeSlug(item.type ?? "");

                    return (
                      <Card key={item.id} className="flex h-full flex-col border-white/10 bg-white/5 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.65)]">
                        <CardHeader className="space-y-2">
                          <div className="flex items-start">
                            <Badge variant={getBadgeVariant(item.type)} size="sm">
                              {translateTypeLabel(item.type)}
                            </Badge>
                          </div>
                          <div className="flex items-start gap-3 mb-2">
                            <DynamicIcon name={item.icon ?? undefined} className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                            <CardTitle className="group-hover:text-white">{item.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-slate-200/80 leading-relaxed line-clamp-2">{item.shortDescription}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200/80">
                              {t("overview360.meta.decisionType")}: <span className="text-slate-100">{decisionType}</span>
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200/80">
                              {t("overview360.meta.cognitiveLoad")}: <span className="text-slate-100">{cognitiveLoad}</span>
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center">
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => router.push(`${localePrefix}/content/${typeSlug}/${item.slug}`)}
                          >
                            {t("overview360.actions.view360")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => router.push(`${localePrefix}/catalog/${typeSlug}/${item.slug}`)}
                          >
                            {t("overview360.actions.openCatalog")}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
