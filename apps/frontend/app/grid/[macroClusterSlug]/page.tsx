import { fetchGrid } from "@/lib/api/grid";
import type { Cluster, MacroCluster } from "@/types/grid";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ macroClusterSlug: string }> | { macroClusterSlug: string };
};

function findMacroCluster(slug: string, macroClusters: MacroCluster[]): MacroCluster | null {
  return macroClusters.find((macroCluster) => macroCluster.slug === slug) ?? null;
}

export default async function MacroClusterPage({ params }: PageProps) {
  const { macroClusterSlug } = await params;
  const grid = await fetchGrid();
  const macroCluster = findMacroCluster(macroClusterSlug, grid.data?.macroClusters ?? []);

  if (!macroCluster) {
    return notFound();
  }

  const clusters: Cluster[] = macroCluster.clusters ?? [];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <nav className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <Link href="/grid" className="hover:text-slate-200">
                Start
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-200">{macroCluster.name}</span>
            </nav>
            <h1 className="text-3xl font-bold text-white md:text-4xl">{macroCluster.name}</h1>
            <p className="text-sm text-slate-300 md:text-base">
              {macroCluster.shortDescription || macroCluster.longDescription}
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            >
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.78l5 5L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14"
              />
            </svg>
            <input
              type="text"
              placeholder="Filter Cluster..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-nexo-aqua/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clusters.map((cluster) => (
            <Link
              key={cluster.slug}
              href={`/grid/${macroCluster.slug}/${cluster.slug}`}
              className="cursor-pointer rounded-2xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-nexo-aqua/40 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold text-nexo-aqua">
                  {cluster.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-300">
                  {cluster.segments?.length ? `${cluster.segments.length} Segmente` : "Cluster"}
                </span>
              </div>
              <h3 className="mb-1 text-lg font-semibold text-white">{cluster.name}</h3>
              <p className="text-sm text-slate-400">{cluster.shortDescription}</p>
            </Link>
          ))}
          {clusters.length === 0 && (
            <p className="text-sm text-slate-300">
              Für dieses Makro-Cluster sind keine Cluster vorhanden.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
