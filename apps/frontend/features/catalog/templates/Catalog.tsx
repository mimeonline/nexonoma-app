"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Button } from "@/components/ui/atoms/Button";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { CatalogItem } from "@/types/catalog";
import { TypeFilterChips } from "../molecules/TypeFilterChips";
import { CatalogGrid } from "../organisms/CatalogGrid";
import { usePathname, useRouter } from "next/navigation";

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

  const translateAssetLabel = (value: string) => {
    const key = `asset.labels.${value.toLowerCase()}`;
    return t(key);
  };

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

  const pagedItems = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, itemsPerPage, page]);

  useEffect(() => {
    setPage(1);
  }, [activeType, itemsPerPage, search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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

  const hasItems = items.length > 0;
  const showFilteredEmptyState = !loading && !error && hasItems && filteredItems.length === 0;
  const showCuratedEmptyState = !loading && !error && !hasItems;

  return (
    <>
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">{t("catalog.title")}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold sm:text-4xl">{t("catalog.page.heading")}</h1>
            <p className="max-w-2xl text-base text-slate-200/80">{t("catalog.page.description")}</p>
          </div>
        </div>

        <div className="h-px w-full bg-white/10" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-slate-300">
              <circle cx="11" cy="11" r="7" strokeWidth="1.5" />
              <path strokeWidth="1.5" d="m16.5 16.5 3 3" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("catalog.search.placeholder")}
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <TypeFilterChips options={filterTypeOptions} activeType={activeType} onSelect={(type) => setActiveType(type as FilterType)} />

          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-300">
              {t("catalog.pagination.itemsPerPage")}
            </span>
            <select
              value={itemsPerPage}
              onChange={(event) => setItemsPerPage(Number(event.target.value))}
              className="bg-transparent text-sm text-white focus:outline-none"
              aria-label={t("catalog.pagination.itemsPerPage")}
            >
              {[12, 24, 36, 48].map((value) => (
                <option key={value} value={value} className="bg-slate-900 text-white">
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeType === "all" && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200/80">
            {["concept", "method", "tool", "technology"].map((typeKey) => {
              const count = (typeCounts as Record<string, number>)[typeKey] ?? 0;
              return (
                <button
                  key={typeKey}
                  onClick={() => setActiveType(typeKey as FilterType)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:border-white/40"
                >
                  <Badge variant={getBadgeVariant(typeKey)} size="lg">
                    {translateAssetLabel(typeKey)}
                  </Badge>
                  <span className="text-slate-100">{t("catalog.filtersMeta.countLabel", { count })}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {loading && <p className="text-sm text-slate-200/80">{t("catalog.messages.loading")}</p>}
      {error && (
        <p className="text-sm text-red-300">{t("catalog.messages.error", { error })}</p>
      )}

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
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button variant="ghost" onClick={() => setPage(1)} disabled={page === 1}>
                {t("catalog.pagination.first")}
              </Button>
              <Button variant="secondary" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
                {t("catalog.pagination.previous")}
              </Button>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/60">
                {t("catalog.pagination.pageLabel", { page, total: totalPages })}
              </span>
              <Button variant="primary" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages}>
                {t("catalog.pagination.next")}
              </Button>
              <Button variant="ghost" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                {t("catalog.pagination.last")}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
