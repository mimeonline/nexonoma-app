"use client";

import { fetchGrid } from "@/lib/api/grid";
import type { MacroCluster } from "@/types/grid";
import { useEffect, useState } from "react";
import { MacroClusterList } from "./components/MacroClusterList";

export default function GridPage() {
  const [macroClusters, setMacroClusters] = useState<MacroCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGrid()
      .then((response) => setMacroClusters(response.data.macroClusters ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : "Unbekannter Fehler"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">
            Wissensbereiche
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Grid: Makro-Cluster, Cluster und Segmente
          </h1>
          <div className="h-px w-full bg-white/10 my-4" />
          <p className="max-w-3xl text-base text-gray-300">
            Wähle einen Makro-Cluster, öffne die Cluster im Accordion und wechsle auf
            die Segmentseiten.
          </p>
        </header>

        {loading && <p className="text-sm text-slate-200/80">Lade Grid-Daten...</p>}
        {error && (
          <p className="text-sm text-red-300">
            Grid-Daten konnten nicht geladen werden: {error}
          </p>
        )}
        {!loading && !error && <MacroClusterList macroClusters={macroClusters} />}
      </main>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
