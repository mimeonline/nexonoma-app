"use client";

import { fetchCatalog } from "@/lib/api/catalog";
import type { CatalogItem } from "@/types/catalog";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FilterType = "all" | "concept" | "method" | "tool" | "technology";

const typeOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "concept", label: "Concepts" },
  { value: "method", label: "Methods" },
  { value: "tool", label: "Tools" },
  { value: "technology", label: "Technologies" },
];

function typeBadgeClasses(type: string) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide";

  switch (type.toLowerCase()) {
    case "concept":
      return `${base} bg-indigo-500/20 text-indigo-200 border border-indigo-400/40`;
    case "method":
      return `${base} bg-amber-500/20 text-amber-200 border border-amber-400/40`;
    case "tool":
      return `${base} bg-emerald-500/20 text-emerald-200 border border-emerald-400/40`;
    case "technology":
      return `${base} bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-400/40`;
    default:
      return `${base} bg-slate-500/20 text-slate-200 border border-slate-400/40`;
  }
}

function normalizeType(type?: string): FilterType | "unknown" {
  const t = (type ?? "").toLowerCase();
  if (t === "concept" || t === "method" || t === "tool" || t === "technology") {
    return t;
  }
  return "unknown";
}

export default function CatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<FilterType>("all");

  useEffect(() => {
    fetchCatalog()
      .then((response) => setItems(response.data.items ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : "Unbekannter Fehler"))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const itemType = normalizeType(typeof item.type === "string" ? item.type : "");

      const matchesType = activeType === "all" ? true : itemType === activeType;

      const matchesSearch =
        term.length === 0 ||
        [item.name, item.shortDescription]
          .filter(Boolean)
          .some((field) => (field as string).toLowerCase().includes(term));

      return matchesType && matchesSearch;
    });
  }, [items, activeType, search]);

  const typeCounts = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const t = normalizeType(typeof item.type === "string" ? item.type : "");
        if (t === "unknown") return acc;
        acc[t] = (acc[t] ?? 0) + 1;
        return acc;
      },
      {
        concept: 0,
        method: 0,
        tool: 0,
        technology: 0,
      } as Record<Exclude<FilterType, "all">, number>,
    );
  }, [items]);

  const showEmptyState = !loading && !error && filteredItems.length === 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] via-[#0f1933] to-[#111827] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-14 pt-10 sm:pt-16 sm:pb-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">
            Catalog
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold sm:text-4xl">Nexonoma Katalog</h1>
              <p className="max-w-2xl text-base text-slate-200/80">
                Alle Content-Bausteine (Concepts, Methods, Tools, Technologies) in einer
                kompakten Übersicht. Suche, filtere nach Typ und wechsle direkt in die
                Detailansicht.
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-white/10" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4 text-slate-300"
              >
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

            <div className="flex flex-wrap gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setActiveType(opt.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                    activeType === opt.value
                      ? "bg-white text-slate-900 shadow"
                      : "border border-white/20 text-slate-200 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {activeType === "all" && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200/80">
              {["concept", "method", "tool", "technology"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t as FilterType)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:border-white/40"
                >
                  <span className={typeBadgeClasses(t)}>{t.toUpperCase()}</span>
                  <span className="text-slate-100">
                    {(typeCounts as Record<string, number>)[t] ?? 0} Stück
                  </span>
                </button>
              ))}
            </div>
          )}
        </header>

        {loading && <p className="text-sm text-slate-200/80">Lade Catalog-Daten...</p>}
        {error && (
          <p className="text-sm text-red-300">
            Catalog-Daten konnten nicht geladen werden: {error}
          </p>
        )}

        {showEmptyState && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-slate-200">
            Keine Einträge gefunden. Filter oder Suchbegriff anpassen.
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const type = normalizeType(typeof item.type === "string" ? item.type : "");
              const badgeType = type === "unknown" ? item.type : type;

              return (
                <Link
                  key={`${item.id}-${item.slug}`}
                  href={`/catalog/${item.type}/${item.slug}`}
                  className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={typeBadgeClasses(String(badgeType))}>
                      {String(badgeType).toUpperCase()}
                    </span>
                    <div className="text-right text-xs text-slate-300">
                      {item.segmentName && <div>Segment: {item.segmentName}</div>}
                      {!item.segmentName && item.clusterName && (
                        <div>Cluster: {item.clusterName}</div>
                      )}
                      {!item.segmentName && !item.clusterName && item.macroClusterName && (
                        <div>Macro: {item.macroClusterName}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-200/80 line-clamp-3">
                      {item.shortDescription || "Keine Kurzbeschreibung vorhanden."}
                    </p>
                  </div>

               </Link>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
