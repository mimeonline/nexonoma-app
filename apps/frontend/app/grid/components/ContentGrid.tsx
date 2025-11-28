"use client";

import { useEffect, useRef } from "react";
import { Beaker, BookOpenText, Hammer, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ContentItem = {
  title: string;
  kind: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const items: ContentItem[] = [
  { title: "Concept", kind: "Konzept", Icon: Lightbulb },
  { title: "Method", kind: "Methode", Icon: BookOpenText },
  { title: "Tool", kind: "Tool", Icon: Hammer },
  { title: "Technology", kind: "Technologie", Icon: Beaker },
];

type Props = {
  visible: boolean;
};

export function ContentGrid({ visible }: Props) {
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

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 opacity-0 translate-y-2 transition duration-500 sm:grid-cols-2"
    >
      {items.map(({ title, kind, Icon }) => (
        <Card
          key={title}
          className="rounded-xl border border-white/10 bg-[#0B1220] text-white shadow-md shadow-black/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(79,244,224,0.15)] hover:text-[#4FF4E0]"
        >
          <CardHeader className="flex flex-row items-center gap-3 pb-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-cyan-300">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <p className="text-sm text-slate-200/80">{kind}</p>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <p className="text-sm text-slate-200/80">
              Statische 2×2 Platzhalter-Inhalte für das MVP.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
