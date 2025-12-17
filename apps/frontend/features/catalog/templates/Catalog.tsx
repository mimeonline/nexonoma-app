"use client";

import { useMemo, useState } from "react";

import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import type { CatalogItem } from "@/types/catalog";
import { TypeFilterChips } from "../molecules/TypeFilterChips";
import { CatalogGrid } from "../organisms/CatalogGrid";

type FilterType = "all" | "concept" | "method" | "tool" | "technology";

const typeOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "concept", label: "Concepts" },
  { value: "method", label: "Methods" },
  { value: "tool", label: "Tools" },
  { value: "technology", label: "Technologies" },
];

interface CatalogTemplateProps {
  items: CatalogItem[];
}

export function CatalogTemplate({ items }: CatalogTemplateProps) {
  const loading = false;
  const error: string | null = null;
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<FilterType>("all");

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

  const showEmptyState = !loading && !error && filteredItems.length === 0;

  return (
    <>
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">Catalog</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold sm:text-4xl">Nexonoma Katalog</h1>
            <p className="max-w-2xl text-base text-slate-200/80">
              Alle Content-Bausteine (Concepts, Methods, Tools, Technologies) in einer kompakten Übersicht. Suche, filtere nach Typ und wechsle direkt
              in die Detailansicht.
            </p>
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
              placeholder="Suche nach Namen oder Kurzbeschreibung..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <TypeFilterChips options={typeOptions} activeType={activeType} onSelect={(type) => setActiveType(type as FilterType)} />
        </div>

        {activeType === "all" && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200/80">
            {["concept", "method", "tool", "technology"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t as FilterType)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:border-white/40"
              >
                <Badge variant={getBadgeVariant(t)} size="lg">
                  {t}
                </Badge>
                <span className="text-slate-100">{(typeCounts as Record<string, number>)[t] ?? 0} Stück</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {loading && <p className="text-sm text-slate-200/80">Lade Catalog-Daten...</p>}
      {error && <p className="text-sm text-red-300">Catalog-Daten konnten nicht geladen werden: {error}</p>}

      {showEmptyState && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-slate-200">
          Keine Einträge gefunden. Filter oder Suchbegriff anpassen.
        </div>
      )}

      {!showEmptyState && <CatalogGrid items={filteredItems} />}
    </>
  );
}
