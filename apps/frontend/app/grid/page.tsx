"use client";

import { ClusterList } from "./components/ClusterList";
import { clusters } from "./data/categories";

export default function GridPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">
            Wissensbereiche
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Grid: Makro-Cluster, Sub-Cluster und Segmente
          </h1>
          <div className="h-px w-full bg-white/10 my-4" />
          <p className="max-w-3xl text-base text-gray-300">
            Wähle einen Makro-Cluster, öffne die Sub-Cluster im Accordion und wechsle auf
            Cluster- und Segmentseiten.
          </p>
        </header>

        <ClusterList clusters={clusters} />
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
