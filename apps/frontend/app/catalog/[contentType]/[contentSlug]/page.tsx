import { fetchGrid } from "@/lib/api/grid";
import type {
  Cluster,
  MacroCluster,
  Segment,
  SegmentContentItem,
  SegmentContentType,
} from "@/types/grid";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ contentType: SegmentContentType; contentSlug: string }> | {
    contentType: SegmentContentType;
    contentSlug: string;
  };
};

type ContentMatch = {
  content: SegmentContentItem;
  segment: Segment;
  cluster: Cluster;
  macroCluster: MacroCluster;
  type: SegmentContentType;
};

const typeLabels: Record<SegmentContentType, string> = {
  concept: "Konzept",
  method: "Methode",
  tool: "Tool",
  technology: "Technologie",
};

const typeStyles: Record<SegmentContentType, string> = {
  method: "bg-purple-500/15 text-purple-200 border-purple-500/30",
  concept: "bg-sky-500/15 text-sky-200 border-sky-500/30",
  tool: "bg-teal-500/15 text-teal-200 border-teal-500/30",
  technology: "bg-amber-500/15 text-amber-200 border-amber-500/30",
};

async function findContent(
  contentType: SegmentContentType,
  contentSlug: string,
): Promise<ContentMatch | null> {
  const grid = await fetchGrid();
  const macroClusters = grid.data?.macroClusters ?? [];

  const keyMap: Record<SegmentContentType, keyof Segment["content"]> = {
    concept: "concepts",
    method: "methods",
    tool: "tools",
    technology: "technologies",
  };

  const contentKey = keyMap[contentType];

  for (const macroCluster of macroClusters) {
    for (const cluster of macroCluster.clusters ?? []) {
      for (const segment of cluster.segments ?? []) {
        const content = segment.content?.[contentKey];
        const match = content?.find((item) => item.slug === contentSlug);
        if (match) {
          return { content: match, segment, cluster, macroCluster, type: contentType };
        }
      }
    }
  }

  return null;
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { contentType, contentSlug } = await params;
  const match = await findContent(contentType, contentSlug);

  if (!match) {
    return notFound();
  }

  const { content, segment, cluster, macroCluster, type } = match;
  const description = content.longDescription || content.shortDescription || "Keine Beschreibung";

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#0f172a] text-slate-100">
      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/grid" className="hover:text-slate-200">
            Start
          </Link>
          <span>/</span>
          <Link href={`/grid/${macroCluster.slug}`} className="hover:text-slate-200">
            {macroCluster.name}
          </Link>
          <span>/</span>
          <Link href={`/grid/${macroCluster.slug}/${cluster.slug}`} className="hover:text-slate-200">
            {cluster.name}
          </Link>
          <span>/</span>
          <span className="text-slate-200">{content.name}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg md:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${typeStyles[type]}`}
            >
              {typeLabels[type]}
            </span>
            <span className="text-xs text-slate-400">{segment.name}</span>
          </div>

          <h1 className="text-3xl font-bold text-white md:text-4xl">{content.name}</h1>
          {content.shortDescription && (
            <p className="mt-3 text-base text-slate-300">{content.shortDescription}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
            <span className="rounded-full bg-slate-800 px-3 py-1">Typ: {typeLabels[type]}</span>
            <span className="rounded-full bg-slate-800 px-3 py-1">Segment: {segment.name}</span>
            <span className="rounded-full bg-slate-800 px-3 py-1">Cluster: {cluster.name}</span>
            <span className="rounded-full bg-slate-800 px-3 py-1">
              Makro-Cluster: {macroCluster.name}
            </span>
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
