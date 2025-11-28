"use client";

import { createRef, useMemo, useRef, useState } from "react";
import { ContentGrid } from "./components/ContentGrid";
import { MegaCard } from "./components/MegaCard";
import { categories } from "./data/categories";

export default function GridPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const categoryRefs = useMemo(
    () =>
      Object.fromEntries(
        categories.map((cat) => [cat.id, createRef<HTMLDivElement>()]),
      ) as Record<string, React.RefObject<HTMLDivElement>>,
    [],
  );

  const handleToggle = (id: string) => {
    setSelectedSub(null);
    setOpenCategory((prev) => {
      const next = prev === id ? null : id;
      if (next) {
        requestAnimationFrame(() =>
          categoryRefs[next]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        );
      }
      return next;
    });
  };

  const handleSubSelect = (id: string) => {
    setSelectedSub(id);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12 pt-5 sm:pt-20 sm:pb-16">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">
            Wissensbereiche
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Öffne eine Kategorie, um Sub-Cluster und Inhalte anzuzeigen.
          </h1>
          <div className="h-px w-full bg-white/10 my-4" />
          <p className="mt-0.5 max-w-3xl text-base text-gray-300">
            Mega-Card Expand: wähle eine Hauptkategorie, öffne Sub-Cluster und sieh die 2×2 Inhalte.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <MegaCard
              key={category.id}
              category={category}
              isOpen={openCategory === category.id}
              onToggle={handleToggle}
              onSubSelect={handleSubSelect}
              contentRef={contentRef}
              containerRef={categoryRefs[category.id]}
            />
          ))}
        </div>

        <div ref={contentRef} className="pt-6 pl-2">
          <ContentGrid visible={Boolean(selectedSub)} />
        </div>
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
