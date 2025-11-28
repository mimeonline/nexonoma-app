"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import type { Category } from "../data/categories";
import { iconMap } from "../data/categories";
import { SubClusterGrid } from "./SubClusterGrid";

type Props = {
  category: Category;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onSubSelect: (subId: string) => void;
  contentRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
};

export function MegaCard({
  category,
  isOpen,
  onToggle,
  onSubSelect,
  contentRef,
  containerRef,
}: Props) {
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const Icon = iconMap[category.icon];

  const handleSubSelect = (id: string) => {
    setSelectedSub(id);
    onSubSelect(id);
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Card
      ref={containerRef}
      className={`w-full overflow-hidden border border-white/5 bg-[#1A2E5D] text-white transition-all duration-300 hover:border-cyan-400 ${
        isOpen
          ? "border-cyan-400 bg-[#1F2B4A] shadow-lg shadow-cyan-400/10 shadow-[inset_0_0_25px_rgba(79,244,224,0.15)]"
          : ""
      }`}
    >
      <button
        className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left"
        onClick={() => onToggle(category.id)}
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-cyan-300">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <CardTitle className="text-xl">{category.title}</CardTitle>
            <p className="text-sm text-slate-200/80">Sub-Cluster öffnen</p>
          </div>
        </div>
        <ChevronRight
          className={`h-5 w-5 transition-all duration-300 ${
            isOpen ? "rotate-90 text-cyan-400" : "text-gray-400"
          }`}
        />
      </button>

      <div
        className={`grid transition-[max-height,opacity,transform] duration-500 ease-out ${
          isOpen
            ? "max-h-[2000px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-1 overflow-hidden"
        }`}
      >
        <div className="px-6 pb-6 animate-fadeIn">
          <SubClusterGrid
            subclusters={category.subclusters}
            onSelect={handleSubSelect}
            selectedId={selectedSub}
          />
        </div>
      </div>
    </Card>
  );
}
