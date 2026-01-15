"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { InfoPopover } from "@/components/atoms/InfoPopover";
import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Button } from "@/components/ui/atoms/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { SearchInput } from "@/components/ui/molecules/SearchInput";
import { useI18n } from "@/features/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import type { Overview360Response } from "@/types/overview360";

const PAGE_SIZE_OPTIONS = [12, 24, 36, 48];
const DEFAULT_PAGE_SIZE = 12;

type SectionKey = keyof Overview360Response;

const sectionsMeta: Array<{
  key: SectionKey;
  i18nKey: "foundational" | "structural" | "atomic";
  tabLabelKey: "fundamental" | "structural" | "atomic";
}> = [
  { key: "foundational", i18nKey: "foundational", tabLabelKey: "fundamental" },
  { key: "structural", i18nKey: "structural", tabLabelKey: "structural" },
  { key: "atomic", i18nKey: "atomic", tabLabelKey: "atomic" },
];

type Overview360TemplateProps = {
  data: Overview360Response;
};

const toCatalogTypeSlug = (value: string) => value.toLowerCase();

export function Overview360Template({ data }: Overview360TemplateProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<SectionKey>("foundational");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [showComparison, setShowComparison] = useState(false);
  const { t, lang } = useI18n();
  const router = useRouter();
  const localePrefix = lang ? `/${lang}` : "";
  const activeItems = data[activeTab] ?? [];

  const filteredActiveItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return activeItems;

    return activeItems.filter((item) => {
      const haystack = `${item.name} ${item.shortDescription}`;
      return haystack.toLowerCase().includes(term);
    });
  }, [activeItems, search]);

  const totalPages = Math.max(1, Math.ceil(filteredActiveItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = filteredActiveItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const tabCounts = sectionsMeta.reduce<Record<SectionKey, number>>(
    (acc, section) => {
      acc[section.key] = data[section.key]?.length ?? 0;
      return acc;
    },
    {
      foundational: 0,
      structural: 0,
      atomic: 0,
    }
  );

  const handleTabChange = (key: SectionKey) => {
    if (key === activeTab) return;
    setActiveTab(key);
    setPage(1);
  };

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const translateTypeLabel = (value: string) => {
    const key = `asset.labels.${value.toLowerCase()}`;
    return t(key);
  };

  const activeMeta = sectionsMeta.find((section) => section.key === activeTab);

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

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            <span className="font-semibold text-slate-200">{t("overview360.comparison.toggle.label")}</span>
            <button
              type="button"
              className="text-[11px] font-semibold text-nexo-aqua underline underline-offset-4 cursor-pointer"
              onClick={() => setShowComparison((prev) => !prev)}
            >
              {showComparison ? t("overview360.comparison.toggle.hide") : t("overview360.comparison.toggle.show")}
            </button>
          </div>
          {showComparison && (
            <div className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[12px] text-slate-300">
              <span className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">Katalog:</span>
                <span className="text-slate-400">{t("overview360.comparison.catalogDescription")}</span>
              </span>
              <span className="hidden h-4 border-l border-white/20 opacity-60 md:inline-flex" aria-hidden="true" />
              <span className="flex items-center gap-2">
                <span className="font-semibold text-nexo-aqua">360°:</span>
                <span className="text-slate-400">{t("overview360.comparison.overviewDescription")}</span>
              </span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1">
              <SearchInput
                value={search}
                onValueChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                onClear={() => {
                  setSearch("");
                  setPage(1);
                }}
                placeholder={t("overview360.search.placeholder")}
                clearLabel={t("overview360.search.clearLabel")}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-white/10 bg-white/5 px-3 h-11 lg:justify-end">
              <span className="sr-only">{t("catalog.pagination.itemsPerPage")}</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="w-full bg-transparent text-sm text-white focus:outline-none h-full whitespace-nowrap"
                aria-label={t("catalog.pagination.itemsPerPage")}
              >
                {PAGE_SIZE_OPTIONS.map((value) => (
                  <option key={value} value={value} className="bg-slate-900 text-white">
                    {`${value} ${t("catalog.pagination.perPageSuffix") ?? "pro Seite"}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sectionsMeta.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = tabCounts[tab.key] ?? 0;
              const label = t(`overview360.tabs.${tab.tabLabelKey}`);
              const tooltip = t(`overview360.tabTooltips.${tab.tabLabelKey}`);

              return (
                <InfoPopover key={tab.key} content={<p>{tooltip}</p>} width={260}>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
                      isActive
                        ? "border-white/60 bg-white/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white"
                    )}
                    onClick={() => handleTabChange(tab.key)}
                  >
                    <span>{label}</span>
                    <span className="text-[10px] text-slate-400">({count})</span>
                  </button>
                </InfoPopover>
              );
            })}
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white md:text-2xl">{activeMeta && t(`overview360.sections.${activeMeta.i18nKey}.title`)}</h2>
            <p className="max-w-2xl text-sm text-slate-200/70 leading-relaxed">
              {activeMeta && t(`overview360.sections.${activeMeta.i18nKey}.description`)}
            </p>
          </div>
          {search.trim().length > 0 && (
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {filteredActiveItems.length} / {activeItems.length} {t("overview360.pagination.resultLabel")}
            </span>
          )}
        </div>

        {pagedItems.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/3 px-5 py-4 text-sm text-slate-300/80">{t("overview360.empty.description")}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pagedItems.map((item) => {
              const typeSlug = toCatalogTypeSlug(item.type ?? "");

              return (
                <Card key={item.id} className="flex h-full flex-col border border-white/5 bg-white/5 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.65)]">
                  <CardHeader className="space-y-2">
                    <Badge variant={getBadgeVariant(item.type)} size="sm">
                      {translateTypeLabel(item.type)}
                    </Badge>
                    <div className="flex items-start gap-3">
                      <DynamicIcon name={item.icon ?? undefined} className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <CardTitle className="group-hover:text-white">{item.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-200/80 leading-relaxed line-clamp-2">{item.shortDescription}</p>
                  </CardContent>
                  <CardFooter className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full sm:w-auto whitespace-nowrap h-6 cursor-pointer"
                      onClick={() => router.push(`${localePrefix}/catalog/${typeSlug}/${item.slug}`)}
                    >
                      {t("overview360.actions.view360")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full sm:w-auto text-slate-300 hover:text-white whitespace-nowrap h-6 cursor-pointer"
                      onClick={() => router.push(`${localePrefix}/content/${typeSlug}/${item.slug}`)}
                    >
                      {t("overview360.actions.openCatalog")}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {filteredActiveItems.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button variant="ghost" onClick={() => setPage(1)} disabled={currentPage === 1}>
              {t("catalog.pagination.first")}
            </Button>
            <Button variant="secondary" onClick={() => setPage((prev) => Math.max(1, Math.min(totalPages, prev) - 1))} disabled={currentPage === 1}>
              {t("catalog.pagination.previous")}
            </Button>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/60">
              {t("catalog.pagination.pageLabel", { page: currentPage, total: totalPages })}
            </span>
            <Button
              variant="primary"
              onClick={() => setPage((prev) => Math.min(totalPages, Math.min(totalPages, prev) + 1))}
              disabled={currentPage === totalPages}
            >
              {t("catalog.pagination.next")}
            </Button>
            <Button variant="ghost" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>
              {t("catalog.pagination.last")}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
