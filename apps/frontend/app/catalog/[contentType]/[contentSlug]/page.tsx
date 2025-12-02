import { fetchCatalog, fetchCatalogItemById } from "@/lib/api/catalog";
import type { CatalogContentType, CatalogItem } from "@/types/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReferrerNav } from "./ReferrerNav";

type PageProps = {
  params: Promise<{ contentType: CatalogContentType; contentSlug: string }> | {
    contentType: CatalogContentType;
    contentSlug: string;
  };
};

const typeLabels: Record<CatalogContentType, string> = {
  concept: "Konzept",
  method: "Methode",
  tool: "Tool",
  technology: "Technologie",
};

const typeStyles: Record<CatalogContentType, string> = {
  method: "bg-purple-500/15 text-purple-200 border-purple-500/30",
  concept: "bg-sky-500/15 text-sky-200 border-sky-500/30",
  tool: "bg-teal-500/15 text-teal-200 border-teal-500/30",
  technology: "bg-amber-500/15 text-amber-200 border-amber-500/30",
};

export default async function ContentDetailPage({ params }: PageProps) {
  const { contentType, contentSlug } = await params;
  const catalog = await fetchCatalog();
  const items = catalog.data?.items ?? [];
  const match = items.find(
    (item) =>
      item.slug === contentSlug &&
      (item.type?.toString().toLowerCase() ?? "") === contentType.toLowerCase(),
  );

  if (!match || !match.id) {
    return notFound();
  }

  const item = await fetchCatalogItemById(match.id);

  if (!item) {
    return notFound();
  }

  const description =
    (item as CatalogItem).longDescription ||
    (item as CatalogItem).shortDescription ||
    "Keine Beschreibung";

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#0f172a] text-slate-100">
      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <ReferrerNav
          segmentName={(item as CatalogItem).segmentName as string | undefined}
          clusterName={(item as CatalogItem).clusterName as string | undefined}
          macroClusterName={(item as CatalogItem).macroClusterName as string | undefined}
        />
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg md:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${typeStyles[contentType]}`}
            >
              {typeLabels[contentType]}
            </span>
            <span className="text-xs text-slate-400">
              {item.segmentName || item.clusterName || item.macroClusterName || "Catalog Item"}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white md:text-4xl">{item.name}</h1>
          {item.shortDescription && (
            <p className="mt-3 text-base text-slate-300">{item.shortDescription}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
            <span className="rounded-full bg-slate-800 px-3 py-1">
              Typ: {typeLabels[contentType]}
            </span>
            {item.segmentName && (
              <span className="rounded-full bg-slate-800 px-3 py-1">Segment: {item.segmentName}</span>
            )}
            {item.clusterName && (
              <span className="rounded-full bg-slate-800 px-3 py-1">Cluster: {item.clusterName}</span>
            )}
            {item.macroClusterName && (
              <span className="rounded-full bg-slate-800 px-3 py-1">
                Makro-Cluster: {item.macroClusterName}
              </span>
            )}
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow">
          <h2 className="text-xl font-semibold text-white">Beschreibung</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{description}</p>
        </section>
      </main>
    </div>
  );
}
