"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { SubCluster } from "../data/categories";

type Props = {
  subclusters: SubCluster[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function SubClusterGrid({ subclusters, selectedId, onSelect }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observerRef.current?.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid gap-4 opacity-0 translate-y-2 transition duration-500 md:grid-cols-2 lg:grid-cols-3"
    >
      {subclusters.map((sub) => (
        <button
          key={sub.id}
          onClick={() => onSelect(sub.id)}
          className="text-left"
        >
          <Card
            className={`rounded-xl border border-white/10 bg-[#0B1220] text-white shadow-md shadow-black/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(79,244,224,0.15)] ${
              selectedId === sub.id ? "border-cyan-400 text-[#4FF4E0]" : ""
            }`}
          >
            <CardContent className="p-4">
              <CardTitle className="text-base">{sub.title}</CardTitle>
              <p className="pt-1 text-sm text-slate-200/80">Zeige Inhalte</p>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}
