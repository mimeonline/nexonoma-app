import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentItem } from "../data/categories";

type Props = {
  clusterSlug: string;
  segmentSlug: string;
  contents: Record<ContentItem["type"], ContentItem[]>;
};

const labels: Record<ContentItem["type"], string> = {
  concept: "Concept",
  method: "Method",
  tool: "Tool",
  technology: "Technology",
};

export function ContentTypeList({ clusterSlug, segmentSlug, contents }: Props) {
  const types = Object.keys(contents) as Array<ContentItem["type"]>;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {types.map((type) => {
        const first = contents[type][0];
        return (
          <Card
            key={type}
            className="border border-white/10 bg-[#1A2E5D] text-white transition hover:border-cyan-400"
          >
            <CardHeader className="pb-1">
              <CardTitle className="text-lg">{labels[type]}</CardTitle>
              <p className="text-sm text-slate-300">{contents[type].length} Einträge</p>
            </CardHeader>
            <CardContent className="pt-1 text-sm text-slate-200/85">
              <p className="mb-3">Öffne die Liste oder direkt ein Detail.</p>
              <div className="flex gap-3 text-[#4FF4E0] font-semibold">
                <Link
                  href={`/grid/${clusterSlug}/${segmentSlug}/${type}/${first.slug}`}
                  className="hover:underline"
                >
                  Erstes Detail öffnen
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
