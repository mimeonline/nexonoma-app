"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/atoms/Button";
import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { ExpandableDescription } from "@/components/ui/molecules/ExpandableDescription";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { CatalogItem } from "@/types/catalog";
import { usePathname, useRouter } from "next/navigation";
import { CatalogGrid } from "../organisms/CatalogGrid";

type FilterType = "all" | "concept" | "method" | "tool" | "technology";

interface CatalogTemplateProps {
  items: CatalogItem[];
}

export function CatalogTemplate({ items }: CatalogTemplateProps) {
  const loading = false;
  const error: string | null = null;
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<FilterType>("all");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [page, setPage] = useState(1);
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.match(/^\/(de|en)(\/|$)/)?.[1];
  const localePrefix = locale ? `/${locale}` : "";
  const descriptionLines = useMemo(
    () =>
      [t("catalog.page.description.line1"), t("catalog.page.description.line2"), t("catalog.page.description.line3")].filter(
        (line) => typeof line === "string" && line.trim().length > 0
      ),
    [t]
  );

  const filterTypeOptions = useMemo(
    () =>
      [
        { value: "all", label: t("catalog.filtersMeta.typeOptions.all") },
        { value: "concept", label: t("catalog.filtersMeta.typeOptions.concept") },
        { value: "method", label: t("catalog.filtersMeta.typeOptions.method") },
        { value: "tool", label: t("catalog.filtersMeta.typeOptions.tool") },
        { value: "technology", label: t("catalog.filtersMeta.typeOptions.technology") },
      ] as { value: FilterType; label: string }[],
    [t]
  );

  function normalizeCatalogType(type?: string) {
    const normalized = (type ?? "").toLowerCase();
    if (normalized === "concept" || normalized === "method" || normalized === "tool" || normalized === "technology") {
      return normalized as "concept" | "method" | "tool" | "technology";
    }
    return "unknown" as const;
  }

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const itemType = normalizeCatalogType(typeof item.type === "string" ? item.type : "");

      const matchesType = activeType === "all" ? true : itemType === activeType;

      const matchesSearch =
        term.length === 0 || [item.name, item.shortDescription].filter(Boolean).some((field) => (field as string).toLowerCase().includes(term));

      return matchesType && matchesSearch;
    });
  }, [items, activeType, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  const currentPage = Math.min(page, totalPages);
  const pagedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, itemsPerPage, currentPage]);

  const typeCounts = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const t = normalizeCatalogType(typeof item.type === "string" ? item.type : "");
        if (t === "unknown") return acc;
        acc[t as Exclude<FilterType, "all">] = (acc[t as Exclude<FilterType, "all">] ?? 0) + 1;
        return acc;
      },
      {
        concept: 0,
        method: 0,
        tool: 0,
        technology: 0,
      } as Record<Exclude<FilterType, "all">, number>
    );
  }, [items]);

  const typeTabs = useMemo(
    () =>
      filterTypeOptions.map((option) => {
        const count = option.value === "all" ? items.length : (typeCounts[option.value as Exclude<FilterType, "all">] ?? 0);
        return { ...option, count };
      }),
    [filterTypeOptions, items.length, typeCounts]
  );

  const hasItems = items.length > 0;
  const showFilteredEmptyState = !loading && !error && hasItems && filteredItems.length === 0;
  const showCuratedEmptyState = !loading && !error && !hasItems;

  return (
    <>
      <header className="space-y-6">
        <div className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden select-none md:block">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle,rgba(255,255,255,0.10)_1px,transparent_1px),radial-gradient(120%_80%_at_85%_20%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(110%_70%_at_70%_55%,rgba(255,255,255,0.07),transparent_75%)] bg-size-[26px_26px] mask-[linear-gradient(90deg,transparent_0%,transparent_18%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,1)_70%,rgba(0,0,0,1)_100%)]" />
            <div className="absolute inset-0 opacity-22 bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_55%)]" />
          </div>
          <div className="relative z-10 space-y-3">
            <SectionTitle
              badge={t("catalog.title")}
              title={t("catalog.page.heading")}
              description={
                descriptionLines.length > 0 ? (
                  <ExpandableDescription
                    lines={descriptionLines}
                    collapsedLines={1}
                    labels={{
                      show: t("catalog.page.descriptionToggle.show"),
                      hide: t("catalog.page.descriptionToggle.hide"),
                    }}
                    storageKey="catalog:introExpanded"
                    textClassName="text-sm text-slate-200/70"
                  />
                ) : undefined
              }
              className="mb-0"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 h-11">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-slate-300">
                <circle cx="11" cy="11" r="7" strokeWidth="1.5" />
                <path strokeWidth="1.5" d="m16.5 16.5 3 3" />
              </svg>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={t("catalog.search.placeholder")}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex w-full shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 h-11 sm:w-[200px]">
              <span className="sr-only">{t("catalog.pagination.itemsPerPage")}</span>
              <select
                value={itemsPerPage}
                onChange={(event) => {
                  setItemsPerPage(Number(event.target.value));
                  setPage(1);
                }}
                className="w-full bg-transparent text-sm text-white focus:outline-none h-full whitespace-nowrap"
                aria-label={t("catalog.pagination.itemsPerPage")}
              >
                {[12, 24, 36, 48].map((value) => (
                  <option key={value} value={value} className="bg-slate-900 text-white">
                    {`${value} ${t("catalog.pagination.perPageSuffix") ?? "pro Seite"}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-nowrap items-center gap-2 px-1 md:gap-3 md:px-0">
            {typeTabs.map((tab) => {
              const isActive = activeType === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setActiveType(tab.value as FilterType);
                    setPage(1);
                  }}
                  className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-nexo-ocean/60 bg-nexo-ocean/10 text-white"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span
                    className={`min-w-9 rounded-full px-2 py-0.5 text-xs font-semibold leading-none ${
                      isActive ? "bg-white/90 text-slate-900" : "bg-white/10 text-slate-100"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {loading && <p className="text-sm text-slate-200/80">{t("catalog.messages.loading")}</p>}
      {error && <p className="text-sm text-red-300">{t("catalog.messages.error", { error })}</p>}

      {showCuratedEmptyState && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-slate-200">
          <p className="text-sm font-semibold text-slate-100">{t("emptyStates.curated.title")}</p>
          <p className="mt-2 text-sm text-slate-200/80">{t("emptyStates.curated.line1")}</p>
          <p className="text-sm text-slate-200/80">{t("emptyStates.curated.line2")}</p>
          <div className="mt-4 flex justify-center">
            <Button variant="secondary" onClick={() => router.push(`${localePrefix}/grid`)}>
              {t("emptyStates.curated.actionStructure")}
            </Button>
          </div>
        </div>
      )}

      {showFilteredEmptyState && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-slate-200">
          <p className="text-sm font-semibold text-slate-100">{t("emptyStates.filtered.title")}</p>
          <p className="mt-2 text-sm text-slate-200/80">{t("emptyStates.filtered.line1")}</p>
          <p className="text-sm text-slate-200/80">{t("emptyStates.filtered.line2")}</p>
          <div className="mt-4 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setActiveType("all");
              }}
            >
              {t("emptyStates.filtered.actionReset")}
            </Button>
          </div>
        </div>
      )}

      {!showCuratedEmptyState && !showFilteredEmptyState && (
        <>
          <CatalogGrid items={pagedItems} />

          {filteredItems.length > 0 && totalPages > 1 && (
            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button variant="ghost" onClick={() => setPage(1)} disabled={currentPage === 1}>
                  {t("catalog.pagination.first")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setPage((prev) => Math.max(1, Math.min(totalPages, prev) - 1))}
                  disabled={currentPage === 1}
                >
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
            </div>
          )}
        </>
      )}
    </>
  );
}
