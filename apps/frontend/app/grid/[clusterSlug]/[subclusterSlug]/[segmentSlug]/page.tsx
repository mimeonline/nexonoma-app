"use client";

import { useEffect, useMemo, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { BackButton } from "../../../components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchGrid } from "@/lib/api/grid";
import type {
  Cluster,
  MacroCluster,
  Segment,
  SegmentContent,
  SegmentContentType,
} from "@/types/grid";

type Params = {
  clusterSlug: string;
  subclusterSlug: string;
  segmentSlug: string;
};

const contentGroups: Array<{ key: keyof SegmentContent; label: string; type: SegmentContentType }> = [
  { key: "concepts", label: "Concept", type: "concept" },
  { key: "methods", label: "Method", type: "method" },
  { key: "tools", label: "Tool", type: "tool" },
  { key: "technologies", label: "Technology", type: "technology" },
];

export default function SegmentPage({ params }: { params: Promise<Params> }) {
  const { clusterSlug, subclusterSlug, segmentSlug } = use(params);

  const [macroCluster, setMacroCluster] = useState<MacroCluster | null>(null);
  const [subcluster, setSubcluster] = useState<Cluster | null>(null);
  const [segment, setSegment] = useState<Segment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openType, setOpenType] = useState<SegmentContentType | null>(null);

  useEffect(() => {
    fetchGrid()
      .then((response) => {
        const foundMacro =
          response.data?.macroClusters?.find((macro) => macro.slug === clusterSlug) ?? null;
        setMacroCluster(foundMacro);
        const foundSub = foundMacro?.clusters?.find((c) => c.slug === subclusterSlug) ?? null;
        setSubcluster(foundSub);
        const foundSegment = foundSub?.segments?.find((seg) => seg.slug === segmentSlug) ?? null;
        setSegment(foundSegment);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unbekannter Fehler"))
      .finally(() => setLoading(false));
  }, [clusterSlug, segmentSlug, subclusterSlug]);

  const labelMap = useMemo(
    () =>
      contentGroups.reduce<Record<SegmentContentType, string>>((acc, entry) => {
        acc[entry.type] = entry.label;
        return acc;
      }, {} as Record<SegmentContentType, string>),
    [],
  );

  const toggleType = (type: SegmentContentType) =>
    setOpenType((prev) => (prev === type ? null : type));

  if (!loading && !error && (!macroCluster || !subcluster || !segment)) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <BackButton
          href={`/grid/${macroCluster?.slug ?? ""}/${subcluster?.slug ?? ""}`}
          label="Zurück zum Sub-Cluster"
        />
        <header className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">
            Segment
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {segment?.name ?? "Lade Segment..."}
          </h1>
          <p className="text-base text-gray-300">
            Wähle einen Content-Typ für {segment?.name ?? "dieses Segment"}.
          </p>
        </header>

        {loading && <p className="text-sm text-slate-200/80">Lade Segment...</p>}
        {error && <p className="text-sm text-red-300">Fehler: {error}</p>}

        {!loading && !error && segment && (
          <div className="space-y-3">
            {contentGroups.map(({ key, label, type }) => {
              const items = segment.content?.[key] ?? [];
              const isOpen = openType === type;

              return (
                <Card
                  key={key}
                  className={`overflow-hidden border border-white/10 bg-[#1A2E5D] text-white transition duration-200 ${
                    isOpen ? "border-cyan-400 shadow-[0_0_20px_rgba(79,244,224,0.15)]" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleType(type)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:text-[#4FF4E0]"
                  >
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/80">
                        {label}
                      </p>
                      <p className="text-xs text-slate-300">{items.length} Einträge</p>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-[#4FF4E0] transition" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-300 transition" />
                    )}
                  </button>
                  <div
                    className={`grid transition-[max-height,opacity] duration-300 ease-out ${
                      isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <CardContent className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
                      {items.map((item) => (
                        <Card
                          key={item.slug}
                          className="border border-white/10 bg-[#0B1220] text-white transition hover:border-cyan-400 hover:text-[#4FF4E0]"
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                              {labelMap[type]}
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm text-slate-200/85">
                            <p>{item.shortDescription}</p>
                            <Link
                              href={`/grid/${macroCluster?.slug ?? ""}/${subcluster?.slug ?? ""}/${segment.slug}/${type}/${item.slug}`}
                              className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[#4FF4E0] transition hover:border-cyan-400 hover:bg-white/10"
                            >
                              Öffnen
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                      {items.length === 0 && (
                        <p className="text-sm text-slate-200/75">Keine Einträge verfügbar.</p>
                      )}
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
