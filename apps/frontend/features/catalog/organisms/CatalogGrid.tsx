import Link from "next/link";

import type { CatalogItem } from "@/types/catalog";

import { TypeBadge, normalizeCatalogType } from "../atoms/TypeBadge";

interface CatalogGridProps {
  items: CatalogItem[];
}

export function CatalogGrid({ items }: CatalogGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const type = normalizeCatalogType(typeof item.type === "string" ? item.type : "");
        const badgeType = type === "unknown" ? item.type : type;

        return (
          <Link
            key={`${item.id}-${item.slug}`}
            href={`/catalog/${item.type}/${item.slug}`}
            className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <TypeBadge type={String(badgeType)} />
              <div className="text-right text-xs text-slate-300">
                {item.segmentName && <div>Segment: {item.segmentName}</div>}
                {!item.segmentName && item.clusterName && <div>Cluster: {item.clusterName}</div>}
                {!item.segmentName && !item.clusterName && item.macroClusterName && <div>Macro: {item.macroClusterName}</div>}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white line-clamp-2">{item.name}</h3>
              <p className="text-sm text-slate-200/80 line-clamp-3">{item.shortDescription || "Keine Kurzbeschreibung vorhanden."}</p>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
