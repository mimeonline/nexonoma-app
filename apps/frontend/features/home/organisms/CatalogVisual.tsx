import { Button } from "@/components/ui/atoms/Button";
import { CatalogPreviewCard } from "./CatalogPreviewCard";

export function CatalogVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-full">
      {/* Background Glow */}
      <div className="absolute -inset-0.5 rounded-3xl bg-linear-to-tr from-nexo-ocean/20 to-purple-500/10 blur-xl opacity-70"></div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-nexo-surface shadow-2xl">
        {/* Header: Search Simulation */}
        <div className="border-b border-white/5 bg-nexo-surface/90 px-5 py-4 backdrop-blur-md flex items-center justify-between">
          <div className="flex w-full max-w-[280px] items-center gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-slate-500 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span>Filtere nach Tags, Phasen...</span>
          </div>
          {/* Tiny Window Controls Decoration */}
          <div className="flex gap-1.5 opacity-50">
            <div className="h-2 w-2 rounded-full bg-white/20"></div>
            <div className="h-2 w-2 rounded-full bg-white/20"></div>
          </div>
        </div>

        {/* Grid Content: 2 Columns for compact look */}
        <div className="grid grid-cols-2 gap-3 p-5 opacity-50 grayscale-20 mask-[linear-gradient(to_bottom,black_40%,transparent_100%)]">
          <CatalogPreviewCard title="Domain Driven Design" type="Concept" color="text-nexo-ocean" />
          <CatalogPreviewCard title="Event Storming" type="Method" color="text-nexo-aqua" />
          <CatalogPreviewCard title="Kubernetes" type="Tech" color="text-orange-400" />
          <CatalogPreviewCard title="Terraform" type="Tool" color="text-purple-400" />
          <CatalogPreviewCard title="Clean Architecture" type="Concept" color="text-nexo-ocean" />
          <CatalogPreviewCard title="Team Topologies" type="Method" color="text-nexo-aqua" />
        </div>

        {/* Overlay CTA */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 z-10">
          <Button variant="outline" className="h-10 border-white/10 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 shadow-xl">
            Katalog öffnen
          </Button>
        </div>
      </div>
    </div>
  );
}
